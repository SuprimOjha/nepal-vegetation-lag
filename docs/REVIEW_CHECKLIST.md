# Scientific code review checklist

Before approving a change that affects data or statistical results, ask:

- Are source product versions and units explicit?
- Are quality flags, scale factors, and fill values handled correctly?
- Are missing months and invalid observations represented explicitly?
- Is the lag sign convention consistent between code, tests, API, and charts?
- Are sample counts calculated from paired valid observations?
- Are constant and insufficient series handled without fabricated values?
- Are uncertainty assumptions and serial dependence documented?
- Is the multiple-testing family clearly defined?
- Are synthetic tests clearly separated from real observations?
- Can each output be traced to its source inputs and code revision?
- Does the frontend avoid displaying metadata as a measured result?
- Are limitations and possible confounders stated near scientific claims?

For a documentation-only change, verify the text does not imply an unimplemented pipeline is already operational.