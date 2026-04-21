.PHONY: run down help install db-up db-down

help:
	@echo "Available commands:"
	@echo "  make run          - Start the full application (DB + server)"
	@echo "  make down         - Stop the application"
	@echo "  make install      - Install dependencies"
	@echo "  make db-up        - Start PostgreSQL database"
	@echo "  make db-down      - Stop PostgreSQL database"

run: db-up
	@echo "Starting FastAPI server..."
	uv run uvicorn app.main:app --reload

down:
	@echo "Stopping application..."
	@pkill -f "uvicorn app.main:app" || true
	@echo "Stopping database..."
	docker compose down
	@echo "Application stopped"

install:
	@echo "Installing dependencies..."
	uv sync

db-up:
	@echo "Starting PostgreSQL with PostGIS..."
	docker compose up -d
	@sleep 2
	@echo "Database is ready"

db-down:
	@echo "Stopping database..."
	docker compose down