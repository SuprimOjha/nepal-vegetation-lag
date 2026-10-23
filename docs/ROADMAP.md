# Research roadmap

This roadmap prioritizes trustworthy evidence over displaying a premature result.

## Stage 1 — Integrity and reproducibility

- Keep API statuses explicit.
- Maintain deterministic tests for validation and statistical helpers.
- Record source metadata and processing conventions.
- Make CI dependencies and commands reproducible.

## Stage 2 — Source acquisition

- Implement authenticated or public product access as permitted by provider requirements.
- Retrieve a small, well-defined test period first.
- Persist granule identifiers, checksums, timestamps, and errors.
- Test retry, timeout, and missing-file behavior.

## Stage 3 — Data validation and preprocessing

- Parse product-specific variables and metadata.
- Apply quality flags and scale factors.
- Build a documented monthly timeline and common grid.
- Validate Nepal boundary masking and coverage counts.

## Stage 4 — Statistical analysis

- Generate documented anomalies.
- Evaluate lagged associations and uncertainty.
- Assess sensitivity to assumptions and missing data.
- Apply appropriate multiplicity correction across the full family of spatial and temporal tests.

## Stage 5 — Reproducible publication

- Generate a run manifest and immutable output artifacts.
- Display maps only for outputs with provenance.
- Publish limitations, sample coverage, and uncertainty alongside results.
- Re-run from a clean checkout before presenting scientific conclusions.

Stages describe future work until execution evidence is available.