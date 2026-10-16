const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");
const API_BASE_URL = `${API_ORIGIN}/api`;

export type LagCorrelation = {
  lag: string;
  correlation: number;
};

export type NepalAnalysisResponse = {
  status: "success";
  domain: string;
  zone: string;
  max_lag_months: number;
  lag_analysis: LagCorrelation[];
};

function isNepalAnalysisResponse(
  data: unknown,
  zone: string,
  maxLag: number,
): data is NepalAnalysisResponse {
  if (typeof data !== "object" || data === null) return false;
  const result = data as Record<string, unknown>;
  return (
    result.status === "success" &&
    typeof result.domain === "string" &&
    result.zone === zone &&
    result.max_lag_months === maxLag &&
    Array.isArray(result.lag_analysis) &&
    result.lag_analysis.length === maxLag + 1 &&
    result.lag_analysis.every(
      (point: unknown) =>
        typeof point === "object" &&
        point !== null &&
        "lag" in point &&
        typeof point.lag === "string" &&
        "correlation" in point &&
        typeof point.correlation === "number" &&
        Number.isFinite(point.correlation),
    )
  );
}

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

export async function fetchNepalAnalysis(
  zone: string,
  maxLag: number,
  signal?: AbortSignal,
): Promise<NepalAnalysisResponse> {
  const query = new URLSearchParams({
    zone,
    max_lag: String(maxLag),
  });
  const res = await fetch(`${API_BASE_URL}/analysis/nepal?${query}`, {
    cache: "no-store",
    signal,
  });
  if (!res.ok) {
    throw new Error(`Analysis request failed (HTTP ${res.status})`);
  }

  const data: unknown = await res.json();
  if (!isNepalAnalysisResponse(data, zone, maxLag)) {
    throw new Error("Analysis response did not match the expected data contract");
  }
  return data;
}