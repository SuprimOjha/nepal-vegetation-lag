"use client";

import Link from "next/link";
import { Leaf, ArrowRight, Activity, CloudRain, MapPin, BarChart3, Layers3, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "sans-serif", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      
      {/* Top Navigation Bar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 4rem", borderBottom: "1px solid #e2e8f0", background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
          <span style={{ background: "#2d7858", color: "#fff", padding: "8px", borderRadius: "8px", display: "flex" }}><Leaf size={22} /></span>
          <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>rain<span style={{ color: "#2d7858" }}>to</span>green</span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/research/nepal" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>Nepal Workspace</Link>
          <Link href="/research/terai-lowlands" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>Terai</Link>
          <Link href="/research/gangetic-plain" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>Gangetic Plain</Link>
          <Link href="/research/bangladesh-delta" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>Bangladesh</Link>
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
          SOUTH ASIA VEGETATION LAG MAP · CLASS 12 RESEARCH PLATFORM
        </div>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "1.5rem", color: "#0f172a" }}>
          Mapping vegetation response to <span style={{ color: "#2d7858" }}>monsoon rainfall.</span>
        </h1>
        <p style={{ fontSize: "1.15rem", color: "#64748b", lineHeight: 1.6, marginBottom: "2.5rem" }}>
          An interactive scientific web application exploring how ecosystems across South Asia—starting with Nepal—respond to rainfall anomalies over two decades of satellite observations.
        </p>
        
        {/* Primary CTA & Quick Region Select */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          <Link href="/research/nepal" style={{ background: "#2d7858", color: "#fff", padding: "0.8rem 1.75rem", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem", boxShadow: "0 4px 12px rgba(45, 120, 88, 0.2)" }}>
            Explore Nepal Workspace ↗
          </Link>
          <Link href="/research/gangetic-plain" style={{ background: "#fff", color: "#334155", border: "1px solid #cbd5e1", padding: "0.8rem 1.75rem", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "1rem" }}>
            Indo-Gangetic Plain ↗
          </Link>
        </div>
      </section>

      {/* Feature Highlight Cards */}
      <section style={{ maxWidth: "1100px", margin: "0 auto 4rem auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", padding: "0 2rem" }}>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <CloudRain size={28} style={{ color: "#2d7858", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>NASA Satellite Data</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>Integrated with MODIS vegetation indices (MOD13A3) and GPM IMERG precipitation grids.</p>
        </div>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <Activity size={28} style={{ color: "#2d7858", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Lag Correlation Analysis</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>Calculate 0 to 6-month delay responses to measure how long regional ecosystems take to green up after rainfall.</p>
        </div>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <MapPin size={28} style={{ color: "#2d7858", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Regional Slugs</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}>Seamlessly switch between study areas including Nepal, Terai, Western Ghats, and the Bangladesh Delta.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2rem 4rem", borderTop: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: "0.9rem" }}>
        <span>Rain-to-Green Research Workspace · Built with Next.js, FastAPI & NASA Earthdata</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="/research/nepal" style={{ color: "#64748b", textDecoration: "none" }}>Nepal</Link>
          <Link href="/research/terai-lowlands" style={{ color: "#64748b", textDecoration: "none" }}>Terai</Link>
          <Link href="/research/bangladesh-delta" style={{ color: "#64748b", textDecoration: "none" }}>Bangladesh</Link>
        </div>
      </footer>

    </main>
  );
}