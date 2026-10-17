"""FastAPI endpoints for transparent, reproducible Nepal research."""
from typing import Literal
from datetime import datetime, timezone
import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
try:
    import earthaccess
except ImportError:
    earthaccess = None

from services.processor import (
    DATA_SOURCES,
    NEPAL_BOUNDING_BOX,
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
            "code_revision": os.getenv("RENDER_GIT_COMMIT") or os.getenv("GITHUB_SHA"),
            "analysis_run_id": None,
            "input_file_checksums": [],
            "parameters": None,
            "warning": "No scientific run has been completed, so there are no result files, checksums, or run identifier to verify yet.",
        },
    }


@app.get("/api/catalog/granules")
def search_nasa_granules(
    product: Literal["MOD13A3", "GPM_3IMERGM"] = "MOD13A3",
    start_year: int = Query(default=2023, ge=2000, le=2100),
    end_year: int = Query(default=2023, ge=2000, le=2100),
    limit: int = Query(default=20, ge=1, le=100),
):
    """Query NASA CMR granule metadata. This is catalog discovery, not a download."""
    if start_year > end_year:
        raise HTTPException(status_code=422, detail="start_year must be <= end_year")
    if earthaccess is None:
        raise HTTPException(status_code=503, detail="earthaccess is not installed; NASA catalog lookup unavailable")
    temporal = (f"{start_year}-01-01", f"{end_year}-12-31")
    try:
        results = earthaccess.search_data(
            short_name=product,
            temporal=temporal,
            bounding_box=NEPAL_BOUNDING_BOX,
            count=limit,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"NASA catalog lookup failed: {type(exc).__name__}. No granule count or result has been inferred.",
        ) from exc

    granules = []
    for item in results:
        umm = getattr(item, "umm", None)
        if not isinstance(umm, dict) and isinstance(item, dict):
            umm = item.get("umm", item)
        if not isinstance(umm, dict):
            umm = {}
        temporal_extent = umm.get("TemporalExtent") or {}
        range_datetime = temporal_extent.get("RangeDateTime") or {}
        related_urls = umm.get("RelatedUrls") or []
        urls = [
            entry.get("URL")
            for entry in related_urls
            if isinstance(entry, dict) and entry.get("URL")
        ]
        granules.append({
            "granule_id": umm.get("GranuleUR"),
            "title": umm.get("CollectionReference", {}).get("ShortName", product),
            "beginning_datetime": range_datetime.get("BeginningDateTime"),
            "ending_datetime": range_datetime.get("EndingDateTime"),
            "producer_granule_id": umm.get("DataGranule", {}).get("Identifiers", [{}])[0].get("Identifier") if umm.get("DataGranule", {}).get("Identifiers") else None,
            "links": urls[:10],
        })

    return {
        "status": "catalog_metadata",
        "is_download": False,
        "is_analysis": False,
        "product": product,
        "temporal_filter": {"start": temporal[0], "end": temporal[1]},
        "spatial_filter": {
            "west": NEPAL_BOUNDING_BOX[0],
            "south": NEPAL_BOUNDING_BOX[1],
            "east": NEPAL_BOUNDING_BOX[2],
            "north": NEPAL_BOUNDING_BOX[3],
        },
        "limit": limit,
        "returned_count": len(granules),
        "returned_count_is_total": False,
        "granules": granules,
        "interpretation": "These are NASA catalog metadata records returned for this query, not proof that files were downloaded, quality-screened, or analyzed.",
        "queried_at_utc": datetime.now(timezone.utc).isoformat(),
    }
