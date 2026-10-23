# Statistical validation protocol

This protocol applies before EonPulse publishes rainfall-to-vegetation lag estimates as research findings. Passing unit tests does not establish that satellite observations have been downloaded or that a scientific run has completed.

## 1. Input checks

- Record product short name, collection/version, granule identifiers, dates, units, scale factors, QA rules, and file checksums for every input.
- Confirm rainfall and NDVI observations share a monthly time axis and study region.
- Preserve fill values and missing observations as missing; never replace them with zero by default.
- Apply a documented Nepal boundary mask. A bounding box alone is not a country mask.
- Record native product resolution separately from output grid resolution.

## 2. Monthly anomalies

- Verify duplicate months, gaps, and time ordering before calculating anomalies.
- Document the climatology period and seasonal adjustment method.
- Keep a per-pixel observation count and valid-data mask with every output.

## 3. Lag convention

For lag `k`, compare rainfall anomaly at month `t` with NDVI anomaly at month `t + k`. A positive lag means vegetation follows rainfall. Tests should include a synthetic delayed response to verify this convention.

## 4. Statistical checks

- Report Pearson correlation only when paired sample count and variance meet documented minimums.
- Record valid-pair counts separately for every tested lag.
- Monthly observations may be autocorrelated. Treat effective-sample-size-based p-values as approximate and compare conclusions against block-bootstrap or other suitable time-series methods.
- Correct for multiple comparisons across the full family of tests. If testing many pixels and lags, correcting only lags within one pixel is insufficient for map-wide claims.
- Report uncertainty and sensitivity to period, QA thresholds, and missing-data policy.
- A maximum-correlation lag is not proof of causation.

## 5. Publication gate

Do not label an output `computed` unless a successful run has a stable run ID, code revision, parameters, input checksums, output checksum, and validation summary. If prerequisites are missing, return explicit `not_computed`, `insufficient_data`, or failure status rather than placeholder scientific values.

## 6. Test-data policy

Synthetic arrays may be used for unit tests only. Label them synthetic and never present them as NASA observations or Nepal findings. Unit tests validate software behavior; they do not validate scientific representativeness of real-world results.
