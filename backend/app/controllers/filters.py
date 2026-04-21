from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.models import Region, Municipality

router = APIRouter()

@router.get("/regions")
async def get_regions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Region).order_by(Region.name))
    regions = result.scalars().all()
    return [{"id": r.id, "name": r.name} for r in regions]

@router.get("/municipalities")
async def get_municipalities(region_id: int = None, db: AsyncSession = Depends(get_db)):
    query = select(Municipality)
    if region_id:
        query = query.where(Municipality.region_id == region_id)
    query = query.order_by(Municipality.name)
    result = await db.execute(query)
    municipalities = result.scalars().all()
    return [{"id": m.id, "name": m.name, "region_id": m.region_id} for m in municipalities]

@router.get("/years")
async def get_years(db: AsyncSession = Depends(get_db)):
    from app.models.models import PopulationHistory
    result = await db.execute(select(PopulationHistory.year).distinct().order_by(PopulationHistory.year))
    years = result.scalars().all()
    return years