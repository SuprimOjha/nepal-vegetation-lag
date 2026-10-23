# Minimum scientific output metadata

This document defines what should accompany a published analysis. It does not assert that a complete output schema is already implemented.

## Run-level metadata

- Unique run identifier and UTC creation time.
- Code commit SHA and dependency/environment versions.
- Input product IDs, collection/version, granule identifiers, checksums, and retrieval times.
- Geographic boundary version, coordinate reference system, target grid, and resampling method.
- Temporal coverage, anomaly baseline, quality-mask rules, and missing-data policy.
- Lag convention, tested lag range, correlation method, uncertainty method, and significance correction.
- Processing status, warnings, and output checksums.

## Per-zone or per-pixel values

Where applicable, include location/grid identifier, lag in months, Pearson correlation, paired sample count, effective sample-size estimate, raw p-value, adjusted q-value, and a status explaining undefined or insufficient estimates.

## Null and status semantics

- Use null for unavailable or undefined numeric estimates.
- Use explicit status fields to explain why a value is unavailable.
- Do not use zero as a substitute for missing data.
- Do not mark an output computed solely because an HTTP request succeeded.

## Interpretation

Include the exact lag sign convention and a warning that correlation is not causation. Maps should expose data coverage and avoid implying support where valid observations are absent.