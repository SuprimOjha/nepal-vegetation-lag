import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Activity,
  CloudRain,
  Mountain,
  Layers3,
  ChartNoAxesCombined,
  Globe2,
} from "lucide-react";
import SiteShell from "./components/SiteShell";

export default function HomePage() {
  return (
    <SiteShell>
      <section className="ep-home-hero">
        <div className="ep-container ep-hero-grid">
          <div>
            <div className="ep-eyebrow">
              Earth systems research · Nepal
            </div>

            <h1 className="ep-title">
              When rain falls,
              <br />
              when does
              <br />
              <em>the land respond?</em>
            </h1>

            <p className="ep-lead">
              Explore the relationship between precipitation and vegetation
              across Nepal&apos;s dramatic landscapes. EonPulse investigates
              the time between rainfall and measurable changes in vegetation
              using satellite observations and reproducible analysis.
            </p>

            <div className="ep-actions">
              <Link
                href="/research/nepal"
                className="ep-button ep-button-primary"
              >
                Enter research workspace
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/contents/overview"
                className="ep-button ep-button-secondary"
              >
                Explore the research
                <ArrowDownRight size={17} />
              </Link>
            </div>

            <div className="ep-hero-note">
              <span className="ep-status-dot" />
              Nepal study area · Real-data integration in progress
            </div>
          </div>

          <div
            className="ep-visual"
            role="img"
            aria-label="Decorative topographic contour illustration representing Nepal. This is not a measured map."
          >
            <div className="ep-visual-top">
              <span className="ep-visual-kicker">
                THE HIMALAYAN REGION
              </span>
              <span className="ep-visual-chip">
                STUDY AREA · NEPAL
              </span>
            </div>

            <div className="ep-visual-map">
              <div className="ep-map-line" />
              <div className="ep-map-line" />
              <div className="ep-map-line" />
              <div className="ep-map-line" />
              <div className="ep-visual-marker" />
              <div className="ep-visual-label">Nepal study region</div>
              <div className="ep-visual-coordinates">
                Approx. 80°–88.3° E / 26.3°–30.5° N
              </div>
            </div>

            <div className="ep-visual-bottom">
              <div>
                <strong>Rainfall → Green-up</strong>
                <span>The relationship under investigation</span>
              </div>
              <Activity size={28} color="#d7edb7" />
            </div>
          </div>
        </div>
      </section>

      <section className="ep-section ep-section-white">
        <div className="ep-container">
          <div className="ep-section-heading">
            <h2>
              One research question.
              <br />
              Three connected systems.
            </h2>
            <p>
              Investigate rainfall, vegetation dynamics, and topography
              together to understand how ecosystems respond to changing
              environmental conditions.
            </p>
          </div>

          <div className="ep-card-grid">
            <article className="ep-card">
              <div className="ep-card-icon">
                <CloudRain size={22} />
              </div>
              <h3>01 / Precipitation</h3>
              <p>
                Examine monthly rainfall, seasonal patterns, and departures
                from historical precipitation conditions using documented
                climate datasets.
              </p>
              <Link
                href="/contents/methodology"
                className="ep-card-link"
              >
                Explore the method <ArrowRight size={15} />
              </Link>
            </article>

            <article className="ep-card">
              <div className="ep-card-icon">
                <Activity size={22} />
              </div>
              <h3>02 / Vegetation response</h3>
              <p>
                Use satellite-derived NDVI and EVI observations to investigate
                changes in vegetation greenness through time.
              </p>
              <Link
                href="/contents/overview"
                className="ep-card-link"
              >
                Understand the study <ArrowRight size={15} />
              </Link>
            </article>

            <article className="ep-card">
              <div className="ep-card-icon">
                <Mountain size={22} />
              </div>
              <h3>03 / Physiography</h3>
              <p>
                Explore how Nepal&apos;s Terai, hills, and Himalayan
                highlands provide different environmental contexts for
                studying vegetation response.
              </p>
              <Link
                href="/contents/topography"
                className="ep-card-link"
              >
                Explore the terrain <ArrowRight size={15} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="ep-section">
        <div className="ep-container">
          <div className="ep-section-heading">
            <h2>Designed for scientific exploration.</h2>
            <p>
              The goal is not simply to display environmental data, but to
              make the analysis understandable, traceable, and reproducible.
            </p>
          </div>

          <div className="ep-card-grid">
            <article className="ep-card">
              <div className="ep-card-icon">
                <Layers3 size={22} />
              </div>
              <h3>Earth observation</h3>
              <p>
                Bring satellite vegetation observations and precipitation
                data into one consistent analysis workflow.
              </p>
            </article>

            <article className="ep-card">
              <div className="ep-card-icon">
                <ChartNoAxesCombined size={22} />
              </div>
              <h3>Lag analysis</h3>
              <p>
                Compare time series at different time offsets and evaluate
                whether vegetation changes follow rainfall changes.
              </p>
            </article>

            <article className="ep-card">
              <div className="ep-card-icon">
                <Globe2 size={22} />
              </div>
              <h3>Regional context</h3>
              <p>
                Connect statistical results to geographic location, terrain,
                data quality, and the limits of the observations.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="ep-section ep-section-white">
        <div className="ep-container">
          <div className="ep-band">
            <h2>Start with Nepal. Build toward a wider picture.</h2>
            <p>
              Begin with a manageable study area, acquire real observations,
              validate the analysis, and expand only when the results and
              processing workflow are reliable.
            </p>
            <Link href="/research/nepal" className="ep-button">
              Open research workspace <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}