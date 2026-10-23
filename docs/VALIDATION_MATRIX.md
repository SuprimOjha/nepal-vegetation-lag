# Validation matrix

Use this matrix when reviewing changes to the analysis workflow.

| Area | Evidence to request | Failure condition |
|---|---|---|
| Input identity | Product version and granule metadata | Unknown source represented as verified |
| File integrity | Non-empty file and checksum | Corrupt input accepted |
| Units and scaling | Product-specific conversion test | Unexplained values or scale |
| Time coverage | Monthly timeline and gap report | Missing months silently filled |
| Spatial alignment | CRS, grid, and resampling metadata | Misaligned grids treated as equivalent |
| Quality masks | Documented flag interpretation | Invalid pixels included without explanation |
| Lag direction | Synthetic known-lag test | Positive and negative lag semantics reversed |
| Missing values | Pairwise valid-count test | NaNs converted to zero |
| Statistics | Edge-case tests and method notes | Constant/short series yields misleading estimates |
| Multiplicity | Declared correction family | Pixel-level inference uses only per-series correction |
| Reproducibility | Commit, environment, manifest | Published map cannot be traced to inputs |
| UI integrity | API state checked against result provenance | Placeholder map or metadata shown as measured result |

Documentation is useful evidence of intent, but each row must be backed by code, tests, or recorded execution evidence before claiming the gate passes.