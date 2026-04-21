from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from app.db.session import get_db
from app.models.models import PopulationHistory, Municipality, Region
import geojson

router = APIRouter()

@router.get("/summary")
async def get_summary(
    start_year: int,
    end_year: int,
    region_id: int = None,
    mo_id: int = None,
    db: AsyncSession = Depends(get_db)
):
    if start_year > end_year:
        raise HTTPException(status_code=400, detail="Начальный год не может быть больше конечного")

    # Build query
    query = select(
        func.sum(PopulationHistory.population).label("total_population"),
        func.avg(PopulationHistory.birth_rate).label("avg_birth_rate"),
        func.avg(PopulationHistory.death_rate).label("avg_death_rate"),
        func.sum(PopulationHistory.natural_growth).label("total_natural_growth"),
        func.sum(PopulationHistory.migration).label("total_migration")
    ).where(PopulationHistory.year.between(start_year, end_year))

    if mo_id:
        query = query.where(PopulationHistory.mo_id == mo_id)
    elif region_id:
        # Aggregate by region
        subquery = select(Municipality.id).where(Municipality.region_id == region_id)
        query = query.where(PopulationHistory.mo_id.in_(subquery))

    result = await db.execute(query)
    row = result.first()

    if not row or not row.total_population:
        raise HTTPException(status_code=404, detail="Статистические данные за выбранный период отсутствуют")

    # Calculate change
    start_query = select(func.sum(PopulationHistory.population)).where(PopulationHistory.year == start_year)
    end_query = select(func.sum(PopulationHistory.population)).where(PopulationHistory.year == end_year)
    if mo_id:
        start_query = start_query.where(PopulationHistory.mo_id == mo_id)
        end_query = end_query.where(PopulationHistory.mo_id == mo_id)
    elif region_id:
        subquery = select(Municipality.id).where(Municipality.region_id == region_id)
        start_query = start_query.where(PopulationHistory.mo_id.in_(subquery))
        end_query = end_query.where(PopulationHistory.mo_id.in_(subquery))

    start_pop = (await db.execute(start_query)).scalar()
    end_pop = (await db.execute(end_query)).scalar()

    change = ((end_pop - start_pop) / start_pop * 100) if start_pop else 0

    return {
        "population": end_pop,
        "change_percent": change,
        "birth_rate": row.avg_birth_rate,
        "death_rate": row.avg_death_rate,
        "natural_growth": row.total_natural_growth,
        "migration": row.total_migration
    }

@router.get("/heatmap")
async def get_heatmap(
    start_year: int,
    end_year: int,
    region_id: int = None,
    db: AsyncSession = Depends(get_db)
):
    query = """
    SELECT m.id, m.name, ST_AsGeoJSON(m.geom) as geom,
           (SELECT AVG(ph.population) FROM population_history ph WHERE ph.mo_id = m.id AND ph.year BETWEEN :start AND :end) as avg_population
    FROM municipalities m
    """
    params = {"start": start_year, "end": end_year}
    if region_id:
        query += " WHERE m.region_id = :region_id"
        params["region_id"] = region_id

    result = await db.execute(text(query), params)
    rows = result.fetchall()

    features = []
    for row in rows:
        if row.geom:
            geom = geojson.loads(row.geom)
            density = row.avg_population / geom.area if geom.area else 0
            features.append(geojson.Feature(
                geometry=geom,
                properties={
                    "id": row.id,
                    "name": row.name,
                    "density": density,
                    "population": row.avg_population
                }
            ))

    return geojson.FeatureCollection(features)

@router.get("/top-dynamics")
async def get_top_dynamics(
    start_year: int,
    end_year: int,
    region_id: int = None,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    query = """
    SELECT m.id, m.name,
           (end_pop.population - start_pop.population) / start_pop.population * 100 as change_percent
    FROM municipalities m
    JOIN population_history start_pop ON start_pop.mo_id = m.id AND start_pop.year = :start
    JOIN population_history end_pop ON end_pop.mo_id = m.id AND end_pop.year = :end
    """
    params = {"start": start_year, "end": end_year}
    if region_id:
        query += " WHERE m.region_id = :region_id"
        params["region_id"] = region_id

    query += " ORDER BY change_percent DESC"

    result = await db.execute(text(query), params)
    rows = result.fetchall()

    top_growth = [{"id": r.id, "name": r.name, "change_percent": r.change_percent} for r in rows[:limit]]
    top_decline = [{"id": r.id, "name": r.name, "change_percent": r.change_percent} for r in rows[-limit:] if r.change_percent < 0]

    return {
        "top_growth": top_growth,
        "top_decline": top_decline
    }