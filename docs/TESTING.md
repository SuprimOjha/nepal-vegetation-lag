# Testing the backend

Run tests from the repository root after installing backend dependencies.

```bash
python -m pip install -r backend/requirements.txt
python -m unittest discover -s backend/tests -v
```

If the GitHub Actions workflow uses a different working directory or discovery command, follow the workflow configuration as the source of truth and keep this guide synchronized.

## What tests should cover

- Invalid year ranges and lag values are rejected.
- A default request is explicitly not computed.
- Missing catalog records are not replaced by fabricated granule identifiers.
- Missing observations, constant arrays, and too-short series are handled safely.
- Known synthetic relationships recover the expected lag direction.
- Benjamini–Hochberg adjusted values are monotonic in sorted p-value order and remain within [0, 1].
- Output metadata records parameters and sample counts.
- Failures do not return plausible-looking scientific numbers.

Use deterministic synthetic data for unit tests. Clearly label them as synthetic; they are not evidence about Nepal's actual vegetation response.