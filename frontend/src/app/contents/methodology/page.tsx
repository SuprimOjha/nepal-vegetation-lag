import Link from "next/link";
import {
  ArrowRight,
  Database,
  Filter,
  ChartNoAxesCombined,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import SiteShell from "../../components/SiteShell";

const steps = [
  {
    number: "01",
    title: "Acquire documented observations",
    description:
      "Select a monthly vegetation-index product and a compatible precipitation dataset. Record collection identifiers, observation periods, units, resolution, access dates, and source documentation.",
  },
  {
    number: "02",
    title: "Prepare and quality-check the data",
    description:
      "Apply product-specific scale factors and quality flags, handle missing observations correctly, align time periods, and ensure the spatial grids are compatible.",
  },
  {
    number: "03",
    title: "Construct comparable time series",
    description:
      "Aggregate observations to a consistent monthly or seasonal timeline. Document spatial aggregation, valid-observation counts, and any exclusions.",
  },
  {
    number: "04",
    title: "Account for seasonal patterns",
    description:
      "Assess the strong annual cycles in monsoon rainfall and vegetation. Where appropriate, analyze anomalies or remove seasonal climatology before estimating lagged associations.",
  },
  {
    number: "05",
    title: "Estimate lagged associations",
    description:
      "Calculate the relationship between rainfall at month t and vegetation at month t + k across a predefined range of lag values. Track the correlation, sample size, and valid data coverage for each lag.",
  },
  {
    number: "06",
    title: "Evaluate uncertainty and robustness",
    description:
      "Assess sample adequacy, sensitivity to time period and preprocessing, temporal autocorrelation, and multiple-lag testing. Report uncertainty and avoid presenting weak estimates as reliable findings.",
  },
  {
    number: "07",
    title: "Publish reproducible results",
    description:
      "Display maps and charts with units, data sources, method details, selected parameters, and limitations. Export enough metadata for another person to repeat the analysis.",
  },
];

export default function MethodologyPage() {
  return (
    <SiteShell>
      <section className="ep-page-hero">
        <div className="ep-container">
          <div className="ep-eyebrow">03 / Research methodology</div>
          <h1>
            From satellite observations
            <br />
            to <em>defensible evidence.</em>
          </h1>
          <p>
            A transparent workflow for aligning precipitation and vegetation
            records, estimating temporal associations, evaluating uncertainty,
            and making the analysis reproducible.
          </p>
        </div>
      </section>

      <section className="ep-section">
        <div className="ep-container">
          <div className="ep-section-heading">
            <h2>The analysis pipeline</h2>
            <p>
              Each stage should be testable on a small study area before
              scaling up to all of Nepal.
            </p>
          </div>

          <div className="ep-card-grid">
            <article className="ep-card">
              <div className="ep-card-icon">
                <Database size={22} />
              </div>
              <h3>Observations</h3>
              <p>
                Satellite vegetation indices and precipitation records from
                documented data providers.
              </p>
            </article>

            <article className="ep-card">
              <div className="ep-card-icon">
                <Filter size={22} />
              </div>
              <h3>Quality control</h3>
              <p>
                Consistent grids, valid observations, quality flags, and
                transparent handling of missing data.
              </p>
            </article>

            <article className="ep-card">
              <div className="ep-card-icon">
                <ChartNoAxesCombined size={22} />
              </div>
              <h3>Statistical analysis</h3>
              <p>
                Time-series comparisons, lagged correlation, robustness
                checks, and uncertainty reporting.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="ep-section ep-section-white">
        <div className="ep-container">
          <div className="ep-section-heading">
            <h2>Seven steps from data to results</h2>
            <p>
              Keep each processing decision explicit so the same analysis
              can be rerun and independently checked.
            </p>
          </div>

          <div>
            {steps.map((step) => (
              <article className="ep-step" key={step.number}>
                <div className="ep-step-number">{step.number}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ep-section">
        <div className="ep-container ep-two-col">
          <article className="ep-card">
            <div className="ep-card-icon">
              <ShieldCheck size={22} />
            </div>
            <h3>Scientific safeguards</h3>
            <p>
              A maximum correlation is not automatically a meaningful
              biological lag. Seasonal cycles, autocorrelation, missing
              observations, trends, and multiple comparisons can create
              misleading results.
            </p>
            <p style={{ marginTop: 12 }}>
              The implementation should assess these issues and clearly
              label estimates that are exploratory or unreliable.
            </p>
          </article>

          <article className="ep-card">
            <div className="ep-card-icon">
              <FileCheck2 size={22} />
            </div>
            <h3>Reproducibility checklist</h3>
            <ul
              style={{
                paddingLeft: 19,
                color: "#65736b",
                fontSize: 13,
                lineHeight: 1.9,
              }}
            >
              <li>Dataset names, versions, and source URLs.</li>
              <li>Time period and geographic mask.</li>
              <li>Quality filters and missing-data rules.</li>
              <li>Aggregation and anomaly calculation methods.</li>
              <li>Lag range, statistical tests, and sample size.</li>
              <li>Limitations and uncertainty information.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="ep-section ep-section-white">
        <div className="ep-container">
          <div className="ep-band">
            <h2>Next step: validate the pipeline on real data.</h2>
            <p>
              Begin with one small area and a limited date range. Verify
              each dataset, test the calculations, and only then generate
              regional maps or scientific summaries.
            </p>
            <Link
              href="/research/nepal"
              className="ep-button"
            >
              Open research workspace <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}