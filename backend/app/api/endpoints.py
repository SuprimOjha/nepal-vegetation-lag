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
    """Returns initial study regions including Nepal focus areas."""
    return {
        "regions": [
            {"id": "nepal_east", "name": "Eastern Nepal", "country": "Nepal", "default_lag_months": 2, "r": 0.68},
            {"id": "nepal_terai", "name": "Terai Lowlands", "country": "Nepal / India", "default_lag_months": 1, "r": 0.74},
            {"id": "gangetic_plain", "name": "Indo-Gangetic Plain", "country": "India", "default_lag_months": 1, "r": 0.72},
            {"id": "bangladesh_delta", "name": "Bangladesh Delta", "country": "Bangladesh", "default_lag_months": 1, "r": 0.77}
        ]
    }