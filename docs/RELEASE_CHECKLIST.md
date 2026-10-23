# Research release checklist

Use this checklist before describing a release as a real-data analysis.

## Code and tests

- [ ] CI passes on the exact release commit.
- [ ] Input validation and failure cases have tests.
- [ ] Dependency versions are recorded.
- [ ] No secrets, access tokens, or personal data are committed.

## Data and method

- [ ] Source products and versions are identified.
- [ ] Acquisition dates and granule IDs are recorded.
- [ ] Files are checked for integrity and expected dimensions.
- [ ] QA masks, units, grid, and resampling are documented.
- [ ] Missing-month policy and anomaly baseline are documented.
- [ ] Lag sign convention and tested range are documented.
- [ ] Autocorrelation and multiple testing are addressed.
- [ ] Coverage and uncertainty are available with results.

## Public presentation

- [ ] Catalog-only, downloaded, processed, and computed states are distinct.
- [ ] Synthetic examples are labeled.
- [ ] Maps show units, period, method, and data coverage.
- [ ] Limitations are visible near scientific claims.
- [ ] A clean checkout can reproduce the published output.

Do not check an item merely because its documentation exists; verify the corresponding work was actually performed.