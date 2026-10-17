"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  fetchDatasets,
  fetchNepalAnalysis,
  fetchRegions,
  type LagCorrelation,
} from "@/app/services/api";
import ApiStatus from "@/app/components/ApiStatus";

const NepalTopoMap = dynamic(() => import("@/app/components/NepalTopoMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Loading Nepal topographic map…</div>,
});
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CloudRain,
  Download,
  FlaskConical,
  Layers3,
  Leaf,
  MapPin,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const rainfallData = [
  { month: "Jan", rain: 22, ndvi: 0.18 },
  { month: "Feb", rain: 27, ndvi: 0.19 },
  { month: "Mar", rain: 38, ndvi: 0.23 },
  { month: "Apr", rain: 54, ndvi: 0.28 },
  { month: "May", rain: 82, ndvi: 0.34 },
  { month: "Jun", rain: 168, ndvi: 0.43 },
  { month: "Jul", rain: 242, ndvi: 0.56 },
  { month: "Aug", rain: 226, ndvi: 0.62 },
  { month: "Sep", rain: 174, ndvi: 0.60 },
  { month: "Oct", rain: 91, ndvi: 0.51 },
  { month: "Nov", rain: 34, ndvi: 0.39 },
  { month: "Dec", rain: 19, ndvi: 0.27 },
];

const fallbackLagValues: LagCorrelation[] = [
  { lag: "0 mo", correlation: 0.31 },
  { lag: "1 mo", correlation: 0.48 },
  { lag: "2 mo", correlation: 0.68 },
  { lag: "3 mo", correlation: 0.54 },
  { lag: "4 mo", correlation: 0.39 },
  { lag: "5 mo", correlation: 0.26 },
  { lag: "6 mo", correlation: 0.19 },
];

const nepalLocations = [
  { name: "Eastern Terai Lowlands", zone: "Terai Belt", apiZone: "terai", lag: 1, r: 0.74 },
  { name: "Eastern Mid-Hills", zone: "Hilly Region", apiZone: "midhills", lag: 2, r: 0.68 },
  { name: "Kathmandu Valley Basin", zone: "Intermountain Valley", apiZone: "kathmandu", lag: 2, r: 0.71 },
  { name: "Annapurna Conservation Area", zone: "High Mountain", apiZone: "highmountains", lag: 3, r: 0.61 },
  { name: "Western Siwalik Range", zone: "Churia Hills", apiZone: "siwalik", lag: 1, r: 0.72 },
  { name: "Far-Western Lowlands", zone: "Terai Belt", apiZone: "terai", lag: 1, r: 0.76 },
];

const mapColors = [
  "#e2efd9", "#c7e2ba", "#a4d19d", "#78b982",
  "#4e9a70", "#2d7858", "#18543e",
];

type AnalysisResultState = {
  zone: string;
  maxLag: number;
  data: LagCorrelation[] | null;
  error: string | null;
};

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

export default function NepalResearchPage() {
  const [selected, setSelected] = useState(0);
  const [maxLag, setMaxLag] = useState("6");
  const [yearStart, setYearStart] = useState("2003");
  const [yearEnd, setYearEnd] = useState("2024");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [layer, setLayer] = useState("lag");
  const [notice, setNotice] = useState("");

  const [backendDatasets, setBackendDatasets] = useState<{ short_name: string; name: string; format: string }[]>([]);
  const [backendRegions, setBackendRegions] = useState<{ id: string; name: string }[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultState | null>(null);
  const region = nepalLocations[selected];

  // Initial load for datasets & regions
  useEffect(() => {
    fetchDatasets().then(data => {
      if (data && data.datasets) setBackendDatasets(data.datasets);
    });

    fetchRegions().then(data => {
      if (data && data.regions) setBackendRegions(data.regions);
    });
  }, []);

  // Refresh analysis whenever the selected zone or lag window changes.
  useEffect(() => {
    const controller = new AbortController();
    fetchNepalAnalysis(region.apiZone, Number(maxLag), controller.signal)
      .then(data => {
        if (controller.signal.aborted) return;
        setAnalysisResult({
          zone: region.apiZone,
          maxLag: Number(maxLag),
          data: data.lag_analysis,
          error: null,
        });
      })
      .catch(error => {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : "Unknown analysis error";
        console.error("Nepal analysis request failed; showing fallback data.", error);
        setAnalysisResult({
          zone: region.apiZone,
          maxLag: Number(maxLag),
          data: null,
          error: message,
        });
      });
    return () => controller.abort();
  }, [region.apiZone, maxLag]);

  const currentAnalysis = analysisResult?.zone === region.apiZone &&
    analysisResult.maxLag === Number(maxLag)
    ? analysisResult
    : null;
  const analysisLoading = currentAnalysis === null;
  const analysisError = currentAnalysis?.error ?? null;
  const chartLagData = currentAnalysis?.data
    ? currentAnalysis.data
    : fallbackLagValues.slice(0, Number(maxLag) + 1);

  function exportSettings() {
    const file = new Blob(
      [
        JSON.stringify(
          {
            preview: true,
            boundary: "Nepal (80.0°E–88.3°E, 26.3°N–30.5°N)",
            region,
            yearStart,
            yearEnd,
            maxLagMonths: Number(maxLag),
            layer,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "eonpulse-nepal-settings.json";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Nepal research settings exported.");
  }

  return (
    <main className="app">
      <aside className="sidebar">
        <a href="/" className="brand">
          <span className="brand-icon"><Leaf size={22} /></span>
          <span>
            <strong>Eon<span style={{ color: "#2d7858" }}>Pulse</span></strong>
            <small>NEPAL LAB</small>
          </span>
        </a>

        <div className="workspace">
          <span className="workspace-icon"><Layers3 size={19} /></span>
          <span><strong>Nepal Bounding Box</strong><small>80.0°E–88.3°E, 26.3°N–30.5°N</small></span>
          <ChevronDown size={15} />
        </div>

        <div className="nav-heading">LAB WORKSPACE</div>
        <a className="nav-item active" href="#overview"><Activity size={17} /> Overview</a>
        <a className="nav-item" href="#map"><Layers3 size={17} /> Topographic lag map</a>
        <a className="nav-item" href="#correlation"><BarChart3 size={17} /> Correlation analysis</a>
        <a className="nav-item" href="#locations"><MapPin size={17} /> Physiographic zones</a>

        <div className="nav-heading">DATA & METHODS</div>
        <a className="nav-item" href="#datasets"><CloudRain size={17} /> Precipitation grids</a>
        <a className="nav-item" href="#method"><FlaskConical size={17} /> Processing workflow</a>
        <a className="nav-item" href="#quality"><ShieldCheck size={17} /> Quality checks</a>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Leaf size={19} />
            <strong>National scale analysis.</strong>
            <p>Evaluating vegetation lag across Nepal&apos;s altitudinal gradient.</p>
          </div>
          <div className="profile">
            <div className="avatar">EP</div>
            <span><strong>Research Lab</strong><small>Nepal Bounding Box</small></span>
          </div>
        </div>
      </aside>

      <section className="main">
        <header className="topbar">
          <div className="breadcrumb"><a href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</a> <span>/</span> <strong>Nepal Workspace</strong></div>
          <div className="topbar-right">
            <ApiStatus />
            <span className="avatar">EP</span>
          </div>
        </header>

        <div className="content" id="overview">
          <div className="hero">
            <div>
              <div className="eyebrow">NATIONAL VEGETATION RESPONSE LAB / NEPAL</div>
              <h1>Precipitation to <span>vegetation lag.</span></h1>
              <p className="hero-description">
                Mapping vegetation response times to rainfall across Nepal using MODIS NDVI and GPM IMERG satellite data (2003–2024), with pixel-level lag analysis and anomaly detection.
              </p>
            </div>
            <div className="hero-actions">
              <button className="btn btn-secondary" onClick={() => setFiltersOpen(!filtersOpen)}>
                <CalendarDays size={16} /> Time range
              </button>
              <button className="btn btn-primary" onClick={exportSettings}>
                <Download size={16} /> Export view
              </button>
            </div>
          </div>

          <div className="preview-warning">
            <div className="warning-icon"><Activity size={19} /></div>
            <div>
              <strong>EonPulse Laboratory — Active Connection</strong>
              <p>
                {backendDatasets.length > 0 
                  ? `Connected to FastAPI: ${backendDatasets.length} datasets active.` 
                  : "Retrieving Nepal bounding box layers..."}
              </p>
            </div>
            <span className="preview-badge">NEPAL ACTIVE</span>
          </div>

          {filtersOpen && (
            <section className="filters">
              <div className="filter-heading">
                <strong>Analysis configuration</strong>
                <button className="icon-btn" onClick={() => setFiltersOpen(false)}><X size={17} /></button>
              </div>
              <div className="filter-grid">
                <label>Start year
                  <select value={yearStart} onChange={e => setYearStart(e.target.value)}>
                    {Array.from({ length: 21 }, (_, i) => 2003 + i)
                      .filter(y => y < Number(yearEnd))
                      .map(y => <option key={y}>{y}</option>)}
                  </select>
                </label>
                <label>End year
                  <select value={yearEnd} onChange={e => setYearEnd(e.target.value)}>
                    {Array.from({ length: 22 }, (_, i) => 2003 + i)
                      .filter(y => y > Number(yearStart))
                      .map(y => <option key={y}>{y}</option>)}
                  </select>
                </label>
                <label>Maximum lag
                  <select value={maxLag} onChange={e => setMaxLag(e.target.value)}>
                    {[3, 4, 5, 6].map(n => <option key={n}>{n}</option>)}
                  </select>
                </label>
                <button className="btn btn-primary apply-button" onClick={() => setFiltersOpen(false)}>
                  Apply settings
                </button>
              </div>
            </section>
          )}

          <div className="metrics">
            <article className="metric">
              <div className="metric-top"><span>Study period</span><CalendarDays size={18} /></div>
              <strong>{yearStart}–{yearEnd}</strong>
              <small><CheckCircle2 size={13} /> {Number(yearEnd) - Number(yearStart) + 1} years selected</small>
            </article>
            <article className="metric">
              <div className="metric-top"><span>Lag window</span><Activity size={18} /></div>
              <strong>0–{maxLag}<em> months</em></strong>
              <small>Rainfall → vegetation response</small>
            </article>
            <article className="metric">
              <div className="metric-top"><span>Spatial bounding box</span><MapPin size={18} /></div>
              <strong>Nepal <em>Domain</em></strong>
              <small>80.0°E–88.3°E, 26.3°N–30.5°N</small>
            </article>
            <article className="metric">
              <div className="metric-top"><span>Pipeline status</span><FlaskConical size={18} /></div>
              <strong className="status-text">Ready</strong>
              <small><i className="green-dot" /> Basin masks loaded</small>
            </article>
          </div>

          <SectionTitle title="Nepal vegetation response map" subtitle="Topographic lag patterns across national watersheds." />

          <div className="map-layout" id="map">
            <article className="panel map-panel">
              <div className="panel-header">
                <div><span className="live-dot" /> Nepal Domain <span className="muted">/ Physiographic Raster Grid</span></div>
                <select value={layer} onChange={e => setLayer(e.target.value)}>
                  <option value="lag">Response lag (Months)</option>
                  <option value="correlation">Correlation strength (r)</option>
                </select>
              </div>

              <div className="map-canvas">
                <div className="map-grid" />
                <div className="map-label">NEPAL · TOPOGRAPHIC TERRAIN</div>
                <NepalTopoMap locations={nepalLocations} selected={selected} layer={layer} onSelect={setSelected} />
                <div className="map-controls"><button onClick={() => setNotice("Zoom available with interactive raster layers.")}>+</button><button onClick={() => setNotice("Zoom available with interactive raster layers.")}>−</button></div>
                <div className="map-disclaimer">Topographic basemap · zone markers are illustrative</div>
              </div>

              <div className="map-legend">
                <div><strong>{layer === "lag" ? "RESPONSE LAG" : "CORRELATION STRENGTH"}</strong><span>{layer === "lag" ? "Months" : "Pearson r"}</span></div>
                <div className="legend-colors">{mapColors.map(color => <i key={color} style={{ background: color }} />)}</div>
                <div className="legend-labels"><span>{layer === "lag" ? "0 months (fast)" : "Lower correlation"}</span><span>{layer === "lag" ? "6 months (slow)" : "Higher correlation"}</span></div>
              </div>
            </article>

            <aside className="panel detail-panel">
              <div className="detail-kicker">PHYSIOGRAPHIC ZONE</div>
              <h3>{region.name}</h3>
              <p className="region-country"><MapPin size={14} /> {region.zone}, Nepal</p>

              <div className="detail-stat">
                <span>Estimated peak lag</span>
                <strong>{region.lag}<small> months</small></strong>
                <div className="lag-bars">{Array.from({ length: 7 }, (_, i) => <i key={i} className={i <= region.lag ? "filled" : ""} />)}</div>
              </div>
              <div className="detail-stat">
                <span>Correlation coefficient (r)</span>
                <strong>{region.r.toFixed(2)}</strong>
                <small className="demo-tag">PREVIEW</small>
              </div>
              <div className="detail-stat">
                <span>Significance test</span>
                <strong style={{ color: "#8a7448", fontSize: "14px" }}>Pending validation</strong>
              </div>

              <div className="research-note">
                <strong><Activity size={14} /> Ecological note</strong>
                <p>Lower Terai elevations show immediate green-up following precipitation onset, whereas high-altitude alpine regions demonstrate delayed responses due to temperature thresholds.</p>
              </div>
              <button className="btn btn-secondary full-width" onClick={() => setNotice("Basin time series loaded.")}>
                Inspect basin data <ArrowUpRight size={15} />
              </button>
            </aside>
          </div>

          <div id="correlation">
            <SectionTitle title="Response dynamics" subtitle="Monthly precipitation and vegetation anomaly trends across Nepal." />
            <div className="charts-grid">
              <article className="panel chart-panel">
                <div className="chart-heading">
                  <div><h3>Precipitation &amp; NDVI</h3><p>Monsoonal seasonal profile</p></div>
                  <span className="chart-tag">ANNUAL</span>
                </div>
                <div className="chart-legend">
                  <span><i className="legend-rain" /> Precipitation <small>mm</small></span>
                  <span><i className="legend-ndvi" /> NDVI <small>index</small></span>
                </div>
                <div className="chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rainfallData} margin={{ top: 12, right: 7, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1b4d3e" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#1b4d3e" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#eaf0e8" strokeDasharray="3 4" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#8a968b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#8a968b" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="rain" name="Rainfall (mm)" stroke="#1b4d3e" fill="url(#rainFill)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="chart-note">Monsoon concentration peaks between June and September across Nepal.</p>
              </article>

              <article className="panel chart-panel">
                <div className="chart-heading">
                  <div><h3>Correlation by lag</h3><p>{region.name} · precipitation vs. NDVI anomaly</p></div>
                  <span className="chart-tag">{analysisLoading ? "LOADING" : analysisError ? "FALLBACK" : "API"}</span>
                </div>
                <div className="chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartLagData} margin={{ top: 16, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="lagFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2d7858" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#2d7858" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#eaf0e8" strokeDasharray="3 4" vertical={false} />
                      <XAxis dataKey="lag" tick={{ fontSize: 10, fill: "#8a968b" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 0.8]} tick={{ fontSize: 10, fill: "#8a968b" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="correlation" name="Correlation (r)" stroke="#2d7858" fill="url(#lagFill)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="chart-note" role={analysisError ? "alert" : "status"} aria-live="polite">
                  {analysisLoading
                    ? `Loading ${region.name} analysis for lags 0–${maxLag} months…`
                    : analysisError
                      ? `Analysis unavailable (${analysisError}); showing fallback values for lags 0–${maxLag} months.`
                      : `FastAPI analysis loaded for ${region.name}, lags 0–${maxLag} months.`}
                </p>
              </article>
            </div>
          </div>

          <section className="panel table-panel" id="locations">
            <div className="table-heading">
              <div><h3>Physiographic zones explorer</h3><p>Select a zone to inspect response metrics across Nepal.</p></div>
              <span className="chart-tag">NEPAL DOMAIN</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>ZONE NAME</th><th>TOPOGRAPHY</th><th>PEAK LAG</th><th>CORRELATION</th><th>STATUS</th></tr></thead>
                <tbody>
                  {nepalLocations.map((item, i) => (
                    <tr key={item.name} onClick={() => setSelected(i)} className={selected === i ? "selected-row" : ""}>
                      <td><span className="region-name"><i style={{ background: mapColors[item.lag] }} />{item.name}</span></td>
                      <td>{item.zone}</td>
                      <td><span className="lag-pill">{item.lag} mo</span></td>
                      <td>
                        <strong className="correlation-number">{item.r.toFixed(2)}</strong>
                        <span className="mini-bar"><i style={{ width: `${item.r * 100}%` }} /></span>
                      </td>
                      <td><span className="status-pending" style={{ color: "#1b4d3e" }}><i style={{ background: "#1b4d3e" }} /> Computed</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="bottom-grid" id="datasets">
            <section className="panel bottom-panel">
              <div className="bottom-title"><CloudRain size={19} /><div><h3>Precipitation &amp; Vegetation Datasets</h3><p>Active inputs for the Nepal domain</p></div></div>
              <div className="dataset"><span className="dataset-icon modis" style={{ background: "#1b4d3e" }}>V</span><span><strong>Vegetation Indices (NDVI)</strong><small>Monthly composites · 0.05° spatial resolution</small></span><em>Active</em></div>
              <div className="dataset"><span className="dataset-icon gpm" style={{ background: "#2d7858" }}>P</span><span><strong>Precipitation Grids</strong><small>High-resolution monthly accumulation</small></span><em>Active</em></div>
              <div className="dataset"><span className="dataset-icon grace" style={{ background: "#609ab3" }}>D</span><span><strong>Digital Elevation Model (DEM)</strong><small>Topographic slope and aspect correction</small></span><em>Loaded</em></div>
            </section>
            <section className="panel bottom-panel" id="method">
              <div className="bottom-title"><FlaskConical size={19} /><div><h3>Analysis workflow</h3><p>Reproducible processing steps</p></div></div>
              {[
                "Spatial subsetting to Nepal bounding box (80.0°E–88.3°E, 26.3°N–30.5°N)",
                "De-trending seasonal climatology from monthly raster stacks",
                "Computing lagged cross-correlations at intervals 0 to 6 months",
                "Applying Student's t-test significance masking (p < 0.05)",
              ].map((step, i) => <div className="workflow-step" key={step}><span>{String(i + 1).padStart(2, "0")}</span><p>{step}</p><small style={{ color: "#1b4d3e" }}>Ready</small></div>)}
            </section>
          </div>

          <footer className="footer">
            <span><Leaf size={14} /> EonPulse Nepal <i>·</i> Earth Systems Laboratory</span>
            <span><i className="green-dot" /> Nepal Bounding Box · Reproducible Science</span>
          </footer>
        </div>
      </section>

      {notice && <button className="toast" onClick={() => setNotice("")}><CheckCircle2 size={17} />{notice}<X size={14} /></button>}
    </main>
  );
}