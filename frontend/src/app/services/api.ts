const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchDatasets() {
  try {
    const res = await fetch(`${API_BASE_URL}/datasets`);
    if (!res.ok) throw new Error("Failed to fetch datasets");
    return await res.json();
  } catch (error) {
    console.error("Backend error:", error);
    return null;
  }
}

export async function fetchRegions() {
  try {
    const res = await fetch(`${API_BASE_URL}/regions`);
    if (!res.ok) throw new Error("Failed to fetch regions");
    return await res.json();
  } catch (error) {
    console.error("Backend error:", error);
    return null;
  }
}