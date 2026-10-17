"""Integrity tests: the current API must not invent scientific measurements."""
import unittest

from services.processor import DATA_SOURCES, process_nepal_lag_analysis


class AnalysisIntegrityTests(unittest.TestCase):
    def test_default_request_is_explicitly_not_computed(self):
        result = process_nepal_lag_analysis()
        self.assertEqual(result["status"], "not_computed")
        self.assertEqual(result["analysis_status"], "not_computed")
        self.assertFalse(result["provenance"]["calculation_performed"])
        self.assertFalse(result["provenance"]["measurements_included"])
        self.assertEqual(result["lag_analysis"], [])
        self.assertIsNone(result["time_series"])

    def test_no_fabricated_granule_count_or_correlation(self):
        result = process_nepal_lag_analysis(zone_id="terai", max_lag=3)
        self.assertNotIn("granules_analyzed", result)
        self.assertNotIn("peak_correlation", result)
        self.assertNotIn("optimal_lag_months", result)
        self.assertEqual(result["lag_analysis"], [])

    def test_parameters_are_echoed_for_auditing(self):
        result = process_nepal_lag_analysis(
            zone_id="midhills", max_lag=4, start_year=2005, end_year=2019
        )
        self.assertEqual(result["zone"], "midhills")
        self.assertEqual(result["max_lag_months"], 4)
        self.assertEqual(result["year_start"], 2005)
        self.assertEqual(result["year_end"], 2019)

    def test_invalid_year_range_is_rejected(self):
        with self.assertRaises(ValueError):
            process_nepal_lag_analysis(start_year=2020, end_year=2019)

    def test_invalid_lag_is_rejected(self):
        with self.assertRaises(ValueError):
            process_nepal_lag_analysis(max_lag=25)

    def test_source_catalog_is_not_claimed_as_downloaded(self):
        self.assertGreaterEqual(len(DATA_SOURCES), 2)
        self.assertTrue(all(source["status"] in {"not_downloaded", "reference_only"} for source in DATA_SOURCES))


if __name__ == "__main__":
    unittest.main()
