from fastapi import APIRouter
from app.controllers import filters, monitoring, forecast, reports, api

router = APIRouter()

router.include_router(api.router, tags=["api"])
router.include_router(filters.router, prefix="/filters", tags=["filters"])
router.include_router(monitoring.router, prefix="/monitoring", tags=["monitoring"])
router.include_router(forecast.router, prefix="/forecast", tags=["forecast"])
router.include_router(reports.router, prefix="/reports", tags=["reports"])