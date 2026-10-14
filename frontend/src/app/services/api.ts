const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchDatasets() {
  try {
    const res = await fetch(`${API_BASE_URL}/datasets`);
    if (!res.ok) throw new Error("Failed to fetch datasets");
    return await res.json();
  } catch (error) {
    console.warn("FastAPI server offline or unreachable. Using fallback datasets.");
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
    const res = await fetch(`${API_BASE_URL}/regions`);
    if (!res.ok) throw new Error("Failed to fetch regions");
    return await res.json();
  } catch (error) {
    console.warn("FastAPI server offline or unreachable. Using fallback regions.");
    return {
      regions: [
        { id: "nepal_east", name: "Eastern Nepal", country: "Nepal", default_lag_months: 2, r: 0.68 },
      ],
    };
  }
}