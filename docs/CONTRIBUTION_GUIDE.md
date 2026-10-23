# Focused contribution guide

## Keep changes reviewable

- Make one logical change per commit.
- Use a message that describes the change, not a claim about its quality.
- Add or update tests when behavior changes.
- Update docs when scientific conventions or API contracts change.

## For analysis changes

Include a small synthetic example with a known expected outcome. Cover missing values, constant series, insufficient samples, and lag direction where relevant.

## For data changes

Include product/version metadata, source identifiers, quality rules, and a summary of valid coverage. Never add credentials or unverified result files.

## Before submitting

Run the relevant tests, inspect the diff, and explain what was and was not validated. Do not say that real NASA data were processed unless the acquisition and analysis run actually occurred.