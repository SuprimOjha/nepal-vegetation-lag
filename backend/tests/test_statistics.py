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


    def test_bh_rejects_invalid_p_values_instead_of_dropping_them(self):
        for invalid in (-0.01, 1.01, float("nan"), float("inf"), True, "not-a-p-value"):
            with self.subTest(invalid=invalid):
                with self.assertRaises(ValueError):
                    benjamini_hochberg([0.02, invalid, 0.04])

    def test_bh_preserves_only_explicit_missing_values(self):
        self.assertEqual(benjamini_hochberg([0.01, None, 0.03]), [0.02, None, 0.03])


    def test_array_bh_corrects_one_family_across_all_pixels_and_lags(self):
        from services.statistics import benjamini_hochberg_array

        p_values = np.array([
            [[0.01, 0.04], [0.03, np.nan]],
            [[0.02, 0.20], [0.50, 0.80]],
        ])
        got = benjamini_hochberg_array(p_values)
        expected = np.array([
            [[0.07, 0.07], [0.07, np.nan]],
            [[0.07, 0.28], [0.5833333333, 0.8]],
        ])
        np.testing.assert_allclose(got, expected, equal_nan=True)

    def test_array_bh_preserves_all_missing_cells(self):
        from services.statistics import benjamini_hochberg_array

        got = benjamini_hochberg_array(np.full((2, 3), np.nan))
        self.assertTrue(np.isnan(got).all())

    def test_array_bh_rejects_infinite_and_out_of_range_values(self):
        from services.statistics import benjamini_hochberg_array

        for invalid in (np.inf, -np.inf, -0.1, 1.1):
            with self.subTest(invalid=invalid):
                with self.assertRaises(ValueError):
                    benjamini_hochberg_array(np.array([[0.01, invalid]]))

    def test_array_bh_rejects_boolean_and_complex_p_values(self):
        from services.statistics import benjamini_hochberg_array

        invalid_inputs = (
            np.array([[True, False]], dtype=bool),
            np.array([[0.01, True]], dtype=object),
            np.array([[0.01 + 0.02j, 0.03]], dtype=complex),
            np.array([[0.01, 0.03 + 0j]], dtype=object),
        )
        for invalid in invalid_inputs:
            with self.subTest(invalid=invalid):
                with self.assertRaises(ValueError):
                    benjamini_hochberg_array(invalid)

    def test_lag_analysis_rejects_boolean_and_non_numeric_parameters(self):
        rain = np.arange(18, dtype=float)
        for kwargs in (
            {"max_lag": True}, {"max_lag": 1.5}, {"alpha": True},
            {"alpha": "0.05"}, {"alpha": float("nan")},
            {"min_samples": True}, {"min_samples": 8.5},
        ):
            with self.subTest(kwargs=kwargs):
                with self.assertRaises(ValueError):
                    analyze_lag_series(rain, rain, **kwargs)

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

    def test_effective_sample_size_does_not_bridge_missing_months(self):
        # Only even-indexed months are observed. Compressing valid values would
        # falsely treat two-month-separated observations as adjacent.
        rain = np.full(20, np.nan)
        ndvi = np.full(20, np.nan)
        rain[::2] = np.arange(10, dtype=float)
        ndvi[::2] = np.arange(10, dtype=float) * 2
        result = analyze_lag_series(rain, ndvi, max_lag=0, min_samples=8)
        row = result["results"][0]
        self.assertEqual(row["sample_count"], 10)
        # There are no adjacent valid months. Keep the descriptive
        # correlation, but do not invent an independence-based p-value.
        self.assertIsNotNone(row["pearson_r"])
        self.assertEqual(row["autocorrelation_pair_count"], 0)
        self.assertIsNone(row["effective_sample_size"])
        self.assertIsNone(row["p_value"])
        self.assertIsNone(row["q_value"])
        self.assertEqual(row["status"], "insufficient_autocorrelation_pairs")
        self.assertFalse(row["significant"])
        self.assertEqual(result["status"], "correlation_only")
        self.assertEqual(result["correlation_status"], "estimated")
        self.assertEqual(result["inference_status"], "insufficient_data")
        self.assertEqual(result["strongest_absolute_correlation_lag"], 0)

    def test_autocorrelation_requires_enough_adjacent_valid_pairs(self):
        rain = np.arange(20, dtype=float)
        ndvi = rain * 2 + np.sin(rain)
        # Four short adjacent runs provide enough pairs for the lag-1 estimate.
        valid = np.zeros(20, dtype=bool)
        valid[[0, 1, 5, 6, 10, 11, 15, 16]] = True
        rain[~valid] = np.nan
        ndvi[~valid] = np.nan
        result = analyze_lag_series(rain, ndvi, max_lag=0, min_samples=4)
        row = result["results"][0]
        self.assertEqual(row["sample_count"], 8)
        self.assertEqual(row["autocorrelation_pair_count"], 4)
        self.assertEqual(row["status"], "estimated")
        self.assertIsNotNone(row["p_value"])
        self.assertEqual(result["status"], "estimated")
        self.assertEqual(result["correlation_status"], "estimated")
        self.assertEqual(result["inference_status"], "estimated")

    def test_invalid_lengths_and_lags_rejected(self):
        with self.assertRaises(ValueError):
            analyze_lag_series([1, 2], [1], max_lag=0)
        with self.assertRaises(ValueError):
            analyze_lag_series(np.arange(10), np.arange(10), max_lag=10)

    def test_insufficient_samples_explicit(self):
        result = analyze_lag_series(np.arange(8), np.arange(8), max_lag=2, min_samples=12)
        self.assertEqual(result["status"], "insufficient_data")
        self.assertTrue(all(row["status"] == "insufficient_samples" for row in result["results"]))


    def test_moving_block_bootstrap_is_reproducible_and_bounded(self):
        from services.statistics import moving_block_bootstrap_ci

        rain = np.sin(np.arange(48) / 3) + np.arange(48) / 30
        ndvi = np.roll(rain, 2) + np.cos(np.arange(48) / 5) * 0.1
        first = moving_block_bootstrap_ci(
            rain, ndvi, block_length=4, n_resamples=250, random_state=17
        )
        second = moving_block_bootstrap_ci(
            rain, ndvi, block_length=4, n_resamples=250, random_state=17
        )
        self.assertEqual(first, second)
        self.assertEqual(first["status"], "estimated")
        self.assertEqual(len(first["pearson_r_ci"]), 2)
        self.assertLessEqual(-1, first["pearson_r_ci"][0])
        self.assertLessEqual(first["pearson_r_ci"][1], 1)

    def test_moving_block_bootstrap_keeps_missing_months_in_timeline(self):
        from services.statistics import moving_block_bootstrap_ci

        rain = np.arange(40, dtype=float)
        ndvi = rain + np.sin(rain)
        ndvi[8:30] = np.nan
        result = moving_block_bootstrap_ci(
            rain, ndvi, block_length=3, n_resamples=250, random_state=4
        )
        self.assertIn(result["status"], {"estimated", "insufficient_valid_resamples"})
        self.assertEqual(result["method"], "moving_block_percentile_bootstrap")

    def test_moving_block_bootstrap_rejects_invalid_parameters(self):
        from services.statistics import moving_block_bootstrap_ci

        with self.assertRaises(ValueError):
            moving_block_bootstrap_ci(np.arange(10), np.arange(10), block_length=0)
        for count in (0, 1, 100, 124):
            with self.subTest(n_resamples=count):
                with self.assertRaisesRegex(ValueError, "at least 125"):
                    moving_block_bootstrap_ci(
                        np.arange(10), np.arange(10), n_resamples=count
                    )

    def test_moving_block_bootstrap_accepts_minimum_resample_count(self):
        from services.statistics import moving_block_bootstrap_ci

        rain = np.sin(np.arange(48) / 3) + np.arange(48) / 30
        ndvi = np.roll(rain, 2) + np.cos(np.arange(48) / 5) * 0.1
        result = moving_block_bootstrap_ci(
            rain, ndvi, block_length=4, n_resamples=125, random_state=17
        )
        self.assertGreaterEqual(result["successful_resamples"], 100)
        self.assertEqual(result["requested_resamples"], 125)

    def test_moving_block_bootstrap_rejects_boolean_and_non_numeric_parameters(self):
        from services.statistics import moving_block_bootstrap_ci

        rain = np.arange(18, dtype=float)
        for kwargs in (
            {"block_length": True}, {"block_length": 2.5},
            {"n_resamples": True}, {"n_resamples": 2.5},
            {"confidence_level": True}, {"confidence_level": "0.95"},
            {"confidence_level": float("nan")},
        ):
            with self.subTest(kwargs=kwargs):
                with self.assertRaises(ValueError):
                    moving_block_bootstrap_ci(rain, rain, **kwargs)


if __name__ == "__main__":
    unittest.main()
