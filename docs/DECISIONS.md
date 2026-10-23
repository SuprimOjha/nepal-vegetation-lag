# Architecture decision notes

These notes capture current conventions and important trade-offs. They are not proof that planned pipeline stages are already implemented.

## Decision: explicit computation status

**Choice:** represent uncomputed analyses explicitly instead of returning demo values.

**Reason:** plausible but invented scientific results can mislead users and invalidate a research project.

**Consequence:** the interface may show no result until validated inputs and a reproducible computation are available.

## Decision: preserve provenance

**Choice:** record source product versions, granule IDs, processing parameters, code revision, and output checksums for real runs.

**Reason:** spatial and temporal processing choices can materially change estimates.

**Consequence:** result publication requires a manifest and source metadata.

## Decision: keep synthetic tests separate

**Choice:** use synthetic arrays for deterministic unit tests, but label them as synthetic and keep them out of scientific result outputs.

**Reason:** synthetic data test algorithm behavior, not Nepal's actual rainfall–vegetation relationship.

## Decision: describe associations conservatively

**Choice:** describe lagged correlations as associations rather than causal proof.

**Reason:** confounding variables, measurement error, and temporal dependence can affect correlation estimates.