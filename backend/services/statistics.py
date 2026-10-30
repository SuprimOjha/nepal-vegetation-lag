"""Compatibility exports for the canonical app.services.statistics module.

The backend test suite and legacy service imports use services.statistics
while the application implementation lives in app.services.statistics.
Keep this module as a thin bridge so both import paths expose the same
validated implementations instead of drifting into separate copies.
"""

from app.services.statistics import (
    analyze_lag_series,
    benjamini_hochberg,
    benjamini_hochberg_array,
    moving_block_bootstrap_ci,
)

__all__ = [
    "analyze_lag_series",
    "benjamini_hochberg",
    "benjamini_hochberg_array",
    "moving_block_bootstrap_ci",
]
