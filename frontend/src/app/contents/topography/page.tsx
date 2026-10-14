"use client";

import Link from "next/link";
import { Leaf, ArrowRight, Compass, MapPin, ArrowLeft } from "lucide-react";

export default function TopographyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "sans-serif" }}>
      {/* Navigation Bar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 4rem", borderBottom: "1px solid #e2e8f0", background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
          <span style={{ background: "#1b4d3e", color: "#fff", padding: "8px", borderRadius: "8px", display: "flex" }}><Leaf size={22} /></span>
          <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Eon<span style={{ color: "#2d7858" }}>Pulse</span> <span style={{ fontSize: "0.85rem", fontWeight: 600, background: "#e2efd9", color: "#18543e", padding: "2px 6px", borderRadius: "4px", marginLeft: "4px" }}>NEPAL</span></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/contents/overview" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>About Study</Link>
          <Link href="/contents/topography" style={{ textDecoration: "none", color: "#1b4d3e", fontWeight: 700, fontSize: "0.95rem" }}>Physiography</Link>
          <Link href="/contents/methodology" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>Methodology</Link>
        </div>
        <Link href="/research/nepal" style={{ background: "#1b4d3e", color: "#fff", padding: "0.6rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.95rem" }}>
          Launch Laboratory <ArrowRight size={16} />
        </Link>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: "900px", margin: "4rem auto", padding: "0 2rem" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", textDecoration: "none", fontSize: "0.9rem", marginBottom: "2rem" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ background: "#e2efd9", color: "#18543e", padding: "4px 14px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600, display: "inline-block", marginBottom: "1rem" }}>
          GEOGRAPHIC PROFILE
        </div>

        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>
          Nepal's Physiographic Zones
        </h1>

        <div style={{ background: "#fff", padding: "3rem", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#475569", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "2rem" }}>
            Nepal exhibits an extraordinary altitudinal gradient, rising from roughly 60 meters above sea level in the southern plains to 8,848 meters at the summit of Mount Everest within a distance of under 200 kilometers. This extreme variation subdivides the region into distinct physiographic belts:
          </p>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div style={{ padding: "1.5rem", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1b4d3e", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={18} /> 1. The Terai Plains (&lt; 300m)
              </h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Characterized by alluvial soils, intensive agriculture, and sub-tropical forest ecosystems. Response lags here are typically short (0 to 1 month) due to rapid groundwater recharge and warm temperatures.
              </p>
            </div>

            <div style={{ padding: "1.5rem", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1b4d3e", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={18} /> 2. Siwalik & Middle Hills (300m – 3,000m)
              </h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Comprising terraced agriculture, chir pine, and broadleaf deciduous forests. Complex slope aspects and soil storage capacities yield a moderate response lag of 1 to 2 months.
              </p>
            </div>

            <div style={{ padding: "1.5rem", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1b4d3e", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={18} /> 3. High Mountains & Himalayas (&gt; 3,000m)
              </h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Dominated by alpine meadows, coniferous forests, and snowfields. Growth is thermally limited, causing delayed responses (2+ months) where snowmelt runoff dictates soil moisture availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}