import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  Target,
} from "lucide-react";
import SiteShell from "../../components/SiteShell";

export default function OverviewPage() {
  return (
    <SiteShell>
      <section className="ep-page-hero">
        <div className="ep-container">
          <div className="ep-eyebrow">01 / Research overview</div>
          <h1>
            Understanding the time
            <br />
            between <em>rain and green.</em>
          </h1>
          <p>
            EonPulse Nepal investigates how vegetation greenness varies
            following precipitation changes, and how these relationships may
            differ across the country&apos;s environmental regions.
          </p>
        </div>
      </section>

      <section className="ep-section">
        <div className="ep-container ep-two-col">
          <article className="ep-card">
            <div className="ep-card-icon">
              <CircleHelp size={22} />
            </div>
            <h3>The research question</h3>
            <p>
              After rainfall increases or decreases, how long does it take
              for satellite-observed vegetation greenness to show a
              corresponding response? Does the observed relationship vary
              across Nepal?
            </p>
          </article>

          <article className="ep-card">
            <div className="ep-card-icon">
              <Target size={22} />
            </div>
            <h3>The research objective</h3>
            <p>
              Develop a reproducible workflow that combines precipitation
              and vegetation time series, estimates lagged associations,
              and displays their uncertainty and geographic context.
            </p>
          </article>
        </div>
      </section>

      <section className="ep-section ep-section-white">
        <div className="ep-container ep-prose">
          <h2>Why vegetation lag matters</h2>
          <p>
            Rainfall does not translate directly into an immediate change
            in canopy greenness. Water availability, soil properties,
            vegetation type, temperature, elevation, land management, and
            seasonal growth patterns can all influence what satellites
            observe and when they observe it.
          </p>
          <p>
            A lag analysis looks for temporal relationships between
            precipitation and vegetation measurements. It can help identify
            patterns worth investigating, but a statistical association
            alone does not establish that rainfall caused the observed
            vegetation change.
          </p>

          <h3>What will be measured?</h3>
          <ul>
            <li>
              <strong>Precipitation:</strong> rainfall amounts or rates
              aggregated to a consistent monthly time series.
            </li>
            <li>
              <strong>NDVI:</strong> a satellite-derived indicator related
              to vegetation greenness.
            </li>
            <li>
              <strong>EVI:</strong> a related vegetation index designed to
              improve sensitivity in some vegetation conditions.
            </li>
            <li>
              <strong>Lagged association:</strong> the relationship between
              rainfall at one time and vegetation observations at later
              time offsets.
            </li>
            <li>
              <strong>Uncertainty and coverage:</strong> the number,
              quality, and consistency of observations supporting a result.
            </li>
          </ul>

          <div className="ep-callout">
            <p>
              <strong>Scientific caution:</strong> NDVI and EVI indicate
              spectral properties associated with vegetation; they are not
              direct measurements of biomass, soil moisture, or ecosystem
              productivity. Results must be interpreted alongside data
              quality and environmental context.
            </p>
          </div>

          <h3>What the platform aims to deliver</h3>
          <ul>
            <li>Interactive geographic exploration of Nepal.</li>
            <li>Time-series charts for rainfall and vegetation.</li>
            <li>Lagged-correlation analysis with appropriate diagnostics.</li>
            <li>Comparisons among physiographic regions.</li>
            <li>Documented data sources and reproducible parameters.</li>
          </ul>
        </div>
      </section>

      <section className="ep-section">
        <div className="ep-container">
          <div className="ep-band">
            <h2>From research question to measurable evidence.</h2>
            <p>
              Learn how the study area is divided into environmental
              regions, then follow the analytical workflow used to compare
              rainfall and vegetation observations.
            </p>
            <div className="ep-actions">
              <Link
                href="/contents/topography"
                className="ep-button"
              >
                Explore topography <ArrowRight size={16} />
              </Link>
              <Link
                href="/contents/methodology"
                className="ep-button"
              >
                Read methodology <BookOpen size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}