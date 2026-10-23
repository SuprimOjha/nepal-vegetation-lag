# Data lifecycle states

Use these labels consistently in backend responses, frontend status indicators, and research reports.

1. **Discovered:** a source or catalog record was found.
2. **Downloaded:** source bytes were retrieved and stored.
3. **Validated:** integrity, expected structure, and essential metadata checks passed.
4. **Processed:** documented transformations were applied to validated inputs.
5. **Computed:** the statistical analysis completed against identified processed inputs.
6. **Published:** outputs and their provenance manifest are available to users.
7. **Failed:** a stage failed; preserve the stage and error category.
8. **Not computed:** no scientific estimate has been generated.

Do not skip a stage based on assumptions. A catalog result does not prove download, a file's presence does not prove validation, and a computed number does not by itself prove that a reproducible publication artifact exists.

If the current API uses a smaller set of statuses, map these concepts carefully rather than silently changing the existing response contract.