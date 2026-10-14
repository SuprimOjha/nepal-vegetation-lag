"use client";

import Link from "next/link";
import { Leaf, ArrowRight, Globe2, Activity, ShieldCheck, ArrowLeft } from "lucide-react";

export default function OverviewPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "sans-serif" }}>
      {/* Navigation Bar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 4rem", borderBottom: "1px solid #e2e8f0", background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
          <span style={{ background: "#1b4d3e", color: "#fff", padding: "8px", borderRadius: "8px", display: "flex" }}><Leaf size={22} /></span>
          <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Eon<span style={{ color: "#2d7858" }}>Pulse</span> <span style={{ fontSize: "0.85rem", fontWeight: 600, background: "#e2efd9", color: "#18543e", padding: "2px 6px", borderRadius: "4px", marginLeft: "4px" }}>NEPAL</span></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/contents/overview" style={{ textDecoration: "none", color: "#1b4d3e", fontWeight: 700, fontSize: "0.95rem" }}>About Study</Link>
          <Link href="/contents/topography" style={{ textDecoration: "none", color: "#334155", fontWeight: 500, fontSize: "0.95rem" }}>Physiography</Link>
          <Link href="/contents/methodology" style={{ textDecoration: "none", color: "#334155", fontWeight 500, fontSize: "0.95rem" }}>Methodology</Link>
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
          RESEARCH OVERVIEW
        </div>

        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.5rem" }}>
          About the EonPulse Nepal Study
        </h1>

        <div style={{ background: "#fff", padding: "3rem", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1b4d3e", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Globe2 size={22} /> Research Objective
          </h2>
          <p style={{ color: "#475569", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "1.5rem" }}>