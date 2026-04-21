from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from geoalchemy2 import Geometry
from app.models.base import Base

class Region(Base):
    __tablename__ = "regions"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    federal_district = Column(String)
    oktmo_code = Column(String)

class Municipality(Base):
    __tablename__ = "municipalities"
    id = Column(Integer, primary_key=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=False)
    name = Column(String, nullable=False)
    mo_type = Column(String)
    oktmo_code = Column(String)
    geom = Column(Geometry('MULTIPOLYGON', srid=4326))

class PopulationHistory(Base):
    __tablename__ = "population_history"
    id = Column(Integer, primary_key=True)
    mo_id = Column(Integer, ForeignKey("municipalities.id"), nullable=False)
    year = Column(Integer, nullable=False)
    population = Column(Float)
    birth_rate = Column(Float)
    death_rate = Column(Float)
    natural_growth = Column(Float)
    migration = Column(Float)
    source = Column(String)

class PopulationForecast(Base):
    __tablename__ = "population_forecast"
    id = Column(Integer, primary_key=True)
    mo_id = Column(Integer, ForeignKey("municipalities.id"), nullable=False)
    forecast_year = Column(Integer, nullable=False)
    horizon_years = Column(Integer, nullable=False)
    value_low = Column(Float)
    value_mid = Column(Float)
    value_high = Column(Float)
    model_name = Column(String, nullable=False)
    created_at = Column(DateTime)

class ModelMetrics(Base):
    __tablename__ = "model_metrics"
    id = Column(Integer, primary_key=True)
    mo_id = Column(Integer, ForeignKey("municipalities.id"), nullable=False)
    model_name = Column(String, nullable=False)
    mape = Column(Float)
    rmse = Column(Float)
    mae = Column(Float)
    r2 = Column(Float)
    train_period = Column(String)
    test_period = Column(String)

class ReportTask(Base):
    __tablename__ = "report_tasks"
    id = Column(Integer, primary_key=True)
    task_id = Column(String, unique=True, nullable=False)
    mo_id = Column(Integer, ForeignKey("municipalities.id"), nullable=False)
    horizon = Column(Integer, nullable=False)
    status = Column(String, default="pending")
    content = Column(Text)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)