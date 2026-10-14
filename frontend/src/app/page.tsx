"use client";

import Link from "next/link";
import { Leaf, ArrowRight, Activity, CloudRain, MapPin, Layers3, ShieldCheck, FlaskConical, BarChart3, Globe2, Compass } from "lucide-react";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "sans-serif", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      
      {/* Top Professional Navigation */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 4rem", borderBottom: "1px solid #e2e8f0", background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
          <span style={{ background: "#1b4d3e", color: "#fff", padding: "8px", borderRadius: "8px", display: "flex" }}><Leaf size={22} /></span>
          <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Eon<span style={{ color: "#2d7858" }}>Pulse</span> <span style={{ fontSize: "0.85rem", fontWeight: 600, background: "#e2efd9", color: "#18543e", padding: "2px 6px", borderRadius: "4px", marginLeft: "4px" }}>NEPAL</span></span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/research/nepal" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>Workspace</Link>
          <a href="contents/overview" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>About Study</a>
          <a href="contents/topography" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>Physiography</a>
          <a href="contents/methodology" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>Methodology</a>
        </div>

        {/* Action Button */}
        <div>
          <Link href="/research/nepal" style={{ background: "#1b4d3e", color: "#fff", padding: "0.6rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.95rem" }}>
            Launch Laboratory <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: "1000px", margin: "5rem auto 3rem auto", textAlign: "center", padding: "0 2rem" }}>
        <div style={{ display: "inline-block", background: "#e2efd9", color: "#18543e", padding: "4px 14px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.5rem" }}>
          NATIONAL ECOSYSTEM RESPONSE LAB · NEPAL BOUNDING BOX (80.0°E–88.3°E, 26.3°N–30.5°N)
        </div>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "1.5rem", color: "#0f172a" }}>
          Quantifying ecosystem lag across <span style={{ color: "#1b4d3e" }}>Nepal's topography.</span>
        </h1>
        <p style={{ fontSize: "1.15rem", color: "#64748b", lineHeight: 1.6, marginBottom: "2.5rem" }}>
          An advanced geospatial research platform analyzing how precipitation cycles trigger vegetation responses and canopy green-up across Nepal’s complex physiographic zones over two decades.
        </p>
        
        {/* Primary CTA */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          <Link href="/research/nepal" style={{ background: "#1b4d3e", color: "#fff", padding: "0.8rem 1.75rem", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", boxShadow: "0 4px 12px rgba(27, 77, 62, 0.2)" }}>
            Open Nepal Research Workspace ↗
          </Link>
        </div>
      </section>

      {/* Expanded Content: Project Overview */}
      <section id="overview" style={{ maxWidth: "1100px", margin: "0 auto 4rem auto", padding: "0 2rem" }}>
        <div style={{ background: "#fff", padding: "3rem", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "#1b4d3e" }}>
            <Globe2 size={24} />
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Understanding Vegetation Lag Dynamics</h2>
          </div>
          <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: "1.5rem" }}>
            Ecosystems do not respond instantaneously to rainfall events. Soil moisture retention, root depth, microclimate variations, and vegetation type introduce a time delay—known as <strong>lag response</strong>—between peak monsoonal precipitation and maximum canopy productivity.
          </p>
          <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "1.05rem" }}>
            EonPulse Nepal processes multi-year satellite grids and high-resolution precipitation records to isolate these temporal shifts, offering researchers a quantitative look at regional environmental resilience and hydrological feedback loops.
          </p>
        </div>
      </section>

      {/* Feature Highlight Cards */}
      <section style={{ maxWidth: "1100px", margin: "0 auto 4rem auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", padding: "0 2rem" }}>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <CloudRain size={28} style={{ color: "#1b4d3e", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Precipitation Grids</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>High-resolution monthly rainfall raster arrays mapped specifically onto major river basins and sub-catchments across Nepal.</p>
        </div>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <Activity size={28} style={{ color: "#1b4d3e", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Vegetation Indices (NDVI)</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>Extracting 0 to 6-month temporal shifts showing soil moisture absorption and canopy reaction times following monsoon bursts.</p>
        </div>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <MapPin size={28} style={{ color: "#1b4d3e", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Topographic Zonation</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>Precision subsetting covering the southern Terai lowlands, mid-hill agricultural terraces, and high-altitude alpine zones.</p>
        </div>
      </section>

      {/* Expanded Content: Physiography & Research Scope */}
      <section id="topography" style={{ maxWidth: "1100px", margin: "0 auto 5rem auto", padding: "0 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div style={{ background: "#fff", padding: "2.5rem", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <Compass size={28} style={{ color: "#1b4d3e", marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>Physiographic Diversity</h3>
            <p style={{ color: "#64748b", lineHeight: 1.6, marginBottom: "1rem" }}>
              Nepal exhibits extreme altitudinal variance within a narrow horizontal span—from 70 meters in the Gangetic plains to 8,848 meters at Mt. Everest. 
            </p>
            <p style={{ color: "#64748b", lineHeight: 1.6 }}>
              This steep gradient creates distinct climatic zones where response lags vary drastically between dense broadleaf forests, agricultural valleys, and snow-fed river basins.
            </p>
          </div>
          <div style={{ background: "#fff", padding: "2.5rem", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <FlaskConical size={28} style={{ color: "#1b4d3e", marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>Analytical Workflow</h3>
            <ul style={{ color: "#64748b", lineHeight: 1.8, paddingLeft: "1.2rem", margin: 0 }}>
              <li>Spatial subsetting to Nepal’s exact bounding box.</li>
              <li>De-trending seasonal climatology from time series.</li>
              <li>Lagged cross-correlation modeling ($r$ values).</li>
              <li>Statistical significance and anomaly trend evaluation.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2rem 4rem", borderTop: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: "0.9rem" }}>
        <span>EonPulse Nepal · Earth Systems Research Laboratory</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="/research/nepal" style={{ color: "#64748b", textDecoration: "none" }}>Interactive Workspace</Link>
          <a href="#overview" style={{ color: "#64748b", textDecoration: "none" }}>About Study</a>
        </div>
      </footer>

    </main>
  );
}