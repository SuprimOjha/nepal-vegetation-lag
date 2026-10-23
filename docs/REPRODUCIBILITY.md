# Reproducibility guide

This project investigates monthly rainfall–vegetation response lags in Nepal. A result is reproducible only when its inputs, processing choices, and software version can be identified.

## Minimum record for every analysis

- Dataset short name, product identifier, provider, version, and access date.
- Exact start/end dates and geographic bounds.
- Downloaded granule identifiers or stable source URLs, where available.
- Quality-mask rules and the number of observations excluded.
- Spatial grid, resampling method, and temporal aggregation.
- Anomaly method and any detrending or seasonal adjustment.
- Lag convention, tested lag range, correlation method, sample count, and missing-data policy.
- Multiple-testing correction scope and method.
- Code commit SHA, environment/dependency versions, and output checksum.

## Re-running an analysis

1. Start from a clean checkout and install the backend dependencies documented in `backend/requirements.txt`.
2. Use only archived input files whose provenance is recorded.
3. Run automated tests before processing observations.
4. Save parameters and input metadata beside every output.
5. Compare outputs only when grid, temporal coverage, masks, and parameters match.

Synthetic fixtures are useful for testing algorithms, but must never be presented as satellite-derived findings. At present, documentation or API metadata alone does not prove that the full NASA data pipeline has run.