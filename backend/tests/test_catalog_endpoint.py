"""Regression tests for controlled NASA catalog endpoint failures."""
import unittest
from types import SimpleNamespace
from unittest.mock import Mock, patch

from fastapi import HTTPException

from app import main as api


class CatalogEndpointTests(unittest.TestCase):
    def _call(self):
        return api.search_nasa_granules(
            product="MOD13A3", start_year=2023, end_year=2023, limit=20
        )

    def test_none_from_catalog_returns_service_unavailable(self):
        client = SimpleNamespace(search_data=Mock(return_value=None))
        with patch.object(api, "earthaccess", client):
            with self.assertRaises(HTTPException) as caught:
                self._call()
        self.assertEqual(caught.exception.status_code, 503)
        self.assertIn("normalization failed", caught.exception.detail)

    def test_catalog_exception_returns_service_unavailable(self):
        client = SimpleNamespace(
            search_data=Mock(side_effect=RuntimeError("upstream unavailable"))
        )
        with patch.object(api, "earthaccess", client):
            with self.assertRaises(HTTPException) as caught:
                self._call()
        self.assertEqual(caught.exception.status_code, 503)
        self.assertIn("RuntimeError", caught.exception.detail)

    def test_empty_catalog_result_is_a_valid_empty_response(self):
        client = SimpleNamespace(search_data=Mock(return_value=[]))
        with patch.object(api, "earthaccess", client):
            response = self._call()
        self.assertEqual(response["status"], "catalog_metadata")
        self.assertEqual(response["returned_count"], 0)
        self.assertEqual(response["granules"], [])
        self.assertFalse(response["is_download"])
        self.assertFalse(response["is_analysis"])

    def test_valid_granule_response_keeps_metadata_contract(self):
        item = SimpleNamespace(umm={
            "GranuleUR": "TEST-GRANULE",
            "CollectionReference": {"ShortName": "MOD13A3"},
        })
        client = SimpleNamespace(search_data=Mock(return_value=[item]))
        with patch.object(api, "earthaccess", client):
            response = self._call()
        self.assertEqual(response["returned_count"], 1)
        self.assertEqual(response["granules"][0]["granule_id"], "TEST-GRANULE")
        self.assertEqual(response["granules"][0]["title"], "MOD13A3")


if __name__ == "__main__":
    unittest.main()
