# Population Monitoring API

This is a FastAPI-based backend for monitoring and forecasting population dynamics in Russian municipalities.

## Features

- Monitoring: View population statistics, demographics, and heatmaps
- Forecasting: Predict population trends using ML models (Prophet)
- Reports: Generate AI-powered analytical reports

## Setup

1. Install dependencies:
   ```bash
   uv sync
   ```

2. Start the database:
   ```bash
   docker compose up -d
   ```

3. Start the server:
   ```bash
   uv run uvicorn app.main:app --reload
   ```

## API Endpoints

- `/api/municipalities` - список с возможностью фильтрации.
- `/api/stats` - выдача статистики для графиков.
- `/api/heatmap` - выдача файла GeoJSON, где к каждому полигону приклеен показатель плотности населения.
- `/api/filters/regions` - List regions
- `/api/filters/municipalities` - List municipalities
- `/api/filters/years` - Available years
- `/api/monitoring/summary` - KPI summary
- `/api/monitoring/heatmap` - Heatmap data (GeoJSON)
- `/api/monitoring/top-dynamics` - Top growth/decline
- `/api/forecast/config` - Forecast configuration
- `/api/forecast/calculate` - Calculate forecast
- `/api/reports/generate` - Generate report
- `/api/reports/status/{task_id}` - Report status
- `/api/reports/download/{task_id}` - Download report

## Database

Uses PostgreSQL with PostGIS for spatial data.

Tables:
- regions
- municipalities (with geom)
- population_history
- population_forecast
- model_metrics
- report_tasks