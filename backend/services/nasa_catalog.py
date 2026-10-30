"""Defensive parsing for optional NASA CMR granule metadata fields."""
from collections.abc import Mapping


def _mapping(value):
    """Return a mapping value or an empty mapping for absent/malformed fields."""
    return value if isinstance(value, Mapping) else {}


def extract_granule_metadata(item, product):
    """Normalize one earthaccess granule without assuming optional UMM fields exist."""
    umm = getattr(item, "umm", None)
    if not isinstance(umm, Mapping):
        umm = item.get("umm", item) if isinstance(item, Mapping) else {}
    umm = _mapping(umm)

    temporal_extent = _mapping(umm.get("TemporalExtent"))
    range_datetime = _mapping(temporal_extent.get("RangeDateTime"))
    collection = _mapping(umm.get("CollectionReference"))
    data_granule = _mapping(umm.get("DataGranule"))

    identifiers = data_granule.get("Identifiers")
    producer_granule_id = None
    if isinstance(identifiers, (list, tuple)):
        for identifier in identifiers:
            value = _mapping(identifier).get("Identifier")
            if isinstance(value, str) and value:
                producer_granule_id = value
                break

    related_urls = umm.get("RelatedUrls")
    links = []
    if isinstance(related_urls, (list, tuple)):
        links = [
            entry["URL"]
            for entry in related_urls
            if isinstance(entry, Mapping)
            and isinstance(entry.get("URL"), str)
            and entry["URL"]
        ]

    short_name = collection.get("ShortName")
    return {
        "granule_id": umm.get("GranuleUR"),
        "title": short_name if isinstance(short_name, str) and short_name else product,
        "beginning_datetime": range_datetime.get("BeginningDateTime"),
        "ending_datetime": range_datetime.get("EndingDateTime"),
        "producer_granule_id": producer_granule_id,
        "links": links[:10],
    }
