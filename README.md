# EonPulse - Nepal rainfall-to-vegetation response research

EonPulse is a research prototype for studying the timing of vegetation response to rainfall across Nepal. The interface is designed to separate **source metadata**, **downloaded inputs**, **computed measurements**, and **scientific interpretation**.

> **Current scientific status:** the repository does not yet contain a validated MODIS NDVI + GPM IMERG processing pipeline. The API therefore returns `not_computed` and empty result arrays instead of manufacturing plausible-looking values. The interactive map is a topographic basemap with study-region markers, not a vegetation-lag raster.

## Live project

- Frontend: https://south-asia-vegetation-lag.vercel.app/
- Source repository: https://github.com/SuprimOjha/nepal-vegetation-lag

## Data sources and intended roles

| Product | Intended variable | Source / product documentation | Current status in this app |
|---|---|---|---|
| MOD13A3.061 | Monthly MODIS NDVI | [NASA LP DAAC product DOI](https://doi.org/10.5067/MODIS/MOD13A3.061) · [NASA Earthdata search](https://search.earthdata.nasa.gov/search?q=MOD13A3) | Catalog reference only; not downloaded by this pipeline |
| GPM_3IMERGM | Monthly GPM IMERG precipitation | [NASA GES DISC product page](https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGM_07/summary) · [NASA Earthdata search](https://search.earthdata.nasa.gov/search?q=GPM_3IMERGM) | Catalog reference only; not downloaded by this pipeline |
| SRTMGL1.003 | Terrain elevation context | [NASA LP DAAC product DOI](https://doi.org/10.5067/MEaSUREs/SRTM/SRTMGL1.003) | Reference only; not used in calculations |

A product catalogue entry is not evidence of download, quality screening, or analysis. Product version, temporal coverage, spatial coverage, granule identifiers, quality flags, and exact units must be captured for every actual run.

## API endpoints

- `GET /health` - service health only; it does not claim that science calculations ran.
- `GET /api/datasets` - documented source products and their explicitly declared status.
- `GET /api/catalog/granules?product=MOD13A3&start_year=2023&end_year=2023&limit=20` — live NASA CMR metadata query (limited sample; not a download or analysis).
- `GET /api/regions` - study-region names without fabricated statistics.
- `GET /api/analysis/nepal?zone=all&max_lag=6&start_year=2003&end_year=2024` — current analysis contract; returns `not_computed` until validated source arrays are available.
- `GET /api/methodology` - analysis stages, status, and definitions.
- `GET /api/provenance` - boundary and provenance readiness information.

The live Vercel deployment must set `NEXT_PUBLIC_API_URL` to the public backend origin, without a trailing slash. Redeploy the frontend after changing environment variables.

## Definitions and scientific conventions

- **Precipitation (mm/month):** monthly accumulation after product-specific units and scale handling are documented.
- **NDVI:** a unitless vegetation index derived from near-infrared and red reflectance. Apply the product's scale factor, fill-value handling, and quality flags. NDVI is not biomass and does not directly measure plant health.
- **Anomaly:** a value relative to a documented reference climatology. Specify reference years, month-of-year baseline, and any detrending method.
- **Lag convention:** lag (k) compares precipitation anomaly at month (t) with NDVI anomaly at month (t+k). Keep the convention consistent in code, charts, labels, and exported data.
- **Pearson correlation (r):** linear association between paired observations, from -1 to +1. Publish sample count, uncertainty, missing-data policy, and assumptions about temporal autocorrelation.
- **Significance:** publish the exact test, effective sample-size assumptions, p-values, and multiple-comparison correction. A p-value does not establish causation.
- **Spatial boundary:** the current bounding box is (west 80.05°, south 26.34°, east 88.20°, north 30.45°). A box includes places outside Nepal; country-only results require a versioned Nepal polygon and documented pixel inclusion rules.
- **Topographic basemap:** map tiles are for geographic context. The current markers are study-area locations and must not be interpreted as pixel-level lag estimates.

## Required steps before publishing real results

1. Acquire source granules for the requested time range and store product versions, exact granule IDs, retrieval timestamps, and checksums.
2. Apply source-specific QA flags, fill-value masks, and scale factors; do not replace missing observations with zero.
3. Reproject and align grids with a documented spatial resolution and resampling strategy.
4. Apply a versioned Nepal boundary polygon; document whether pixels are selected by center, fractional area, or another rule.
5. Build a common monthly timeline and explicitly record missing months.
6. Calculate month-of-year climatology anomalies; document the baseline and any trend removal.
7. Compute lagged correlations for the requested lags, with paired valid sample counts.
8. Estimate uncertainty and p-values with assumptions suitable for serially dependent monthly data.
9. Correct for multiple comparisons for pixel-wise or multi-lag inference (for example, a documented false-discovery-rate procedure).
10. Export the output raster/table, code revision, parameters, inputs/checksums, UTC run timestamp, software versions, and a machine-readable manifest.
11. Add tests for known synthetic arrays and edge cases; keep synthetic fixtures confined to tests, never presented as observations.
12. Only then allow the API to return `analysis_status: "computed"`.

## Reproducibility manifest minimum

Each real run should publish: run ID; UTC timestamp; code commit; environment/package versions; source product IDs and versions; exact granule IDs; temporal coverage; spatial boundary and CRS; scaling/QA rules; resampling choices; climatology period; lag convention; valid sample count per pixel/zone; correlation and uncertainty method; significance correction; output checksums; and warnings.

## Local development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend (from repository root):

```bash
python -m venv .venv
# Activate the environment using your operating system's instructions.
pip install -r backend/requirements.txt
cd backend
uvicorn app.main:app --reload
```

For a real production analysis, add a tested data-acquisition and processing module before marking the pipeline complete. Do not change `not_computed` to `computed` unless the output was produced by that validated module and has a manifest.
