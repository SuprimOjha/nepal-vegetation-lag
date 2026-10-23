# Operational monitoring principles

Monitoring should distinguish application availability from research readiness.

## Separate signals

- **Service health:** the API process can respond.
- **Catalog reachability:** a metadata query can contact the source service.
- **Acquisition readiness:** required source files are available locally and identifiable.
- **Validation readiness:** source files pass expected structure and quality checks.
- **Analysis readiness:** required arrays and parameters are available.
- **Published result:** a computed artifact and its provenance manifest exist.

These states are not interchangeable. A healthy service or successful catalog query does not prove a scientific result exists.

## Useful operational metadata

Record request time, stage, duration, outcome, and a concise error category. Avoid logging secrets, authorization headers, or sensitive local paths.

## Stale outputs

If a new run fails, do not silently present an older result as if it were current. If historical results are supported later, expose the run timestamp, identifier, and status clearly.