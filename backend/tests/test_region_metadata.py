"""Regression tests for the legacy region metadata router."""
import unittest

from app.api.endpoints import get_regions


class RegionMetadataTests(unittest.TestCase):
    def test_regions_do_not_publish_unverified_lag_statistics(self):
        response = get_regions()

        self.assertEqual(response["status"], "not_computed")
        self.assertEqual(response["statistics_status"], "not_computed")
        self.assertFalse(response["statistics_available"])
        self.assertGreaterEqual(len(response["regions"]), 1)

        for region in response["regions"]:
            self.assertTrue(region["id"])
            self.assertTrue(region["name"])
            self.assertTrue(region["country"])
            self.assertNotIn("r", region)
            self.assertNotIn("correlation", region)
            self.assertNotIn("default_lag_months", region)
            self.assertNotIn("optimal_lag_months", region)


if __name__ == "__main__":
    unittest.main()
