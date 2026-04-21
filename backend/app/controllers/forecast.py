from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.models import PopulationHistory, PopulationForecast, ModelMetrics
import pandas as pd
from prophet import Prophet
import numpy as np

router = APIRouter()

@router.get("/config")
async def get_forecast_config():
    return {
        "models": [{"name": "prophet", "description": "Facebook Prophet"}],
        "horizons": [5, 10, 15]
    }

@router.get("/calculate")
async def calculate_forecast(
    mo_id: int,
    horizon: int,
    model: str = "prophet",
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(PopulationHistory).where(PopulationHistory.mo_id == mo_id).order_by(PopulationHistory.year))
    history = result.scalars().all()
    if len(history) < 5:
        raise HTTPException(status_code=422, detail="Недостаточно исторических данных для построения прогноза")

    df = pd.DataFrame([{"ds": pd.Timestamp(year=h.year, month=1, day=1), "y": h.population} for h in history])

    m = Prophet()
    m.fit(df)

    future = m.make_future_dataframe(periods=horizon, freq='Y')
    forecast = m.predict(future)

    chart_data = []
    for i, row in forecast.iterrows():
        chart_data.append({
            "year": row['ds'].year,
            "fact": row['yhat'] if i < len(df) else None,
            "forecast": row['yhat'] if i >= len(df) else None,
            "low": row['yhat_lower'],
            "high": row['yhat_upper']
        })

    if len(df) > 1:
        test_df = df.iloc[-1:]
        pred = forecast.iloc[len(df)-1:len(df)]
        mape = np.mean(np.abs((test_df['y'].values - pred['yhat'].values) / test_df['y'].values)) * 100
        rmse = np.sqrt(np.mean((test_df['y'].values - pred['yhat'].values)**2))
        mae = np.mean(np.abs(test_df['y'].values - pred['yhat'].values))
    else:
        mape = rmse = mae = None

    return {
        "chart_data": chart_data,
        "metrics": {
            "mape": mape,
            "rmse": rmse,
            "mae": mae
        }
    }