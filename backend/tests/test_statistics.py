"""Synthetic software tests only; fixtures are not satellite observations."""
import unittest
import numpy as np
from services.statistics import analyze_lag_series, benjamini_hochberg


class StatisticsTests(unittest.TestCase):
    def test_bh_adjustment_preserves_none(self):
        got = benjamini_hochberg([0.01, 0.04, None, 0.03])
        self.assertAlmostEqual(got[0], 0.03)
        self.assertAlmostEqual(got[1], 0.04)
        self.assertIsNone(got[2])
        self.assertAlmostEqual(got[3], 0.04)

    def test_positive_lag_convention_and_sample_count(self):
        rain = np.arange(1, 19, dtype=float)
        ndvi = np.r_[np.zeros(4), np.arange(1, 15, dtype=float)]
        result = analyze_lag_series(rain, ndvi, max_lag=2, min_samples=8)
        self.assertEqual(result["results"][1]["sample_count"], 17)
        self.assertEqual(result["results"][1]["lag_months"], 1)
        self.assertIn("rainfall_anomaly[t]", result["lag_convention"])

    def test_constant_series_is_not_a_zero_correlation(self):
        result = analyze_lag_series(np.ones(18), np.arange(18), max_lag=2, min_samples=8)
        self.assertTrue(all(row["pearson_r"] is None for row in result["results"]))
        self.assertTrue(all(row["status"] == "undefined_constant_series" for row in result["results"]))

    def test_missing_pairs_are_excluded_not_zero_filled(self):
        rain = np.arange(18, dtype=float)
        ndvi = np.arange(18, dtype=float)
        ndvi[3] = np.nan
        result = analyze_lag_series(rain, ndvi, max_lag=0, min_samples=8)
        self.assertEqual(result["results"][0]["sample_count"], 17)

    def test_invalid_lengths_and_lags_rejected(self):
        with self.assertRaises(ValueError):
            analyze_lag_series([1, 2], [1], max_lag=0)
        with self.assertRaises(ValueError):
            analyze_lag_series(np.arange(10), np.arange(10), max_lag=10)

    def test_insufficient_samples_explicit(self):
        result = analyze_lag_series(np.arange(8), np.arange(8), max_lag=2, min_samples=12)
        self.assertEqual(result["status"], "insufficient_data")
        self.assertTrue(all(row["status"] == "insufficient_samples" for row in result["results"]))


if __name__ == "__main__":
    unittest.main()
