"use client";

import { useState, useEffect } from "react";
import { fetchDatasets, fetchRegions } from "@/app/services/api";
import {
  Activity,
  ArrowDownRight,
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
  Menu,
  RefreshCw,
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

const rainfall = [
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

const lagValues = [
  { lag: "0 mo", correlation: 0.31 },
  { lag: "1 mo", correlation: 0.48 },
  { lag: "2 mo", correlation: 0.68 },
  { lag: "3 mo", correlation: 0.54 },
  { lag: "4 mo", correlation: 0.39 },
  { lag: "5 mo", correlation: 0.26 },
  { lag: "6 mo", correlation: 0.19 },
];

const locations = [
  { name: "Eastern Nepal", country: "Nepal", lag: 2, r: 0.68 },
  { name: "Terai lowlands", country: "Nepal / India", lag: 1, r: 0.74 },
  { name: "Western Ghats", country: "India", lag: 3, r: 0.61 },
  { name: "Indo-Gangetic Plain", country: "India", lag: 1, r: 0.72 },
  { name: "Central India", country: "India", lag: 2, r: 0.66 },
  { name: "Bangladesh delta", country: "Bangladesh", lag: 1, r: 0.77 },
];

const mapColors = [
  "#e2efd9", "#c7e2ba", "#a4d19d", "#78b982",
  "#4e9a70", "#2d7858", "#18543e",
];

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

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [maxLag, setMaxLag] = useState("6");
  const [yearStart, setYearStart] = useState("2003");
  const [yearEnd, setYearEnd] = useState("2024");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [layer, setLayer] = useState("lag");
  const [notice, setNotice] = useState("");

  // Backend integration state
  const [backendDatasets, setBackendDatasets] = useState<any[]>([]);
  const [backendRegions, setBackendRegions] = useState<any[]>([]);

  useEffect(() => {
    fetchDatasets().then(data => {
      if (data && data.datasets) {
        setBackendDatasets(data.datasets);
      }
    });

    fetchRegions().then(data => {
      if (data && data.regions) {
        setBackendRegions(data.regions);
      }
    });
  }, []);

  const region = locations[selected];

  function exportSettings() {
    const file = new Blob(
      [
        JSON.stringify(
          {
            preview: true,
            warning: "Illustrative values, not scientific results",
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
    link.download = "rain-to-green-preview.json";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Preview settings exported.");
  }

  return (
    <main className="app">
      <aside className="sidebar">
        <a href="#" className="brand">
          <span className="brand-icon"><Leaf size={22} /></span>
          <span>
            <strong>rain<span className="brand-light">to</span>green</strong>
            <small>EARTH SYSTEMS LAB</small>
          </span>
        </a>

        <div className="workspace">
          <span className="workspace-icon"><Layers3 size={19} /></span>
          <span><strong>South Asia project</strong><small>Research workspace</small></span>
          <ChevronDown size={15} />
        </div>

        <div className="nav-heading">WORKSPACE</div>
        <a className="nav-item active" href="#overview"><Activity size={17} /> Overview</a>
        <a className="nav-item" href="#map"><Layers3 size={17} /> Lag explorer</a>
        <a className="nav-item" href="#correlation"><BarChart3 size={17} /> Correlation analysis</a>
        <a className="nav-item" href="#locations"><MapPin size={17} /> Regional explorer</a>

        <div className="nav-heading">RESEARCH</div>
        <a className="nav-item" href="#datasets"><CloudRain size={17} /> Data sources</a>
        <a className="nav-item" href="#method"><FlaskConical size={17} /> Methodology</a>
        <a className="nav-item" href="#quality"><ShieldCheck size={17} /> Quality checks</a>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Leaf size={19} />
            <strong>Built for discovery.</strong>
            <p>Investigating how ecosystems respond to changing rainfall.</p>
          </div>
          <div className="profile">
            <div className="avatar">RL</div>
            <span><strong>Research workspace</strong><small>Local environment</small></span>
          </div>
        </div>
      </aside>

      <section className="main">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div>
          <div className="topbar-right">
            <span className="environment"><i /> Preview environment</span>
            <span className="avatar">RL</span>
          </div>
        </header>

        <div className="content" id="overview">
          <div className="hero">
            <div>
              <div className="eyebrow">EARTH OBSERVATION / SOUTH ASIA</div>
              <h1>Rainfall to <span>vegetation.</span></h1>
              <p className="hero-description">
                Mapping how long ecosystems take to respond to rainfall.
                Explore the signals hidden in two decades of satellite observations.
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
              <strong>Research preview — FastAPI connected</strong>
              <p>
                {backendDatasets.length > 0 
                  ? `Connected to backend: ${backendDatasets.length} datasets loaded.` 
                  : "Connecting to backend metadata..."}
              </p>
            </div>
            <span className="preview-badge">LIVE API</span>
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
              <div className="metric-top"><span>Active data sources</span><Layers3 size={18} /></div>
              <strong>{backendDatasets.length > 0 ? `0${backendDatasets.length}` : "02"} <em>products</em></strong>
              <small><i className="green-dot" /> MODIS NDVI <i className="blue-dot" /> GPM IMERG</small>
            </article>
            <article className="metric">
              <div className="metric-top"><span>Pipeline status</span><FlaskConical size={18} /></div>
              <strong className="status-text">In setup</strong>
              <small><i className="amber-dot" /> Analysis not computed</small>
            </article>
          </div>

          <SectionTitle title="Vegetation response map" subtitle="Explore illustrative lag patterns across South Asia." />

          <div className="map-layout" id="map">
            <article className="panel map-panel">
              <div className="panel-header">
                <div><span className="live-dot" /> South Asia <span className="muted">/ Regional overview</span></div>
                <select value={layer} onChange={e => setLayer(e.target.value)}>
                  <option value="lag">Response lag</option>
                  <option value="correlation">Correlation strength</option>
                </select>
              </div>

              <div className="map-canvas">
                <div className="map-grid" />
                <div className="map-label">SOUTH ASIA</div>
                <svg className="map-art" viewBox="0 0 700 440" role="img" aria-label="Geographic map preview of South Asia highlighting Nepal">
                  <defs>
                    <clipPath id="landClip">
                      <path d="M115 76 L172 45 L224 65 L260 42 L302 68 L346 82 L381 110 L424 114 L457 143 L489 153 L510 181 L548 194 L569 224 L557 251 L526 264 L507 291 L483 318 L464 347 L449 379 L427 407 L411 383 L400 349 L377 321 L358 286 L337 258 L319 228 L291 210 L260 199 L239 173 L204 159 L181 129 L144 112 Z" />
                    </clipPath>
                  </defs>
                  
                  {/* Base regional landmass */}
                  <path d="M115 76 L172 45 L224 65 L260 42 L302 68 L346 82 L381 110 L424 114 L457 143 L489 153 L510 181 L548 194 L569 224 L557 251 L526 264 L507 291 L483 318 L464 347 L449 379 L427 407 L411 383 L400 349 L377 321 L358 286 L337 258 L319 228 L291 210 L260 199 L239 173 L204 159 L181 129 L144 112 Z" fill="#dfe8d8" stroke="#9cb59a" strokeWidth="2" />
                  
                  <g clipPath="url(#landClip)">
                    {Array.from({ length: 13 }, (_, row) =>
                      Array.from({ length: 17 }, (_, col) => {
                        const n = (row * 3 + col * 5 + row * col) % 7;
                        return <rect key={`${row}-${col}`} x={100 + col * 30} y={42 + row * 30} width="27" height="27" rx="3" fill={mapColors[n]} stroke="#fff" strokeWidth=".8" opacity=".94" />;
                      })
                    )}
                  </g>

                  {/* Country borders / outlines */}
                  <path d="M115 76 L172 45 L224 65 L260 42 L302 68 L346 82 L381 110 L424 114 L457 143 L489 153 L510 181 L548 194 L569 224 L557 251 L526 264 L507 291 L483 318 L464 347 L449 379 L427 407 L411 383 L400 349 L377 321 L358 286 L337 258 L319 228 L291 210 L260 199 L239 173 L204 159 L181 129 L144 112 Z" fill="none" stroke="#8ba78a" strokeWidth="2" />
                  
                  {/* Distinct Highlighted Boundary for Nepal */}
                  <path d="M340 98 Q 365 92, 395 102 Q 410 112, 390 120 Q 360 122, 340 110 Z" fill="#78b982" fillOpacity="0.4" stroke="#2d7858" strokeWidth="2.5" strokeDasharray="3 2" />

                  {/* River/Geographic lines */}
                  <path d="M170 105 L220 122 L254 150 L291 159 L335 175 L374 188 L411 184 L454 204 M239 173 L231 209 L248 246 L276 279 M338 258 L374 243 L400 269" fill="none" stroke="#fff" strokeWidth="2" />

                  {/* Labels */}
                  <text x="165" y="135" className="country-label">PAKISTAN</text>
                  <text x="290" y="145" className="country-label">INDIA</text>
                  <text x="362" y="90" className="country-label" style={{ fontWeight: 700, fill: "#18543e" }}>NEPAL ★</text>
                  <text x="418" y="231" className="country-label">BANGLADESH</text>

                  {/* Interactive Region Points */}
                  {[
                    { x: 305, y: 170, i: 0 },
                    { x: 365, y: 192, i: 1 },
                    { x: 425, y: 230, i: 2 },
                    { x: 455, y: 255, i: 3 },
                    { x: 335, y: 248, i: 4 },
                    { x: 468, y: 220, i: 5 },
                  ].map(p => (
                    <g key={p.i} className="map-point" onClick={() => setSelected(p.i)} role="button" tabIndex={0}>
                      <circle cx={p.x} cy={p.y} r={selected === p.i ? 10 : 7} fill="#fff" stroke="#397753" strokeWidth="2" />
                      <circle cx={p.x} cy={p.y} r="3.5" fill={mapColors[locations[p.i].lag]} />
                    </g>
                  ))}
                </svg>
                <div className="map-controls"><button onClick={() => setNotice("Zoom will be available with the interactive geospatial layer.")}>+</button><button onClick={() => setNotice("Zoom will be available with the interactive geospatial layer.")}>−</button></div>
                <div className="map-disclaimer">Illustrative spatial grid · not georeferenced</div>
              </div>

              <div className="map-legend">
                <div><strong>{layer === "lag" ? "RESPONSE LAG" : "CORRELATION STRENGTH"}</strong><span>{layer === "lag" ? "Months" : "Relative strength"}</span></div>
                <div className="legend-colors">{mapColors.map(color => <i key={color} style={{ background: color }} />)}</div>
                <div className="legend-labels"><span>Shorter response</span><span>Longer response</span></div>
              </div>
            </article>

            <aside className="panel detail-panel">
              <div className="detail-kicker">SELECTED REGION</div>
              <h3>{region.name}</h3>
              <p className="region-country"><MapPin size={14} /> {region.country}</p>

              <div className="detail-stat">
                <span>Illustrative peak lag</span>
                <strong>{region.lag}<small> months</small></strong>
                <div className="lag-bars">{Array.from({ length: 7 }, (_, i) => <i key={i} className={i <= region.lag ? "filled" : ""} />)}</div>
              </div>
              <div className="detail-stat">
                <span>Example correlation</span>
                <strong>{region.r.toFixed(2)}</strong>
                <small className="demo-tag">DEMO VALUE</small>
              </div>
              <div className="detail-stat">
                <span>Statistical significance</span>
                <strong className="pending">Not tested</strong>
              </div>

              <div className="research-note">
                <strong><Activity size={14} /> Interpretation note</strong>
                <p>A lag is a timing estimate, not proof of causation. Soil moisture, groundwater, vegetation type and data quality can all affect the observed relationship.</p>
              </div>
              <button className="btn btn-secondary full-width" onClick={() => setNotice("Connect the analysis API to inspect real monthly values.")}>
                Inspect region <ArrowUpRight size={15} />
              </button>
            </aside>
          </div>

          <div id="correlation">
            <SectionTitle title="Response dynamics" subtitle="Monthly patterns and candidate lag relationships — sample values only." />
            <div className="charts-grid">
              <article className="panel chart-panel">
                <div className="chart-heading">
                  <div><h3>Rainfall & vegetation</h3><p>Example seasonal profile</p></div>
                  <span className="chart-tag">MONTHLY</span>
                </div>
                <div className="chart-legend">
                  <span><i className="legend-rain" /> Rainfall <small>mm</small></span>
                  <span><i className="legend-ndvi" /> NDVI <small>index</small></span>
                </div>
                <div className="chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rainfall} margin={{ top: 12, right: 7, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#609ab3" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#609ab3" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#eaf0e8" strokeDasharray="3 4" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#8a968b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#8a968b" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="rain" name="Rainfall (mm)" stroke="#609ab3" fill="url(#rainFill)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="chart-note">Illustrative rainfall curve. NDVI series is planned for the connected analysis.</p>
              </article>

              <article className="panel chart-panel">
                <div className="chart-heading">
                  <div><h3>Correlation by lag</h3><p>Rainfall anomaly vs. later NDVI anomaly</p></div>
                  <span className="chart-tag">0–{maxLag} MONTHS</span>
                </div>
                <div className="chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lagValues.filter(v => Number(v.lag[0]) <= Number(maxLag))} margin={{ top: 16, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="lagFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#43875d" stopOpacity={0.22} />
                          <stop offset="100%" stopColor="#43875d" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#eaf0e8" strokeDasharray="3 4" vertical={false} />
                      <XAxis dataKey="lag" tick={{ fontSize: 10, fill: "#8a968b" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 0.8]} tick={{ fontSize: 10, fill: "#8a968b" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="correlation" name="Correlation (r)" stroke="#43875d" fill="url(#lagFill)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="chart-note">Candidate lag curve shown for UI testing, not calculated from observations.</p>
              </article>
            </div>
          </div>

          <section className="panel table-panel" id="locations">
            <div className="table-heading">
              <div><h3>Regional explorer</h3><p>Select a region to inspect its preview values.</p></div>
              <span className="chart-tag">DEMO DATA</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>REGION</th><th>COUNTRY / AREA</th><th>PEAK LAG</th><th>CORRELATION</th><th>INFERENCE</th></tr></thead>
                <tbody>
                  {locations.map((item, i) => (
                    <tr key={item.name} onClick={() => setSelected(i)} className={selected === i ? "selected-row" : ""}>
                      <td><span className="region-name"><i style={{ background: mapColors[item.lag] }} />{item.name}</span></td>
                      <td>{item.country}</td>
                      <td><span className="lag-pill">{item.lag} mo</span></td>
                      <td>
                        <strong className="correlation-number">{item.r.toFixed(2)}</strong>
                        <span className="mini-bar"><i style={{ width: `${item.r * 100}%` }} /></span>
                      </td>
                      <td><span className="status-pending"><i /> Not computed</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="bottom-grid" id="datasets">
            <section className="panel bottom-panel">
              <div className="bottom-title"><CloudRain size={19} /><div><h3>Data sources</h3><p>Inputs planned for the research pipeline</p></div></div>
              <div className="dataset"><span className="dataset-icon modis">M</span><span><strong>MODIS vegetation index</strong><small>NDVI · monthly composites</small></span><em>Planned</em></div>
              <div className="dataset"><span className="dataset-icon gpm">G</span><span><strong>GPM IMERG precipitation</strong><small>Rainfall · monthly aggregation</small></span><em>Planned</em></div>
              <div className="dataset"><span className="dataset-icon grace">G</span><span><strong>GRACE / GRACE-FO</strong><small>Optional water storage extension</small></span><em>Optional</em></div>
            </section>
            <section className="panel bottom-panel" id="method">
              <div className="bottom-title"><FlaskConical size={19} /><div><h3>Analysis workflow</h3><p>Planned reproducible processing steps</p></div></div>
              {[
                "Harmonize spatial grids and masks",
                "Remove calendar-month climatology",
                "Calculate correlations at lags 0–6",
                "Test significance and apply FDR",
              ].map((step, i) => <div className="workflow-step" key={step}><span>{String(i + 1).padStart(2, "0")}</span><p>{step}</p><small>Pending</small></div>)}
            </section>
          </div>

          <footer className="footer">
            <span><Leaf size={14} /> Rain-to-Green <i>·</i> Earth observation research</span>
            <span><i className="green-dot" /> Local preview · Reproducible science</span>
          </footer>
        </div>
      </section>

      {notice && <button className="toast" onClick={() => setNotice("")}><CheckCircle2 size={17} />{notice}<X size={14} /></button>}
    </main>
  );
}