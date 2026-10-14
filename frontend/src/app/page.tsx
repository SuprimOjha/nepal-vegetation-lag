"use client";

import Link from "next/link";
import { Leaf, ArrowRight, Activity, CloudRain, MapPin, Layers3, ShieldCheck, FlaskConical } from "lucide-react";

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
          <Link href="/research/nepal#map" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>Lag Explorer</Link>
          <Link href="/research/nepal#correlation" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>Dynamics</Link>
          <Link href="/research/nepal#datasets" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>NASA Datasets</Link>
        </div>

        {/* Action Button */}
        <div>
          <Link href="/research/nepal" style={{ background: "#1b4d3e", color: "#fff", padding: "0.6rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.95rem" }}>
            Launch Nepal Lab <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: "900px", margin: "5rem auto 3rem auto", textAlign: "center", padding: "0 2rem" }}>
        <div style={{ display: "inline-block", background: "#e2efd9", color: "#18543e", padding: "4px 14px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.5rem" }}>
          NATIONAL VEGETATION RESPONSE LAB · NEPAL BOUNDING BOX (80.0°E–88.3°E, 26.3°N–30.5°N)
        </div>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "1.5rem", color: "#0f172a" }}>
          Quantifying ecosystem lag across <span style={{ color: "#1b4d3e" }}>Nepal's topography.</span>
        </h1>
        <p style={{ fontSize: "1.15rem", color: "#64748b", lineHeight: 1.6, marginBottom: "2.5rem" }}>
          An advanced geospatial platform analyzing how multi-decadal GPM precipitation cycles trigger vegetation responses (NDVI) across Nepal’s diverse physiographic zones.
        </p>
        
        {/* Primary CTA */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          <Link href="/research/nepal" style={{ background: "#1b4d3e", color: "#fff", padding: "0.8rem 1.75rem", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", boxShadow: "0 4px 12px rgba(27, 77, 62, 0.2)" }}>
            Open Nepal Research Workspace ↗
          </Link>
        </div>
      </section>

      {/* Feature Highlight Cards */}
      <section style={{ maxWidth: "1100px", margin: "0 auto 4rem auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", padding: "0 2rem" }}>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <CloudRain size={28} style={{ color: "#1b4d3e", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>GPM IMERG Precipitation</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>High-resolution monthly rainfall gridded arrays mapped specifically onto Nepal's river basins.</p>
        </div>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <Activity size={28} style={{ color: "#1b4d3e", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>MOD13A3 Vegetation Lag</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>Extracting 0 to 6-month temporal shifts showing soil and canopy reaction times to monsoon bursts.</p>
        </div>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <MapPin size={28} style={{ color: "#1b4d3e", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Nepal Focus Bounding Box</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>Precision subsetting covering Terai lowlands, mid-hills, and high Himalayan sub-catchments.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2rem 4rem", borderTop: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: "0.9rem" }}>
        <span>EonPulse Nepal · Earth Systems Research Laboratory</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="/research/nepal" style={{ color: "#64748b", textDecoration: "none" }}>Interactive Workspace</Link>
          <Link href="/research/nepal#datasets" style={{ color: "#64748b", textDecoration: "none" }}>NASA Data</Link>
        </div>
      </footer>

    </main>
  );
}