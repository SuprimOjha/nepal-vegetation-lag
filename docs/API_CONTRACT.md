# API response integrity contract

The API is part of a scientific workflow, so response wording must never imply that a computation occurred when it did not.

## Contract principles

1. A health response indicates service availability only; it does not prove that satellite data are available.
2. Catalog metadata is not equivalent to downloaded granules.
3. Downloaded data are not equivalent to validated inputs.
4. A successful HTTP response does not prove a scientific analysis completed.
5. An uncomputed result must be represented explicitly, not filled with demo statistics.
6. Errors should identify the failed stage without returning invented fallback values.
7. Parameter values and date ranges should be echoed or retrievable for audit.
8. Units, missing-value behavior, and timestamp conventions must be documented.

## Suggested status vocabulary

Use stable machine-readable states such as `not_computed`, `catalog_only`, `downloaded`, `validated`, `computed`, and `failed`. The exact field names should follow the existing API schema; this document does not assert that every state is already implemented.

## Compatibility

When changing response fields, update tests and the frontend together. Avoid silently changing units, lag sign conventions, or null handling.