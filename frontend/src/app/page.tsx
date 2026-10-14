"use client";

import Link from "next/link";
import { Leaf, ArrowRight, Activity, CloudRain, MapPin, ShieldCheck, FlaskConical, Layers3 } from "lucide-react";

export default function LandingPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "sans-serif", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      
      {/* Top Navigation Bar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 4rem", borderBottom: "1px solid #e2e8f0", background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
          <span style={{ background: "#2d7858", color: "#fff", padding: "8px", borderRadius: "8px", display: "flex" }}><Leaf size={22} /></span>
          <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>rain<span style={{ color: "#2d7858" }}>to</span>green</span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/research/nepal" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>
            Overview
          </Link>
          <Link href="/research/nepal#map" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>
            Lag Explorer
          </Link>
          <Link href="/research/nepal#correlation" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>
            Correlation
          </Link>
          <Link href="/research/nepal#datasets" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>
            Data Sources
          </Link>
        </div>

        {/* Action Button */}
        <div>
          <Link href="/research/nepal" style={{ background: "#2d7858", color: "#fff", padding: "0.6rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.95rem" }}>
            Launch Workspace <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: "900px", margin: "5rem auto 3rem auto", textAlign: "center", padding: "0 2rem" }}>
        <div style={{ display: "inline-block", background: "#e2efd9", color: "#18543e", padding: "4px 14px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.5rem" }}>
          SOUTH ASIA VEGETATION LAG MAP · CLASS 12 RESEARCH PROJECT
        </div>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "1.5rem", color: "#0f172a" }}>
          Investigating how ecosystems respond to <span style={{ color: "#2d7858" }}>rainfall.</span>
        </h1>
        <p style={{ fontSize: "1.15rem", color: "#64748b", lineHeight: 1.6, marginBottom: "2.5rem" }}>
          A scientific web application exploring rainfall patterns, vegetation health, drought anomalies, and rainfall-to-vegetation response lag across South Asia, starting with Nepal.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Link href="/research/nepal" style={{ background: "#2d7858", color: "#fff", padding: "0.8rem 1.75rem", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", boxShadow: "0 4px 12px rgba(45, 120, 88, 0.2)" }}>
            Explore Nepal Workspace
          </Link>
          <a href="#features" style={{ background: "#fff", color: "#334155", border: "1px solid #cbd5e1", padding: "0.8rem 1.75rem", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem" }}>
            Learn Methodology
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ maxWidth: "1100px", margin: "0 auto 5rem auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", padding: "0 2rem" }}>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <CloudRain size={28} style={{ color: "#2d7858", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Genuine Earth Observations</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>Using NASA MODIS vegetation indices (MOD13A3) and GPM IMERG precipitation datasets for rigorous analysis.</p>
        </div>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <Activity size={28} style={{ color: "#2d7858", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Lag Correlation Analysis</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>Calculate lagged correlations from 0 to 6 months to determine how long regional vegetation takes to respond to monsoon rains.</p>
        </div>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <MapPin size={28} style={{ color: "#2d7858", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Nepal & South Asia Focus</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>Targeted geographic bounding boxes centered on Nepal's diverse topography, expandable across the Indo-Gangetic plain.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2rem 4rem", borderTop: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: "0.9rem" }}>
        <span>Rain-to-Green Research Workspace · Built with Next.js, FastAPI, and NASA Earthdata</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="/research/nepal" style={{ color: "#64748b", textDecoration: "none" }}>Research Workspace</Link>
          <Link href="/research/nepal#datasets" style={{ color: "#64748b", textDecoration: "none" }}>Datasets</Link>
        </div>
      </footer>
    </main>
  );
}