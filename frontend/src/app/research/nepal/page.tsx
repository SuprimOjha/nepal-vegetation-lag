"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Activity, ArrowUpRight, BarChart3, CalendarDays, CloudRain, Download, FlaskConical, Leaf, MapPin, ShieldCheck, X } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ApiStatus from "@/app/components/ApiStatus";
import { fetchDatasets, fetchNepalAnalysis, fetchNasaGranules, type NepalAnalysisResponse, type SourceDataset, type NasaCatalogResponse } from "@/app/services/api";

const NepalTopoMap = dynamic(() => import("@/app/components/NepalTopoMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Loading topographic basemap…</div>,
});

const zones = [
  { name: "Eastern Terai Lowlands", zone: "Terai Belt", apiZone: "terai" },
  { name: "Eastern Mid-Hills", zone: "Hilly Region", apiZone: "midhills" },
  { name: "Kathmandu Valley Basin", zone: "Intermountain Valley", apiZone: "kathmandu" },
  { name: "Annapurna Region", zone: "High Mountain", apiZone: "highmountains" },
  { name: "Western Siwalik Range", zone: "Churia Hills", apiZone: "siwalik" },
  { name: "Far-Western Lowlands", zone: "Terai Belt", apiZone: "terai" },
];

const markerColors = ["#6f9884", "#5d8978", "#779d8b", "#8cae9d", "#658b7c", "#719787"];

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="section-title"><div><h2>{title}</h2><p>{subtitle}</p></div></div>;
}

export default function NepalResearchPage() {
  const [selected, setSelected] = useState(0);
  const [maxLag, setMaxLag] = useState("6");
  const [yearStart, setYearStart] = useState("2003");
  const [yearEnd, setYearEnd] = useState("2024");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [layer, setLayer] = useState("lag");
  const [notice, setNotice] = useState("");
  const [datasets, setDatasets] = useState<SourceDataset[]>([]);
  const [datasetError, setDatasetError] = useState<string | null>(null);
  const [catalogProduct, setCatalogProduct] = useState("MOD13A3");
  const [catalogResult, setCatalogResult] = useState<NasaCatalogResponse | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<NepalAnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const region = zones[selected];

  useEffect(() => {
    let active = true;
    fetchDatasets().then(result => {
      if (active) setDatasets(result.datasets ?? []);
    }).catch(error => {
      if (active) setDatasetError(error instanceof Error ? error.message : "Source catalogue request failed");
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setAnalysisError(null);
    fetchNepalAnalysis(region.apiZone, Number(maxLag), Number(yearStart), Number(yearEnd), controller.signal)
      .then(result => {
        if (!controller.signal.aborted) setAnalysis(result);
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          setAnalysis(null);
          setAnalysisError(error instanceof Error ? error.message : "Analysis request failed");
        }
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [region.apiZone, maxLag, yearStart, yearEnd]);

  const currentAnalysis = analysis?.zone === region.apiZone &&
    analysis.max_lag_months === Number(maxLag) &&
    analysis.year_start === Number(yearStart) &&
    analysis.year_end === Number(yearEnd) ? analysis : null;
  const computed = currentAnalysis?.analysis_status === "computed";
  const series = useMemo(() => {
    const t = currentAnalysis?.time_series;
    if (!t) return [];
    return t.months.map((month, i) => ({
      month,
      rain: t.precipitation_mm[i],
      ndvi: t.ndvi[i],
    }));
  }, [currentAnalysis]);

  async function inspectNasaCatalog() {
    setCatalogLoading(true);
    setCatalogError(null);
    setCatalogResult(null);
    try {
      const result = await fetchNasaGranules(catalogProduct, Number(yearStart), Number(yearEnd), 20);
      setCatalogResult(result);
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : "NASA catalog query failed");
    } finally {
      setCatalogLoading(false);
    }
  }

  function exportSettings() {
    const manifest = {
      export_type: "analysis_request_settings_only",
      note: "This file records requested settings, not scientific results.",
      zone: region.apiZone,
      start_year: Number(yearStart),
      end_year: Number(yearEnd),
      max_lag_months: Number(maxLag),
      selected_map_layer: layer,
      analysis_status: currentAnalysis?.analysis_status ?? "unknown",
      provenance: currentAnalysis?.provenance ?? null,
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "eonpulse-analysis-request.json";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Exported request settings and current status; no invented result values included.");
  }

  return (
    <main className="app">
      <aside className="sidebar">
        <a href="/" className="brand"><span className="brand-icon"><Leaf size={22} /></span><span><strong>Eon<span style={{ color: "#2d7858" }}>Pulse</span></strong><small>NEPAL RESEARCH LAB</small></span></a>
        <div className="workspace"><span className="workspace-icon"><MapPin size={19} /></span><span><strong>Nepal study domain</strong><small>80.05–88.20°E · 26.34–30.45°N</small></span></div>
        <div className="nav-heading">RESEARCH</div>
        <a className="nav-item active" href="#overview"><Activity size={17} /> Overview</a>
        <a className="nav-item" href="#map"><MapPin size={17} /> Topographic map</a>
        <a className="nav-item" href="#correlation"><BarChart3 size={17} /> Analysis results</a>
        <a className="nav-item" href="#datasets"><CloudRain size={17} /> Source datasets</a>
        <a className="nav-item" href="#method"><FlaskConical size={17} /> Methods & definitions</a>
        <div className="sidebar-bottom"><div className="sidebar-note"><ShieldCheck size={18} /><strong>Evidence before conclusions</strong><p>Catalog entries are not processed measurements. Unavailable results stay unavailable.</p></div></div>
      </aside>

      <section className="main">
        <header className="topbar"><div className="breadcrumb">EonPulse <span>/</span> <strong>Nepal research</strong></div><div className="topbar-right"><ApiStatus /></div></header>
        <div className="content" id="overview">
          <div className="hero">
            <div><div className="eyebrow">EARTH SYSTEMS · REPRODUCIBLE RESEARCH</div><h1>Rainfall to <span>vegetation lag.</span></h1><p className="hero-description">Investigate how vegetation responds to precipitation across Nepal. Each result should link to source products, exact analysis settings, uncertainty, and reproducible outputs.</p></div>
            <div className="hero-actions"><button className="btn btn-secondary" onClick={() => setFiltersOpen(!filtersOpen)}><CalendarDays size={16} /> Analysis settings</button><button className="btn btn-primary" onClick={exportSettings}><Download size={16} /> Export request</button></div>
          </div>

          <div className="preview-warning"><div className="warning-icon"><ShieldCheck size={19} /></div><div><strong>Scientific data status: {computed ? "analysis reported as computed" : "no validated results available"}</strong><p>{loading ? "Checking the analysis endpoint…" : analysisError ? `API request failed: ${analysisError}. No fallback values are displayed.` : currentAnalysis?.analysis_reason ?? "API is reachable, but that alone does not establish that NASA granules were downloaded or processed."}</p></div><span className="preview-badge">{computed ? "CHECK PROVENANCE" : "NOT COMPUTED"}</span></div>

          {filtersOpen && <section className="filters"><div className="filter-heading"><strong>Analysis request parameters</strong><button className="icon-btn" onClick={() => setFiltersOpen(false)}><X size={17} /></button></div><div className="filter-grid">
            <label>Start year<select value={yearStart} onChange={e => setYearStart(e.target.value)}>{Array.from({ length: 22 }, (_, i) => 2003 + i).filter(y => y < Number(yearEnd)).map(y => <option key={y}>{y}</option>)}</select></label>
            <label>End year<select value={yearEnd} onChange={e => setYearEnd(e.target.value)}>{Array.from({ length: 23 }, (_, i) => 2003 + i).filter(y => y > Number(yearStart) && y <= new Date().getFullYear()).map(y => <option key={y}>{y}</option>)}</select></label>
            <label>Maximum lag<select value={maxLag} onChange={e => setMaxLag(e.target.value)}>{[0, 1, 2, 3, 4, 5, 6, 9, 12].map(n => <option key={n} value={n}>{n} months</option>)}</select></label>
            <button className="btn btn-primary apply-button" onClick={() => setFiltersOpen(false)}>Apply &amp; request</button>
          </div><p className="chart-note">Changing settings requests new analysis metadata. Settings are not proof of data coverage; the API must return validated outputs before values can be displayed.</p></section>}

          <div className="metrics">
            <article className="metric"><div className="metric-top"><span>Requested period</span><CalendarDays size={18} /></div><strong>{yearStart}–{yearEnd}</strong><small>{Number(yearEnd) - Number(yearStart) + 1} years requested; coverage not verified</small></article>
            <article className="metric"><div className="metric-top"><span>Tested lag window</span><Activity size={18} /></div><strong>0–{maxLag}<em> months</em></strong><small>Requested configuration, not a result</small></article>
            <article className="metric"><div className="metric-top"><span>Study boundary</span><MapPin size={18} /></div><strong>Bounding box</strong><small>80.05–88.20°E · 26.34–30.45°N; not national mask</small></article>
            <article className="metric"><div className="metric-top"><span>Analysis state</span><FlaskConical size={18} /></div><strong className="status-text">{loading ? "Checking" : computed ? "Computed" : "Not run"}</strong><small>{computed ? "Inspect provenance before use" : "No validated measurements available"}</small></article>
          </div>

          <SectionTitle title="Nepal topographic map" subtitle="Terrain basemap and study-region markers. Markers do not represent pixel-level lag measurements." />
          <div className="map-layout" id="map">
            <article className="panel map-panel"><div className="panel-header"><div><span className="live-dot" /> Nepal domain <span className="muted">/ Topographic context</span></div><select value={layer} onChange={e => setLayer(e.target.value)}><option value="lag">Lag layer — unavailable</option><option value="correlation">Correlation layer — unavailable</option></select></div>
              <div className="map-canvas"><div className="map-grid" /><NepalTopoMap locations={zones.map((z, i) => ({ ...z, lag: null, r: null, color: markerColors[i] }))} selected={selected} layer={layer} onSelect={setSelected} /></div>
              <div className="map-legend"><div><strong>REGIONAL MARKERS</strong><span>Locations only</span></div><div className="legend-colors">{markerColors.map(color => <i key={color} style={{ background: color }} />)}</div><div className="legend-labels"><span>Study area markers</span><span>No numeric result encoded</span></div></div>
            </article>
            <aside className="panel detail-panel"><div className="detail-kicker">SELECTED STUDY REGION</div><h3>{region.name}</h3><p className="region-country"><MapPin size={14} /> {region.zone}, Nepal</p>
              <div className="detail-stat"><span>Peak response lag</span><strong style={{ fontSize: 14 }}>Not computed</strong><small>No validated monthly source arrays.</small></div>
              <div className="detail-stat"><span>Pearson correlation (r)</span><strong style={{ fontSize: 14 }}>Not computed</strong><small>No coefficient is inferred or fabricated.</small></div>
              <div className="detail-stat"><span>Significance / uncertainty</span><strong style={{ fontSize: 14 }}>Not available</strong><small>No p-value, confidence interval, or sample count has been calculated.</small></div>
              <div className="research-note"><strong><Activity size={14} /> Interpretation guardrail</strong><p>Correlation does not establish causation. Climate, temperature, snow, land cover, irrigation, and data quality can affect observed patterns.</p></div>
            </aside>
          </div>

          <div id="correlation"><SectionTitle title="Analysis results" subtitle="Charts remain empty until the API returns computed values and provenance." />
            <div className="charts-grid">
              <article className="panel chart-panel"><div className="chart-heading"><div><h3>Monthly precipitation &amp; NDVI</h3><p>Source-derived paired time series</p></div><span className="chart-tag">{series.length ? "API DATA" : "NO DATA"}</span></div><div className="chart-legend"><span><i className="legend-rain" /> Precipitation <small>mm as documented by product</small></span><span><i className="legend-ndvi" /> NDVI <small>scaled index</small></span></div>
                <div className="chart">{series.length ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={series}><CartesianGrid stroke="#eaf0e8" strokeDasharray="3 4" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 9 }} /><YAxis yAxisId="rain" tick={{ fontSize: 9 }} /><YAxis yAxisId="ndvi" orientation="right" domain={[-1, 1]} tick={{ fontSize: 9 }} /><Tooltip /><Area yAxisId="rain" dataKey="rain" name="Precipitation" stroke="#1b4d3e" fillOpacity={0.12} /><Area yAxisId="ndvi" dataKey="ndvi" name="NDVI" stroke="#609ab3" fillOpacity={0.08} /></AreaChart></ResponsiveContainer> : <div className="empty-chart"><CloudRain size={24} /><strong>No measured time series</strong><span>The API has not returned validated monthly precipitation and NDVI arrays.</span></div>}</div><p className="chart-note">Missing values must remain missing, not be replaced by zero. Inspect the source product, units, quality flags, and coverage before interpreting a curve.</p></article>
              <article className="panel chart-panel"><div className="chart-heading"><div><h3>Correlation by lag</h3><p>{region.name} · paired anomalies</p></div><span className="chart-tag">{computed ? "COMPUTED" : "NOT COMPUTED"}</span></div><div className="chart">{computed && currentAnalysis?.lag_analysis.length ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={currentAnalysis.lag_analysis}><CartesianGrid stroke="#eaf0e8" strokeDasharray="3 4" vertical={false} /><XAxis dataKey="lag" tick={{ fontSize: 10 }} /><YAxis domain={[-1, 1]} tick={{ fontSize: 10 }} /><Tooltip /><Area type="monotone" dataKey="correlation" name="Pearson r" stroke="#2d7858" fillOpacity={0.12} /></AreaChart></ResponsiveContainer> : <div className="empty-chart"><BarChart3 size={24} /><strong>No correlation results</strong><span>{analysisError ?? currentAnalysis?.analysis_reason ?? "No coefficients are shown until a validated analysis is available."}</span></div>}</div><p className="chart-note">Every lag should include r, paired sample size, uncertainty, p-value, and the multiple-testing policy. The strongest observed lag is not proof of causation.</p></article>
            </div>
          </div>

          <section className="panel table-panel" id="locations"><div className="table-heading"><div><h3>Study regions</h3><p>Choose a region to request its analysis. No regional metrics are assumed.</p></div><span className="chart-tag">GEOGRAPHY ONLY</span></div><div className="table-scroll"><table><thead><tr><th>STUDY REGION</th><th>PHYSIOGRAPHIC DESCRIPTION</th><th>PEAK LAG</th><th>PEARSON r</th><th>STATUS</th></tr></thead><tbody>{zones.map((item, i) => <tr key={item.name} onClick={() => setSelected(i)} className={selected === i ? "selected-row" : ""}><td><span className="region-name"><i style={{ background: markerColors[i] }} />{item.name}</span></td><td>{item.zone}</td><td>Not computed</td><td>Not computed</td><td><span className="status-pending"><i /> Awaiting validated data</span></td></tr>)}</tbody></table></div></section>

          <div className="bottom-grid" id="datasets">
            <section className="panel bottom-panel"><div className="bottom-title"><CloudRain size={19} /><div><h3>Source dataset catalogue</h3><p>Published product references and actual availability status</p></div></div>
              {datasetError ? <p className="chart-note">Could not retrieve source catalogue: {datasetError}</p> : datasets.length ? datasets.map(d => <div className="dataset" key={d.short_name}><span className="dataset-icon modis">{d.variable.slice(0, 1).toUpperCase()}</span><span><strong>{d.title}</strong><small>{d.provider} · {d.role} · Product ID: {d.short_name}</small></span><em>{d.status.replaceAll("_", " ")}</em><a href={d.landing_page} target="_blank" rel="noreferrer">Product docs ↗</a><a href={d.catalog} target="_blank" rel="noreferrer">NASA search ↗</a></div>) : <p className="chart-note">Loading product catalogue…</p>}
              <p className="chart-note">A source landing page verifies what a dataset is, not that EonPulse downloaded it. Product version, exact granule IDs, temporal coverage, quality processing, and file checksums must be published for a real result.</p>
              <div className="catalog-inspector">
                <div className="filter-heading"><strong>Live NASA granule metadata lookup</strong><span className="chart-tag">METADATA ONLY</span></div>
                <div className="catalog-controls">
                  <label>NASA product
                    <select value={catalogProduct} onChange={e => setCatalogProduct(e.target.value)}>
                      <option value="MOD13A3">MOD13A3 · MODIS NDVI</option>
                      <option value="GPM_3IMERGM">GPM_3IMERGM · monthly precipitation</option>
                      <option value="SRTMGL1">SRTMGL1 · terrain reference</option>
                    </select>
                  </label>
                  <button className="btn btn-primary" onClick={inspectNasaCatalog} disabled={catalogLoading}>{catalogLoading ? "Querying NASA…" : "Search NASA CMR"}</button>
                </div>
                <p className="chart-note">Queries the NASA Common Metadata Repository for the selected years and study bounding box. Returned records are not downloads, and the returned count is a limited sample—not the total number of available granules.</p>
                {catalogError && <p className="catalog-error" role="alert">{catalogError}. The query failed; no granule count is inferred.</p>}
                {catalogResult && <div className="catalog-results">
                  <div className="catalog-summary"><strong>{catalogResult.returned_count} records returned</strong><span>{catalogResult.product} · {catalogResult.temporal_filter.start} to {catalogResult.temporal_filter.end}</span></div>
                  <p className="chart-note">{catalogResult.interpretation} Query time: {catalogResult.queried_at_utc}.</p>
                  {catalogResult.granules.length === 0 ? <p className="chart-note">NASA returned no records for this query. Try another period or product; this does not prove no data exist outside the filter or limit.</p> : catalogResult.granules.map((g, i) => <div className="granule-row" key={g.granule_id ?? g.producer_granule_id ?? i}>
                    <strong>{g.granule_id ?? g.producer_granule_id ?? "Granule ID not supplied"}</strong>
                    <span>{g.beginning_datetime ?? "Start time unavailable"} — {g.ending_datetime ?? "End time unavailable"}</span>
                    {g.links.slice(0, 3).map((url, j) => <a key={url + j} href={url} target="_blank" rel="noreferrer">NASA link {j + 1} ↗</a>)}
                  </div>)}
                </div>}
              </div>
            </section>
            <section className="panel bottom-panel" id="method"><div className="bottom-title"><FlaskConical size={19} /><div><h3>Reproducible processing pipeline</h3><p>Required stages; not falsely marked complete</p></div></div>
              {["Acquire NASA granules; record product versions, granule IDs, dates, and checksums","Apply product-specific quality flags and scale factors; preserve missing observations","Reproject grids and document spatial and temporal resampling choices","Mask with a versioned Nepal boundary polygon; document pixel inclusion rules","Remove month-of-year climatology and document any trend-removal method","Compute paired anomalies for lags 0 through the requested maximum","Report sample count, Pearson r, confidence intervals, p-values, and multiple-test correction","Export raster/table, parameters, code revision, timestamps, and a run manifest"].map((step, i) => <div className="workflow-step" key={step}><span>{String(i + 1).padStart(2, "0")}</span><p>{step}</p><small style={{ color: "#8a7448" }}>Not run</small></div>)}
            </section>
          </div>

          <section className="panel bottom-panel" id="data-dictionary" style={{ marginTop: 18 }}><div className="bottom-title"><ShieldCheck size={19} /><div><h3>Data dictionary: how to verify every value</h3><p>Definitions, units, limitations, and independent checks</p></div></div>
            <div className="workflow-step"><span>01</span><p><strong>Precipitation (mm/month)</strong> — monthly rainfall accumulation from the named GPM product after its documented unit conversion. Verify product version, dates, grid, and quality flags.</p></div>
            <div className="workflow-step"><span>02</span><p><strong>NDVI (unitless)</strong> — MODIS vegetation index with the product scale factor, fill values, and quality flags handled. NDVI is not biomass or a direct measurement of plant health.</p></div>
            <div className="workflow-step"><span>03</span><p><strong>Lag (months)</strong> — lag k compares rainfall anomaly at month t with NDVI anomaly at month t+k. State this convention consistently; a peak lag is an association, not causation.</p></div>
            <div className="workflow-step"><span>04</span><p><strong>Pearson r</strong> — linear association of paired values, bounded from −1 to +1. Report valid sample count, uncertainty, missing-data handling, and temporal autocorrelation considerations.</p></div>
            <div className="workflow-step"><span>05</span><p><strong>p-value / significance</strong> — requires a documented test, assumptions about effective sample size, and a multiple-comparison correction when many pixels or lags are tested. No significance claim is made before calculation.</p></div>
            <div className="workflow-step"><span>06</span><p><strong>Spatial boundary</strong> — the current coordinate box includes areas outside Nepal. Country-only summaries require a versioned national polygon and explicit pixel masking rules.</p></div>
            <div className="workflow-step"><span>07</span><p><strong>Run manifest</strong> — a verifiable result needs input IDs and checksums, product versions, coverage, processing parameters, software/code revision, output checksum, and UTC timestamp.</p></div>
            <p className="chart-note">NASA product pages explain the source data; they do not independently certify an EonPulse calculation. Independent reproduction requires the exact input files, code, settings, and output artifacts.</p>
          </section>

          <footer className="footer"><span><Leaf size={14} /> EonPulse Nepal · Earth Systems Research</span><span><ShieldCheck size={14} /> Transparent status · Reproducibility first</span></footer>
        </div>
        {notice && <button className="toast" onClick={() => setNotice("")}>{notice}<X size={14} /></button>}
      </section>
    </main>
  );
}
