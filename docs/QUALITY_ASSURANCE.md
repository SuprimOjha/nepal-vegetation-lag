# Satellite data quality checks

This checklist is a proposed gate for real-data processing, not a claim that all checks have already been executed.

## Input checks

- Confirm product identifier, version, units, calendar, coordinate reference system, and spatial resolution from provider documentation.
- Verify file size is non-zero and checksum matches any published checksum.
- Check expected variables and dimensions exist.
- Detect duplicate timestamps and missing months.
- Check coordinate values and geographic bounds before clipping to Nepal.
- Inspect fill values, scale factors, and quality flags before converting to physical units.

## Alignment checks

- Use a documented target grid and record the resampling method.
- Confirm rainfall and NDVI refer to compatible monthly periods.
- Track valid pixel-month counts after masking.
- Do not interpolate missing observations silently.
- Keep a mask or count layer showing where each output is supported by observations.

## Analysis checks

- Test synthetic series with known positive, negative, and zero-lag relationships.
- Test constant, short, missing, and non-finite series.
- Record sample count for every estimated lag.
- Report effect size alongside uncertainty and adjusted p-values.
- Inspect spatial patterns for edge effects, suspicious stripes, and unexpected coverage gaps.

A run should fail closed when required metadata or input variables are absent.