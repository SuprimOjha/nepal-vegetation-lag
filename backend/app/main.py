from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="EonPulse Nepal API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/datasets")
def get_datasets():
    return {
        "datasets": [
            {"short_name": "MOD13A3", "name": "MODIS Vegetation Indices", "format": "HDF4"},
            {"short_name": "GPM_3IMERGM", "name": "GPM IMERG Precipitation", "format": "NetCDF4"},
        ]
    }

@app.get("/api/regions")
def get_regions():
    return {
        "regions": [
            {"id": "nepal_east", "name": "Eastern Nepal", "country": "Nepal", "default_lag_months": 2, "r": 0.68},
            {"id": "terai", "name": "Terai Lowlands", "country": "Nepal", "default_lag_months": 1, "r": 0.74},
        ]
    }