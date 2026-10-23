# Real satellite-data pipeline checklist

Use this checklist to track evidence for each stage of the Nepal rainfall-to-vegetation analysis. A checked item should have a reproducible artifact or log, not just a UI status.

## Stage A — Acquire

- [ ] Choose and document exact MODIS NDVI and GPM IMERG product versions and temporal resolutions.
- [ ] Authenticate to NASA Earthdata where required, without committing credentials or tokens.
- [ ] Query the catalog for the selected period and Nepal study extent.
- [ ] Download actual data files and retain the original filenames and metadata.
- [ ] Record source URLs or granule IDs, retrieval timestamps, file sizes, and SHA-256 checksums.
- [ ] Verify each file opens and contains the expected variables and time coverage.

## Stage B — Quality control

- [ ] Apply product-specific quality flags, fill-value handling, and scale factors.
- [ ] Confirm rainfall units and convert only with documented transformations.
- [ ] Decode time coordinates and detect duplicate or missing months.
- [ ] Apply a versioned Nepal boundary mask.
- [ ] Record valid observation counts and spatial coverage after quality screening.

## Stage C — Align and process

- [ ] Choose and document a common grid without implying that resampling increases native resolution.
- [ ] Align monthly rainfall and NDVI observations to the same calendar months.
- [ ] Calculate seasonal anomalies using a documented baseline and minimum-data policy.
- [ ] Store intermediate artifacts and checksums so a run can be reproduced.

## Stage D — Analyze

- [ ] Run lag analysis only on validated paired observations.
- [ ] Verify lag direction using synthetic tests.
- [ ] Record sample count, correlation, uncertainty, p-value method, and status per lag and pixel.
- [ ] Evaluate serial dependence and sensitivity to missing data and baseline choices.
- [ ] Correct for multiple comparisons across the actual family of spatial and temporal tests.
- [ ] Mark insufficiently observed pixels explicitly rather than filling them with estimates.

## Stage E — Publish

- [ ] Create a run manifest with run ID, timestamp, code revision, parameters, source metadata, and checksums.
- [ ] Ensure API responses distinguish catalog metadata, downloaded inputs, and computed outputs.
- [ ] Generate map layers and CSV exports only from artifacts of a successful analysis run.
- [ ] Include units, legends, data coverage, limitations, and method references in the UI.
- [ ] Verify the deployed frontend/API corresponds to the intended commit.

## Current status note

Passing CI means the automated checks passed for the code under test. It does not by itself complete any of the acquisition, quality-control, processing, or analysis stages above.
