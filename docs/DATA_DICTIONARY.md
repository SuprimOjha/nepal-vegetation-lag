# EonPulse data dictionary and verification guide

This document defines what each displayed field means and what evidence is needed to verify it.

## Status vocabulary

- **catalog reference**: product metadata and documentation are known.
- **not downloaded**: no source file is available to the analysis service.
- **downloaded**: exact source files exist and are recorded in a run manifest.
- **quality screened**: product-specific QA flags, fill values, and scale factors were applied.
- **computed**: output arrays were produced from validated inputs by the documented pipeline and linked to a run manifest.
- **not computed**: no result is available. The UI must not substitute demonstration values.
- **API connected**: the service responds to a health check only. It does not imply that source data are available.

## Fields

| Field | Meaning | Unit / valid values | Verification evidence |
|---|---|---|---|
| `status` | API response state | `not_computed` or `success` | API response and run manifest |
| `analysis_status` | Whether science processing ran | `not_computed` or `computed` | Successful run ID, source checksums, output checksums |
| `zone` | Selected analysis region ID | `all`, `terai`, `siwalik`, `midhills`, `kathmandu`, `highmountains` | Versioned region geometry |
| `year_start`, `year_end` | Requested period | Calendar years | Source granule coverage; request parameters alone are not coverage |
| `max_lag_months` | Largest lag requested | Months, integer 0–24 | Run parameters |
| `bounding_box` | Study extent | WGS84 [west, south, east, north] | Boundary metadata; not an administrative mask |
| `time_series.precipitation_mm` | Monthly rainfall values | mm/month, nullable | GPM product/version, units, granule IDs, QA and scaling |
| `time_series.ndvi` | Monthly vegetation index | Unitless scaled NDVI, nullable | MODIS product/version, scale factor, QA and fill-value policy |
| `lag` | Tested temporal offset | Months | Lag convention and run parameters |
| `correlation` | Pearson coefficient for paired anomalies | −1 to +1 | Input arrays, paired sample count, implementation/version |
| `n` | Number of valid paired observations | Count | Missing-data policy and paired-valid mask |
| `p_value` | Test result for a stated null hypothesis | 0–1 or null | Test definition, effective sample-size assumptions, correction method |
| `ci_lower`, `ci_upper` | Confidence interval for an estimate | Correlation scale or explicitly documented transformation | Confidence level and interval method |
| `generated_at_utc` | Response generation timestamp | ISO 8601 UTC | API response |
| `input_file_checksums` | Cryptographic hashes of exact inputs | SHA-256 recommended | Input files and manifest |
| `output_checksum` | Hash of published output | SHA-256 recommended | Downloaded output artifact |
| `code_revision` | Exact source version | Git commit SHA | Repository history |
| `run_id` | Unique processing execution | Stable unique ID | Stored run metadata |

## Scientific cautions

1. Correlation is not causation.
2. A highest-correlation lag is subject to selection bias, especially when many lags and pixels are tested.
3. Monthly time series may be serially autocorrelated, so naive independent-sample p-values can overstate significance.
4. Cloud, snow, terrain shadow, mixed land cover, irrigation, and product differences can influence the result.
5. Resampling does not create new spatial information. State the native resolution and output grid separately.
6. A bounding box is not a Nepal border mask.
7. A terrain tile is a basemap, not a scientific raster.
8. Missing values must remain identifiable through every processing stage.
9. Do not describe source data as active, loaded, or analyzed without evidence of the corresponding operation.
10. All plotted values should be downloadable along with metadata sufficient to reproduce them.
