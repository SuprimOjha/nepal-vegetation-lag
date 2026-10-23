# Source data policy

A reproducible run should preserve enough metadata to identify its inputs and understand transformations without exposing credentials.

## Preserve

- Product name, provider, version, and official citation.
- Granule identifiers and provider metadata.
- Retrieval timestamp and source reference.
- Checksums for downloaded files and published artifacts.
- Quality-mask rules, scale factors, units, and processing parameters.
- Code revision and software environment.

## Do not preserve in public artifacts

- Passwords, session cookies, authorization headers, or private tokens.
- Unnecessary personal information.
- Unlicensed redistribution of source files when provider terms do not permit it.

## Missing provenance

If a file cannot be traced to a known source, label its provenance unknown and do not use it as verified scientific input until resolved. A filename or plausible-looking raster is not enough to establish source identity.