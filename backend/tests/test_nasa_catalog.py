"""Tests for defensive normalization of NASA CMR granule metadata."""
import unittest
from types import SimpleNamespace

from services.nasa_catalog import extract_granule_metadata


class GranuleMetadataTests(unittest.TestCase):
    def test_extracts_complete_umm_metadata(self):
        item = SimpleNamespace(umm={
            "GranuleUR": "G123",
            "CollectionReference": {"ShortName": "MOD13A3"},
            "TemporalExtent": {"RangeDateTime": {
                "BeginningDateTime": "2023-01-01T00:00:00Z",
                "EndingDateTime": "2023-01-31T23:59:59Z",
            }},
            "DataGranule": {"Identifiers": [
                {"Identifier": "PRODUCER-123"}
            ]},
            "RelatedUrls": [
                {"URL": "https://example.test/data.hdf"},
                {"URL": "https://example.test/metadata"},
            ],
        })
        result = extract_granule_metadata(item, "GPM_3IMERGM")
        self.assertEqual(result, {
            "granule_id": "G123",
            "title": "MOD13A3",
            "beginning_datetime": "2023-01-01T00:00:00Z",
            "ending_datetime": "2023-01-31T23:59:59Z",
            "producer_granule_id": "PRODUCER-123",
            "links": [
                "https://example.test/data.hdf",
                "https://example.test/metadata",
            ],
        })

    def test_missing_optional_fields_use_safe_defaults(self):
        result = extract_granule_metadata(SimpleNamespace(umm={}), "MOD13A3")
        self.assertEqual(result, {
            "granule_id": None,
            "title": "MOD13A3",
            "beginning_datetime": None,
            "ending_datetime": None,
            "producer_granule_id": None,
            "links": [],
        })

    def test_malformed_nested_fields_do_not_crash(self):
        item = {
            "umm": {
                "GranuleUR": "G456",
                "CollectionReference": None,
                "TemporalExtent": {"RangeDateTime": "unexpected"},
                "DataGranule": {"Identifiers": [None, "bad", {}]},
                "RelatedUrls": [None, "bad", {}, {"URL": 123}],
            }
        }
        result = extract_granule_metadata(item, "GPM_3IMERGM")
        self.assertEqual(result["granule_id"], "G456")
        self.assertEqual(result["title"], "GPM_3IMERGM")
        self.assertIsNone(result["beginning_datetime"])
        self.assertIsNone(result["producer_granule_id"])
        self.assertEqual(result["links"], [])

    def test_dictionary_umm_and_link_limit_are_supported(self):
        urls = [{"URL": f"https://example.test/{index}"} for index in range(12)]
        result = extract_granule_metadata(
            {"GranuleUR": "G789", "RelatedUrls": urls}, "MOD13A3"
        )
        self.assertEqual(result["granule_id"], "G789")
        self.assertEqual(len(result["links"]), 10)
        self.assertEqual(result["links"][0], "https://example.test/0")


if __name__ == "__main__":
    unittest.main()
