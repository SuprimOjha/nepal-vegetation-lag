# Lag statistics engine

This branch adds tested array-level statistical primitives. It is not connected to the live API and does not claim that satellite data has been downloaded or analyzed.

## Contract

- Inputs are monthly rainfall and NDVI anomaly series aligned to the same calendar.
- Positive lag k pairs rainfall at month t with NDVI at month t+k.
- Missing pairs are omitted, never replaced with zero.
- Each lag reports sample count, Pearson correlation, approximate p-value, effective sample size, Benjamini-Hochberg adjusted q-value, and status.
- Constant series and insufficient samples remain undefined.
- The current correction covers lags for one supplied series. Spatial analysis must define and correct the complete family of pixel-by-lag tests.

## Limitation

The p-value uses a lag-1 effective-sample-size approximation. Treat it as exploratory screening, not guaranteed calibrated inference for every seasonal or autocorrelated time series. Before making scientific claims, compare with block-bootstrap inference, test sensitivity to the anomaly baseline and missingness, and validate on synthetic series with known properties. Correlation does not establish causation.

## Run tests

From the backend directory, after installing backend/requirements.txt:

    python -m unittest discover -s tests -v

Fixtures are synthetic software tests, not Nepal measurements or evidence of a real environmental contradiction.
