"""Truthful analysis contract for the Nepal vegetation-lag prototype.

This module intentionally does not manufacture satellite measurements. Until the
MODIS and GPM granules have been downloaded, quality-screened, aligned, and
processed, it returns a not-computed status rather than illustrative statistics.
"""
from datetime import datetime, timezone

NEPAL_BOUNDING_BOX = (80.05, 26.34, 88.20, 30.45)  # west, south, east, north

ZONE_PROFILES = {
    "terai": {"name": "Terai Lowlands"},
    "siwalik": {"name": "Siwalik Hills"},
    "midhills": {"name": "Mid-Hills"},
    "kathmandu": {"name": "Kathmandu Valley"},
    "highmountains": {"name": "High Mountains & Himalayas"},
    "all": {"name": "All Nepal Aggregate"},
}

DATA_SOURCES = [
    {
        "short_name": "MOD13A3",
        "title": "MODIS/Terra Vegetation Indices Monthly L3 Global 1 km SIN Grid",
        "variable": "NDVI",
        "provider": "NASA LP DAAC",
        "landing_page": "https://doi.org/10.5067/MODIS/MOD13A3.061",
        "catalog": "https://search.earthdata.nasa.gov/search?q=MOD13A3",
        "status": "not_downloaded",
        "role": "Vegetation response variable",
    },
    {
        "short_name": "GPM_3IMERGM",
        "title": "GPM IMERG Monthly Precipitation",
        "variable": "precipitation",
        "provider": "NASA GES DISC",
        "landing_page": "https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGM_07/summary",
        "catalog": "https://search.earthdata.nasa.gov/search?q=GPM_3IMERGM",
        "status": "not_downloaded",
        "role": "Rainfall predictor",
    },
    {
        "short_name": "SRTMGL1",
        "title": "NASA Shuttle Radar Topography Mission Global 1 arc second",
        "variable": "elevation",
        "provider": "NASA LP DAAC",
        "landing_page": "https://doi.org/10.5067/MEaSUREs/SRTM/SRTMGL1.003",
        "catalog": "https://search.earthdata.nasa.gov/search?q=SRTMGL1",
        "status": "reference_only",
        "role": "Terrain context; not currently used in calculations",
    },
]


def process_nepal_lag_analysis(
    zone_id: str = "all",
    max_lag: int = 6,
    start_year: int = 2003,
    end_year: int = 2024,
):
    """Return an explicit unavailable result until validated source arrays exist."""
    zone_meta = ZONE_PROFILES.get(zone_id)
    if zone_meta is None:
        raise ValueError(f"Unknown zone: {zone_id}")
    if start_year < 2000 or end_year > datetime.now(timezone.utc).year:
        raise ValueError("Requested years are outside the supported request range")
    if start_year > end_year:
        raise ValueError("start_year must be less than or equal to end_year")
    if not 0 <= max_lag <= 24:
        raise ValueError("max_lag must be between 0 and 24 months")

    return {
        "status": "not_computed",
        "analysis_status": "not_computed",
        "analysis_reason": (
            "No validated, downloaded MOD13A3 NDVI and GPM IMERG precipitation "
            "time-series are available to this deployment. Catalog references or "
            "a successful API health check are not evidence that analysis ran."
        ),
        "zone": zone_id,
        "zone_name": zone_meta["name"],
        "year_start": start_year,
        "year_end": end_year,
        "max_lag_months": max_lag,
        "domain": "Nepal study bounding box",
        "bounding_box": list(NEPAL_BOUNDING_BOX),
        "time_series": None,
        "lag_analysis": [],
        "data_sources": DATA_SOURCES,
        "provenance": {
            "generated_at_utc": datetime.now(timezone.utc).isoformat(),
            "calculation_performed": False,
            "measurements_included": False,
            "catalog_discovery_is_analysis": False,
            "software": "EonPulse Nepal API",
        },
    }
