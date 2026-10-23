# Research workflow and validation gates

This checklist describes the minimum evidence required before EonPulse can publish rainfall-to-vegetation response estimates for Nepal.

## Stage 1 — Identify source data

- Record product short name, collection/version, provider, access date, and temporal coverage.
- Save exact granule identifiers and stable source references.
- Preserve original metadata and a checksum for each downloaded file.
- Keep catalog discovery separate from download status.

## Stage 2 — Validate source files

- Confirm expected variables, dimensions, coordinates, units, and time coverage.
- Apply product-specific scale factors, fill-value handling, and quality flags.
- Check for duplicate timestamps and missing months.
- Fail clearly if required metadata or variables are absent.

## Stage 3 — Align observations

- Define a versioned Nepal boundary and document the pixel inclusion rule.
- Choose and document a target grid and resampling method.
- Align precipitation and NDVI to a common monthly timeline.
- Preserve valid-observation counts and masks; never replace missing values with zero.

## Stage 4 — Analyze and validate

- Document the anomaly baseline and lag sign convention.
- Report correlation, sample count, uncertainty, and p-values for each estimated lag.
- Account for temporal autocorrelation and multiple comparisons.
- Test edge cases and known relationships using synthetic fixtures.
- Evaluate sensitivity to baseline, quality masks, and lag range.

## Stage 5 — Publish responsibly

- Store the source manifest, parameters, software versions, code revision, and output checksums.
- Mark a result `computed` only when the documented pipeline actually ran on identified input data.
- Label synthetic examples clearly and never present them as satellite observations.
- Describe correlation as association, not proof of causation.

## Current limitation

A passing unit-test suite proves only the tested software behavior. It does not prove that source data were downloaded or that a spatial analysis has run. Until the full acquisition, validation, processing, and provenance chain exists, the API and interface must continue to report uncomputed scientific results explicitly.
