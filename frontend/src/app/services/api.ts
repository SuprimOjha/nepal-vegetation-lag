const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchDatasets() {
  try {
    const res = await fetch(`${API_BASE_URL}/datasets`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Detailed fetchDatasets error:", error);
    return {
      datasets: [
        { short_name: "MOD13A3", name: "MODIS Vegetation Indices", format: "HDF4" },
        { short_name: "GPM_3IMERGM", name: "GPM IMERG Precipitation", format: "NetCDF4" },
      ],
    };
  }
}

export async function fetchRegions() {
  try {
    const res = await fetch(`${API_BASE_URL}/regions`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Detailed fetchRegions error:", error);
    return {
      regions: [
        { id: "nepal_east", name: "Eastern Nepal", country: "Nepal", default_lag_months: 2, r: 0.68 },
        { id: "terai", name: "Terai Lowlands", country: "Nepal", default_lag_months: 1, r: 0.74 },
      ],
    };
  }
}

export async function fetchNepalAnalysis(maxLag: number = 6) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${API_BASE_URL}/api/analysis/nepal?max_lag=${maxLag}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch Nepal analysis");
    return await res.json();
  } catch (error) {
    console.warn("FastAPI unreachable for analysis. Using fallback calculation.");
    return null;
  }
}