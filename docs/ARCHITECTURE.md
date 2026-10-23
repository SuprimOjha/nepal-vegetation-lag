# System architecture

EonPulse separates the user interface, API contract, data acquisition, scientific processing, and published outputs.

## Components

- **Frontend:** presents dataset metadata, study-region context, API status, and analysis outputs.
- **Backend API:** exposes health, dataset/catalog metadata, region information, methodology, provenance, and analysis status.
- **Acquisition layer (planned):** retrieves provider data and records granule identifiers, timestamps, and checksums.
- **Validation layer (planned):** verifies file structure, units, coordinate metadata, temporal coverage, and quality flags.
- **Processing layer (planned):** masks unreliable observations, aligns grids and monthly periods, and calculates anomalies.
- **Statistics layer:** provides array-level lag estimates and multiple-testing helpers; these functions do not download data.
- **Publication layer (planned):** emits computed outputs only with provenance and reproducibility metadata.

## Trust boundaries

A live API response, a catalog record, a downloaded file, a validated input, and a computed result are distinct states. Do not infer one from another. A healthy API can serve metadata while the scientific pipeline remains uncomputed.

## Failure behavior

Missing inputs, failed downloads, invalid metadata, and insufficient observations should produce explicit states or errors. Never fill missing scientific outputs with plausible-looking sample values. Keep the frontend's status labels consistent with backend state.