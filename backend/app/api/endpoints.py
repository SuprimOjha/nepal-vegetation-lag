from fastapi import APIRouter

router = APIRouter()

@router.get("/datasets")
def get_datasets():
    """Returns metadata for the planned NASA Earth observation datasets."""
    return {
        "region_focus": "Nepal / South Asia",
        "datasets": [
            {
                "short_name": "MOD13A3",
                "name": "MODIS/Terra Vegetation Indices Monthly L3 Global 1km",
                "provider": "NASA LP DAAC",
                "resolution": "1 km",
                "temporal": "Monthly",
                "variables": ["NDVI", "EVI"],
                "format": "HDF4"
            },
            {
                "short_name": "GPM_3IMERGM",
                "name": "GPM IMERG Final Precipitation L3 1 month 0.1 degree",
                "provider": "NASA GES DISC",
                "resolution": "0.1 degree (~10 km)",
                "temporal": "Monthly",
                "variables": ["precipitation"],
                "format": "NetCDF4"
            }
        ]
    }

@router.get("/regions")
def get_regions():
    """Return study-zone metadata without presenting uncomputed results."""
    regions = [
        {"id": "all", "name": "All Nepal Aggregate", "country": "Nepal"},
        {"id": "terai", "name": "Terai Lowlands", "country": "Nepal"},
        {"id": "siwalik", "name": "Siwalik Hills", "country": "Nepal"},
        {"id": "midhills", "name": "Mid-Hills", "country": "Nepal"},
        {"id": "kathmandu", "name": "Kathmandu Valley", "country": "Nepal"},
        {"id": "highmountains", "name": "High Mountains & Himalayas", "country": "Nepal"},
    ]
    return {
        "status": "not_computed",
        "statistics_status": "not_computed",
        "statistics_available": False,
        "regions": regions,
    }
