# Expected pipeline failure modes

Scientific data pipelines should fail clearly rather than silently producing plausible results.

| Failure | Expected handling |
|---|---|
| Catalog returns no granules | Return an explicit empty result and retain query parameters |
| Download times out | Mark the acquisition attempt failed; do not claim data were downloaded |
| File is empty or checksum mismatches | Reject the file and record the reason |
| Required variable is missing | Stop processing with a useful validation error |
| Unsupported units or scale factor | Stop until the conversion is defined and tested |
| Duplicate or missing months | Report the issue and apply only the documented policy |
| No valid observations after QA masking | Mark the estimate insufficient or unavailable |
| Constant series | Return an undefined correlation status, not a fabricated zero |
| Too few paired samples | Report insufficient samples and the observed count |
| Statistical computation fails | Mark the analysis failed; do not reuse stale values |
| API is healthy but analysis is absent | Keep analysis status as not computed |

## Operational rule

A failed stage must not advance the provenance state of an artifact. For example, a failed download must not be labelled downloaded, and a metadata-only response must not be labelled computed.