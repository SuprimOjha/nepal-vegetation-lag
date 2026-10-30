"""Auditable array-level rainfall-to-NDVI lag statistics; no data acquisition occurs here."""
import math
from typing import Iterable

import numpy as np
from scipy.stats import t as student_t


def _lag1(values, valid_mask):
    """Estimate lag-1 autocorrelation from adjacent valid months.

    Returns (correlation, pair_count). Correlation is None when the original
    timeline does not contain enough usable adjacent pairs to estimate it.
    Missing months are never compressed into artificial adjacency.
    """
    values = np.asarray(values, dtype=float)
    valid_mask = np.asarray(valid_mask, dtype=bool)
    if values.ndim != 1 or valid_mask.shape != values.shape:
        raise ValueError("values and valid_mask must be matching one-dimensional arrays")
    adjacent = valid_mask[:-1] & valid_mask[1:]
    previous = values[:-1][adjacent]
    following = values[1:][adjacent]
    pair_count = int(previous.size)
    if pair_count < 3 or np.std(previous) == 0 or np.std(following) == 0:
        return None, pair_count
    value = float(np.corrcoef(previous, following)[0, 1])
    return (value if math.isfinite(value) else None), pair_count


def benjamini_hochberg(p_values: Iterable[float | None]) -> list[float | None]:
    """Adjust p-values in [0, 1], preserving explicit None values.

    Invalid numeric values are rejected instead of being silently treated as
    missing, because silently dropping a p-value changes the tested family.
    """
    values = list(p_values)
    valid = []
    for index, value in enumerate(values):
        if value is None:
            continue
        if isinstance(value, (bool, np.bool_)):
            raise ValueError("p-values must be numeric values, not booleans")
        try:
            p_value = float(value)
        except (TypeError, ValueError) as exc:
            raise ValueError("p-values must be numeric values or None") from exc
        if not math.isfinite(p_value) or not 0 <= p_value <= 1:
            raise ValueError("p-values must be finite and between zero and one")
        valid.append((index, p_value))
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
    if isinstance(max_lag, (bool, np.bool_)) or not isinstance(max_lag, (int, np.integer)):
        raise ValueError("max_lag must be an integer")
    if max_lag < 0 or max_lag >= rain.size:
        raise ValueError("max_lag must be between zero and series_length - 1")
    if isinstance(alpha, (bool, np.bool_)) or not isinstance(alpha, (int, float, np.integer, np.floating)):
        raise ValueError("alpha must be a finite number between zero and one")
    if not math.isfinite(float(alpha)) or not 0 < alpha < 1:
        raise ValueError("alpha must be a finite number between zero and one")
    if isinstance(min_samples, (bool, np.bool_)) or not isinstance(min_samples, (int, np.integer)):
        raise ValueError("min_samples must be an integer")
    if min_samples < 4:
        raise ValueError("min_samples must be at least four")

    rows = []
    for lag in range(max_lag + 1):
        x_timeline = rain[:rain.size - lag] if lag else rain
        y_timeline = ndvi[lag:] if lag else ndvi
        mask = np.isfinite(x_timeline) & np.isfinite(y_timeline)
        x, y = x_timeline[mask], y_timeline[mask]
        n = int(x.size)
        row = {"lag_months": lag, "sample_count": n, "autocorrelation_pair_count": 0,
               "effective_sample_size": None, "pearson_r": None, "p_value": None,
               "q_value": None, "significant": False, "status": "insufficient_samples"}
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
        # Estimate persistence only from adjacent valid months in the
        # original aligned timeline. Do not silently assume independence when
        # gaps leave too few adjacent pairs to estimate autocorrelation.
        rain_rho, rain_pair_count = _lag1(x_timeline, mask)
        ndvi_rho, ndvi_pair_count = _lag1(y_timeline, mask)
        pair_count = min(rain_pair_count, ndvi_pair_count)
        row.update({"pearson_r": r, "autocorrelation_pair_count": pair_count})
        if rain_rho is None or ndvi_rho is None:
            row["status"] = (
                "insufficient_autocorrelation_pairs"
                if pair_count < 3 else "undefined_autocorrelation"
            )
            rows.append(row)
            continue
        product = float(np.clip(rain_rho * ndvi_rho, -0.95, 0.95))
        neff = float(np.clip(n * (1 - product) / (1 + product), 3, n))
        df = max(neff - 2, 1)
        statistic = abs(r) * math.sqrt(df / max(1 - r * r, 1e-15))
        p = float(np.clip(2 * student_t.sf(statistic, df), 0, 1))
        row.update({"effective_sample_size": round(neff, 4),
                    "p_value": p, "status": "estimated"})
        rows.append(row)

    q_values = benjamini_hochberg(
        row["p_value"] if row["status"] == "estimated" else None for row in rows
    )
    for row, q in zip(rows, q_values):
        row["q_value"] = q
        row["significant"] = q is not None and q < alpha and row["status"] == "estimated"
    estimated = [row for row in rows if row["status"] == "estimated"]
    correlations = [row for row in rows if row["pearson_r"] is not None]
    strongest = max(correlations, key=lambda row: abs(row["pearson_r"])) if correlations else None
    return {
        # Keep descriptive correlation availability separate from inferential
        # availability: a Pearson r alone does not mean p/q-values were estimated.
        "status": (
            "estimated" if estimated else
            "correlation_only" if correlations else
            "insufficient_data"
        ),
        "correlation_status": "estimated" if correlations else "insufficient_data",
        "inference_status": "estimated" if estimated else "insufficient_data",
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



def moving_block_bootstrap_ci(
    rainfall_anomaly: Iterable[float],
    ndvi_anomaly: Iterable[float],
    block_length: int = 3,
    n_resamples: int = 1000,
    confidence_level: float = 0.95,
    random_state: int | None = 0,
) -> dict:
    """Estimate a percentile CI for paired correlation using moving time blocks.

    Blocks are sampled from the original timeline (not from a compressed list of
    valid pairs), so missing months do not make non-adjacent observations appear
    adjacent. This is an exploratory uncertainty estimate, not a causal test.
    """
    rain = np.asarray(list(rainfall_anomaly), dtype=float)
    ndvi = np.asarray(list(ndvi_anomaly), dtype=float)
    if rain.ndim != 1 or ndvi.ndim != 1:
        raise ValueError("Inputs must be one-dimensional")
    if rain.size != ndvi.size:
        raise ValueError("Rainfall and NDVI series must have equal lengths")
    if isinstance(block_length, (bool, np.bool_)) or not isinstance(block_length, (int, np.integer)):
        raise ValueError("block_length must be an integer")
    if block_length < 1 or block_length > rain.size:
        raise ValueError("block_length must be between one and series_length")
    if isinstance(n_resamples, (bool, np.bool_)) or not isinstance(n_resamples, (int, np.integer)):
        raise ValueError("n_resamples must be an integer")
    if n_resamples < 1:
        raise ValueError("n_resamples must be a positive integer")
    if isinstance(confidence_level, (bool, np.bool_)) or not isinstance(confidence_level, (int, float, np.integer, np.floating)):
        raise ValueError("confidence_level must be a finite number between zero and one")
    if not math.isfinite(float(confidence_level)) or not 0 < confidence_level < 1:
        raise ValueError("confidence_level must be a finite number between zero and one")

    valid = np.isfinite(rain) & np.isfinite(ndvi)
    if int(valid.sum()) < 4:
        return {
            "status": "insufficient_data",
            "pearson_r_ci": None,
            "successful_resamples": 0,
            "requested_resamples": n_resamples,
            "block_length": block_length,
            "confidence_level": confidence_level,
            "method": "moving_block_percentile_bootstrap",
        }

    rng = np.random.default_rng(random_state)
    n = rain.size
    blocks_per_sample = math.ceil(n / block_length)
    max_start = n - block_length
    estimates = []

    for _ in range(n_resamples):
        starts = rng.integers(0, max_start + 1, size=blocks_per_sample)
        indices = np.concatenate([
            np.arange(start, start + block_length) for start in starts
        ])[:n]
        x, y = rain[indices], ndvi[indices]
        paired = np.isfinite(x) & np.isfinite(y)
        x, y = x[paired], y[paired]
        if x.size < 4 or np.std(x) == 0 or np.std(y) == 0:
            continue
        estimate = float(np.corrcoef(x, y)[0, 1])
        if math.isfinite(estimate):
            estimates.append(estimate)

    minimum_successes = max(100, math.ceil(0.8 * n_resamples))
    if len(estimates) < minimum_successes:
        return {
            "status": "insufficient_valid_resamples",
            "pearson_r_ci": None,
            "successful_resamples": len(estimates),
            "requested_resamples": n_resamples,
            "block_length": block_length,
            "confidence_level": confidence_level,
            "method": "moving_block_percentile_bootstrap",
            "warning": "Too few valid resamples produced finite, non-constant paired series.",
        }

    tail = (1 - confidence_level) / 2
    lower, upper = np.quantile(estimates, [tail, 1 - tail])
    return {
        "status": "estimated",
        "pearson_r_ci": [float(lower), float(upper)],
        "successful_resamples": len(estimates),
        "requested_resamples": n_resamples,
        "block_length": block_length,
        "confidence_level": confidence_level,
        "method": "moving_block_percentile_bootstrap",
        "warning": (
            "Exploratory interval only. Results depend on block length, stationarity, "
            "and the available time series; inspect sensitivity across block lengths."
        ),
    }


def benjamini_hochberg_array(p_values: np.ndarray) -> np.ndarray:
    """Apply BH correction across an entire array-wide testing family.

    Intended for raster stacks such as (lag, row, column): every finite p-value
    participates in one correction family, rather than correcting each pixel or
    lag independently. NaN cells remain NaN in the output. Infinite and
    out-of-range values are rejected.
    """
    values = np.asarray(p_values, dtype=float)
    if values.ndim < 1:
        raise ValueError("p_values must be an array with at least one dimension")
    if np.isinf(values).any():
        raise ValueError("p_values must not contain infinity")
    finite_mask = np.isfinite(values)
    finite_values = values[finite_mask]
    if np.any((finite_values < 0) | (finite_values > 1)):
        raise ValueError("finite p_values must be between zero and one")

    adjusted = np.full(values.shape, np.nan, dtype=float)
    if finite_values.size == 0:
        return adjusted
    corrected = benjamini_hochberg(finite_values.tolist())
    adjusted[finite_mask] = np.asarray(corrected, dtype=float)
    return adjusted
