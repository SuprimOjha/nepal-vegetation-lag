import Link from "next/link";
import {
  ArrowRight,
  Mountain,
  Waves,
  Trees,
  Snowflake,
} from "lucide-react";
import SiteShell from "../../components/SiteShell";

const regions = [
  {
    number: "01",
    title: "Terai and southern plains",
    subtitle: "Lower-elevation environments",
    icon: Waves,
    description:
      "The southern plains contain extensive agricultural landscapes, settlements, and river systems. Irrigation, crop calendars, flooding, and monsoon rainfall can all influence seasonal vegetation signals.",
    questions: [
      "How does vegetation greenness vary through the agricultural calendar?",
      "Does the rainfall relationship differ between irrigated and rain-fed areas?",
      "How do flood-prone areas differ from surrounding land?",
    ],
  },
  {
    number: "02",
    title: "Middle hills",
    subtitle: "Slopes, valleys, and terraces",
    icon: Trees,
    description:
      "The middle hills contain varied elevations, aspects, forests, agricultural terraces, and settlement patterns. These differences can produce spatially heterogeneous rainfall and vegetation responses.",
    questions: [
      "Do vegetation responses differ by elevation or slope aspect?",
      "How do forests and agricultural land differ in their seasonal patterns?",
      "Are rainfall-response estimates consistent across neighboring areas?",
    ],
  },
  {
    number: "03",
    title: "High Himalaya",
    subtitle: "Alpine and high-mountain environments",
    icon: Snowflake,
    description:
      "High-mountain landscapes include alpine vegetation, exposed rock, snow, ice, and strong seasonal constraints. Snow cover, cloud contamination, and sparse vegetation can complicate satellite-index interpretation.",
    questions: [
      "When are valid vegetation observations available?",
      "How do snow and cloud contamination affect index quality?",
      "Are there enough valid observations to estimate a meaningful lag?",
    ],
  },
];

export default function TopographyPage() {
  return (
    <SiteShell>
      <section className="ep-page-hero">
        <div className="ep-container">
          <div className="ep-eyebrow">02 / Physiographic context</div>
          <h1>
            One country.
            <br />
            <em>Remarkably different</em> landscapes.
          </h1>
          <p>
            Nepal&apos;s sharp elevation gradients create contrasting
            climates, vegetation types, land uses, and observation
            conditions. Understanding these differences is essential before
            comparing rainfall-response patterns.
          </p>
        </div>
      </section>

      <section className="ep-section">
        <div className="ep-container">
          <div className="ep-section-heading">
            <h2>Three broad environmental settings</h2>
            <p>
              These regions are a starting point for interpretation, not a
              substitute for a validated geographic classification.
            </p>
          </div>

          <div className="ep-two-col">
            {regions.map((region) => {
              const Icon = region.icon;

              return (
                <article className="ep-zone-card" key={region.number}>
                  <div className="ep-zone-number">
                    REGION {region.number}
                  </div>

                  <div
                    className="ep-card-icon"
                    style={{ marginTop: 15 }}
                  >
                    <Icon size={23} />
                  </div>

                  <h3>{region.title}</h3>
                  <p
                    style={{
                      marginBottom: 12,
                      color: "#245c43",
                      fontWeight: 700,
                    }}
                  >
                    {region.subtitle}
                  </p>
                  <p>{region.description}</p>

                  <h3 style={{ fontSize: 14, marginTop: 22 }}>
                    Questions to investigate
                  </h3>
                  <ul
                    style={{
                      paddingLeft: 19,
                      color: "#65736b",
                      fontSize: 13,
                      lineHeight: 1.8,
                    }}
                  >
                    {region.questions.map((question) => (
                      <li key={question} style={{ marginBottom: 7 }}>
                        {question}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ep-section ep-section-white">
        <div className="ep-container ep-prose">
          <h2>How terrain enters the analysis</h2>
          <p>
            A map of elevation alone does not explain vegetation response.
            Terrain is useful when combined with observations of rainfall,
            vegetation, land cover, and data quality.
          </p>

          <h3>1. Elevation and temperature</h3>
          <p>
            Elevation is associated with temperature and growing-season
            differences. If the analysis compares elevation zones, it should
            use a documented digital elevation model and a defined
            classification rule.
          </p>

          <h3>2. Land cover and human activity</h3>
          <p>
            Croplands, forests, grasslands, and sparsely vegetated
            environments can have different seasonal patterns. Irrigation,
            planting, harvesting, and land-cover change may also affect
            rainfall-to-vegetation relationships.
          </p>

          <h3>3. Satellite observation quality</h3>
          <p>
            Clouds, snow, terrain shadows, mixed pixels, and missing
            observations can reduce the reliability of vegetation indices.
            The application should show where the data are insufficient
            instead of displaying misleading lag estimates.
          </p>

          <div className="ep-callout">
            <p>
              <strong>Geographic accuracy:</strong> the study-area bounding
              box is useful for filtering data, but it includes some
              neighboring territory outside Nepal. Use a validated Nepal
              country-boundary polygon to clip raster data when the analysis
              requires the national boundary.
            </p>
          </div>
        </div>
      </section>

      <section className="ep-section">
        <div className="ep-container">
          <div className="ep-band">
            <div className="ep-eyebrow" style={{ color: "#d7edb7" }}>
              From landscape to evidence
            </div>
            <h2>Make every regional comparison reproducible.</h2>
            <p>
              Define geographic masks, document the datasets, and apply
              consistent analysis settings before comparing regions.
            </p>
            <Link
              href="/contents/methodology"
              className="ep-button"
            >
              Explore the methodology <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}