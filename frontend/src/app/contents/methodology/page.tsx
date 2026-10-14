"use client";

import Link from "next/link";
import { Leaf, ArrowRight, ArrowLeft } from "lucide-react";

export default function MethodologyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 4rem", borderBottom: "1px solid #e2e8f0", background: "#fff" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
          <span style={{ background: "#1b4d3e", color: "#fff", padding: "8px", borderRadius: "8px", display: "flex" }}><Leaf size={22} /></span>
          <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Eon<span style={{ color: "#2d7858" }}>Pulse</span> NEPAL</span>
        </Link>
        <Link href="/research/nepal" style={{ background: "#1b4d3e", color: "#fff", padding: "0.6rem 1.25rem", borderRadius: "6px", textDecoration: "none", fontWeight: 600 }}>
          Launch Laboratory <ArrowRight size={16} />
        </Link>
      </nav>

      <div style={{ maxWidth: "900px", margin: "4rem auto", padding: "0 2rem" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", textDecoration: "none", marginBottom: "2rem" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>Methodology</h1>
        <div style={{ background: "#fff", padding: "3rem", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <p style={{ color: "#475569", lineHeight: 1.8, fontSize: "1.05rem" }}>
            The workflow isolates anomaly time series and computes cross-correlations across lag intervals from 0 to 6 months to evaluate environmental response times.
          </p>
        </div>
      </div>
    </main>
  );
}