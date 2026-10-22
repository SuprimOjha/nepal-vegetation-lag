"""Auditable array-level rainfall-to-NDVI lag statistics; no data acquisition occurs here."""
import math
from typing import Iterable

import numpy as np
from scipy.stats import t as student_t


def _lag1(values):
    if len(values) < 3 or np.std(values[:-1]) == 0 or np.std(values[1:]) == 0:
        return 0.0
    value = float(np.corrcoef(values[:-1], values[1:])[0, 1])
    return value if math.isfinite(value) else 0.0


def benjamini_hochberg(p_values: Iterable[float | None]) -> list[float | None]:
    """Adjust a family of p-values; preserve None entries."""
    values = list(p_values)
    valid = [(i, float(p)) for i, p in enumerate(values)
             if p is not None and math.isfinite(float(p)) and 0 <= float(p) <= 1]
    output = [None] * len(values)
    ordered = sorted(valid, key=lambda item: item[1])
    running = 1.0
    for j in range(len(ordered) - 1, -1, -1):
        index, p = ordered[j]
        running = min(running, p * len(ordered) / (j + 1))
        output[index] = min(1.0, running)
    return output


def analyze_lag_series(
    rainfall_anomaly: Iterable[float],
    ndvi_anomaly: Iterable[float],
    max_lag: int = 6,
    alpha: float = 0.05,
    min_samples: int = 12,
) -> dict:
    """Pair rainfall[t] with NDVI[t + lag]. Approximate p-values are exploratory."""
    rain = np.asarray(list(rainfall_anomaly), dtype=float)
    ndvi = np.asarray(list(ndvi_anomaly), dtype=float)
    if rain.ndim != 1 or ndvi.ndim != 1:
        raise ValueError("Inputs must be one-dimensional")
    if rain.size != ndvi.size:
        raise ValueError("Rainfall and NDVI series must have equal lengths")
    if not isinstance(max_lag, int) or max_lag < 0 or max_lag >= rain.size:
        raise ValueError("max_lag must be between zero and series_length - 1")
    if not 0 < alpha < 1:
        raise ValueError("alpha must be between zero and one")
    if min_samples < 4:
        raise ValueError("min_samples must be at least four")

    rows = []
    for lag in range(max_lag + 1):
        x = rain[:rain.size - lag] if lag else rain
        y = ndvi[lag:] if lag else ndvi
        mask = np.isfinite(x) & np.isfinite(y)
        x, y = x[mask], y[mask]
        n = int(x.size)
        row = {"lag_months": lag, "sample_count": n, "effective_sample_size": None,
               "pearson_r": None, "p_value": None, "q_value": None,
               "significant": False, "status": "insufficient_samples"}
        if n < min_samples:
            rows.append(row)
            continue
        if np.std(x) == 0 or np.std(y) == 0:
            row["status"] = "undefined_constant_series"
            rows.append(row)
            continue
        r = float(np.corrcoef(x, y)[0, 1])
        if not math.isfinite(r):
            row["status"] = "undefined_correlation"
            rows.append(row)
            continue
        product = float(np.clip(_lag1(x) * _lag1(y), -0.95, 0.95))
        neff = float(np.clip(n * (1 - product) / (1 + product), 3, n))
        df = max(neff - 2, 1)
        statistic = abs(r) * math.sqrt(df / max(1 - r * r, 1e-15))
        p = float(np.clip(2 * student_t.sf(statistic, df), 0, 1))
        row.update({"effective_sample_size": round(neff, 4), "pearson_r": r,
                    "p_value": p, "status": "estimated"})
        rows.append(row)

    q_values = benjamini_hochberg(
        row["p_value"] if row["status"] == "estimated" else None for row in rows
    )
    for row, q in zip(rows, q_values):
        row["q_value"] = q
        row["significant"] = q is not None and q < alpha and row["status"] == "estimated"
    estimated = [row for row in rows if row["status"] == "estimated"]
    strongest = max(estimated, key=lambda row: abs(row["pearson_r"])) if estimated else None
    return {
        "status": "estimated" if estimated else "insufficient_data",
        "lag_convention": "rainfall_anomaly[t] versus ndvi_anomaly[t + lag_months]",
        "method": "Pearson correlation with lag-1 effective-sample-size approximation",
        "multiple_testing": "Benjamini-Hochberg across estimated lags in this series only",
        "alpha": alpha,
        "results": rows,
        "strongest_absolute_correlation_lag": strongest["lag_months"] if strongest else None,
        "warning": "Exploratory association only. Effective-sample-size p-values are approximate; "
                   "check robustness with block bootstrap and sensitivity tests. Correlation does "
                   "not establish causation. Spatial analysis must correct across all tested pixels and lags.",
    }
