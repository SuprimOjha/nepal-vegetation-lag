"""FastAPI endpoints for transparent, reproducible Nepal research."""
from typing import Literal
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from services.processor import (
    DATA_SOURCES,
    NEPAL_BOUNDING_BOX,
    ZONE_PROFILES,
    process_nepal_lag_analysis,
)

app = FastAPI(
    title="EonPulse Nepal Research API",
    version="0.2.0",
    description=(
        "Transparent research API. It distinguishes service health and NASA "
        "catalog references from downloaded data and computed scientific results."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://south-asia-vegetation-lag.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[
        "localhost",
        "127.0.0.1",
        "*.onrender.com",
        "south-asia-vegetation-lag.vercel.app",
    ],
)


@app.get("/health")
def health_check():
    """Service health only; this does not claim that data processing ran."""
    return {
        "status": "ok",
        "service": "EonPulse Nepal Research API",
        "analysis_status": "not_computed",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/datasets")
def get_datasets():
    """Return documented source products, not a claim that they are downloaded."""
    return {
        "status": "source_catalog",
        "data_downloaded": False,
        "datasets": DATA_SOURCES,
    }


@app.get("/api/regions")
def get_regions():
    """Geographic study zones only; intentionally no invented statistics."""
    return {
        "status": "ok",
        "regions": [
            {"id": "all", "name": "All Nepal Aggregate", "country": "Nepal"},
            {"id": "terai", "name": "Terai Lowlands", "country": "Nepal"},
            {"id": "siwalik", "name": "Siwalik Hills", "country": "Nepal"},
            {"id": "midhills", "name": "Mid-Hills", "country": "Nepal"},
            {"id": "kathmandu", "name": "Kathmandu Valley", "country": "Nepal"},
            {"id": "highmountains", "name": "High Mountains & Himalayas", "country": "Nepal"},
        ],
    }


@app.get("/api/analysis/nepal")
def get_nepal_analysis(
    zone: Literal["all", "terai", "siwalik", "midhills", "kathmandu", "highmountains"] = "all",
    max_lag: int = Query(default=6, ge=0, le=24),
    start_year: int = Query(default=2003, ge=2000, le=2100),
    end_year: int = Query(default=2024, ge=2000, le=2100),
):
    if start_year > end_year:
        raise HTTPException(status_code=422, detail="start_year must be <= end_year")
    try:
        return process_nepal_lag_analysis(
            zone_id=zone,
            max_lag=max_lag,
            start_year=start_year,
            end_year=end_year,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@app.get("/api/methodology")
def get_methodology():
    return {
        "status": "planned_not_run",
        "method": "Monthly rainfall-to-NDVI lag analysis",
        "steps": [
            {"id": 1, "name": "Acquire source granules", "status": "not_started"},
            {"id": 2, "name": "Apply product quality masks and scale factors", "status": "not_started"},
            {"id": 3, "name": "Reproject and align monthly grids", "status": "not_started"},
            {"id": 4, "name": "Aggregate or mask to the documented Nepal boundary", "status": "not_started"},
            {"id": 5, "name": "Remove month-of-year climatology and trend as documented", "status": "not_started"},
            {"id": 6, "name": "Calculate lagged Pearson correlation for lags 0..max_lag", "status": "not_started"},
            {"id": 7, "name": "Calculate sample size, confidence intervals and p-values", "status": "not_started"},
            {"id": 8, "name": "Correct for multiple testing and export analysis manifest", "status": "not_started"},
        ],
        "definitions": {
            "NDVI": "(NIR - red) / (NIR + red), as provided by the source product after scale/quality handling",
            "lag_months": "A lag k compares rainfall anomalies at month t with NDVI anomalies at month t+k; this convention must be held constant.",
            "pearson_r": "Pearson product-moment correlation, defined only for valid paired samples with non-zero variance.",
            "p_value": "A statistical test result; it is not proof of causation and must be accompanied by sample size and multiple-testing policy.",
            "missing_data": "Cloud, snow, quality-mask, and missing-product observations must remain missing, not be silently replaced with zero.",
        },
    }


@app.get("/api/provenance")
def get_provenance():
    return {
        "status": "partial_provenance",
        "data_computed": False,
        "boundary": {
            "format": "WGS84 bounding box",
            "west_longitude": NEPAL_BOUNDING_BOX[0],
            "south_latitude": NEPAL_BOUNDING_BOX[1],
            "east_longitude": NEPAL_BOUNDING_BOX[2],
            "north_latitude": NEPAL_BOUNDING_BOX[3],
            "note": "A bounding box includes areas outside Nepal. A validated Nepal administrative polygon is required for country-only pixel masking.",
        },
        "sources": DATA_SOURCES,
        "reproducibility": {
            "code_revision": "See the repository commit history",
            "analysis_run_id": None,
            "input_file_checksums": [],
            "parameters": None,
            "warning": "No scientific run has been completed, so there are no result files, checksums, or run identifier to verify yet.",
        },
    }
