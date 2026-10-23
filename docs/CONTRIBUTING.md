# Contributing

Contributions are welcome, especially improvements that make the research easier to reproduce and harder to misinterpret.

## Workflow

1. Open an issue for a substantial change or explain the motivation in the pull request.
2. Work on a focused branch.
3. Keep commits small enough to review and use descriptive messages.
4. Run the backend tests relevant to your change.
5. Update documentation when an endpoint, parameter, unit, or scientific convention changes.
6. Include test evidence and note any limitations.

## Scientific safeguards

- Never invent data values, granule IDs, citations, or computed results.
- Keep synthetic fixtures visibly separate from real observations.
- Document the lag sign convention and units.
- Do not remove validation just to make a test pass.
- Distinguish service health from data availability and analysis completion.
- Treat correlations as associations, not proof of causation.

## Pull requests

Explain what changed, why it changed, how it was tested, and whether it affects scientific interpretation. If the work was not run against real satellite observations, state that explicitly.