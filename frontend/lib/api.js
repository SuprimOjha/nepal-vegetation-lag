// lib/api.js

const getApiBaseUrl = () => {
  // Pulls your live Render backend URL from Vercel environment variables safely
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export async function fetchDatasets() {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/datasets`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function fetchRegions() {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/regions`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function fetchNepalAnalysis(zone = "all", maxLag = 6) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/analysis/nepal?zone=${zone}&max_lag=${maxLag}`);
  if (!res.ok) {
    throw new Error(`Analysis request failed (HTTP ${res.status})`);
  }
  return res.json();
}