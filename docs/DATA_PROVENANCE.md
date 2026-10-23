# Data provenance requirements

Every displayed data item must make clear whether it is a catalog reference, a downloaded source file, a processed dataset, or a computed scientific result.

## Provenance states

| State | Meaning | May support a scientific claim? |
|---|---|---|
| `catalog_only` | Product or granule metadata was discovered | No |
| `downloaded` | Source bytes were retrieved and stored | Not by itself |
| `validated` | File integrity and expected structure were checked | Not by itself |
| `processed` | Documented transformations were applied | Only with method and QA details |
| `computed` | Analysis ran on identified processed inputs | Yes, subject to validation |
| `failed` | A stage failed | No |
| `not_computed` | No analysis result exists yet | No |

## Required metadata

Record provider, product ID, version, acquisition timestamp, temporal coverage, spatial coverage, local checksum, processing code version, and any quality flags. Never substitute a guessed granule ID, placeholder coordinate, or fabricated correlation value for missing metadata.

The UI should distinguish missing metadata from a measured zero. A blank, null, unavailable, and numeric zero are not interchangeable.