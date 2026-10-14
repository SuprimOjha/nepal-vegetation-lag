
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Rain-to-Green API",
    description="South Asia rainfall and vegetation response analysis",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "project": "Rain-to-Green",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}


@app.get("/api/analysis/config")
def analysis_config():
    return {
        "region": "South Asia",
        "start_year": 2003,
        "end_year": 2024,
        "max_lag_months": 6,
        "datasets": ["MODIS NDVI", "GPM IMERG rainfall"],
        "status": "analysis_not_started",
    }
