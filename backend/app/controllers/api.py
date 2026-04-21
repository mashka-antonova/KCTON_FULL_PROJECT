from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from app.db.session import get_db
from app.models.models import PopulationHistory, Municipality, Region
import geojson

router = APIRouter()

@router.get("/municipalities")
async def get_municipalities(region_id: int = Query(None), db: AsyncSession = Depends(get_db)):
    """
    GET /api/municipalities — список муниципалитетов с возможностью фильтрации.
    Query параметры: region_id (опционально)
    """
    query = select(Municipality)
    if region_id:
        query = query.where(Municipality.region_id == region_id)
    query = query.order_by(Municipality.name)
    result = await db.execute(query)
    municipalities = result.scalars().all()
    return [{"id": m.id, "name": m.name, "region_id": m.region_id, "mo_type": m.mo_type} for m in municipalities]

@router.get("/stats")
async def get_stats(
    start_year: int = Query(...),
    end_year: int = Query(...),
    region_id: int = Query(None),
    mo_id: int = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """
    GET /api/stats — выдача статистики для графиков.
    Query параметры: start_year, end_year, region_id (опционально), mo_id (опционально)
    """
    if start_year > end_year:
        raise HTTPException(status_code=400, detail="Начальный год не может быть больше конечного")

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
        subquery = select(Municipality.id).where(Municipality.region_id == region_id)
        query = query.where(PopulationHistory.mo_id.in_(subquery))

    result = await db.execute(query)
    row = result.first()

    if not row or not row.total_population:
        raise HTTPException(status_code=404, detail="Статистические данные за выбранный период отсутствуют")

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
    start_year: int = Query(...),
    end_year: int = Query(...),
    region_id: int = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """
    GET /api/heatmap — выдача файла GeoJSON, где к каждому полигону приклеен показатель плотности населения.
    Query параметры: start_year, end_year, region_id (опционально)
    """
    
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

    if not rows:
        raise HTTPException(status_code=404, detail="Геоданные не найдены")

    features = []
    for row in rows:
        if row.geom:
            try:
                geom = geojson.loads(row.geom)
                density = row.avg_population / 100 if row.avg_population else 0
                features.append(geojson.Feature(
                    geometry=geom,
                    properties={
                        "id": row.id,
                        "name": row.name,
                        "density": density,
                        "population": row.avg_population or 0
                    }
                ))
            except Exception:
                continue

    return geojson.FeatureCollection(features)
