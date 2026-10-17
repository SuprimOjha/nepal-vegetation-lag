const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");
const API_BASE_URL = `${API_ORIGIN}/api`;

export type LagCorrelation = {
  lag: string;
  correlation: number;
  n?: number;
  p_value?: number | null;
  ci_lower?: number | null;
  ci_upper?: number | null;
};

export type SourceDataset = {
  short_name: string;
  title: string;
  variable: string;
  provider: string;
  landing_page: string;
  catalog: string;
  status: string;
  role: string;
};

export type NasaCatalogGranule = {
  granule_id: string | null;
  title: string;
  beginning_datetime: string | null;
  ending_datetime: string | null;
  producer_granule_id: string | null;
  links: string[];
};

export type NasaCatalogResponse = {
  status: "catalog_metadata";
  is_download: false;
  is_analysis: false;
  product: string;
  temporal_filter: { start: string; end: string };
  spatial_filter: { west: number; south: number; east: number; north: number };
  limit: number;
  returned_count: number;
  returned_count_is_total: false;
  granules: NasaCatalogGranule[];
  interpretation: string;
  queried_at_utc: string;
};

export type NepalAnalysisResponse = {
  status: "not_computed" | "success";
  analysis_status: "not_computed" | "computed";
  analysis_reason?: string;
  zone: string;
  zone_name: string;
  year_start: number;
  year_end: number;
  max_lag_months: number;
  domain: string;
  bounding_box: number[];
  time_series: {
    months: string[];
    precipitation_mm: (number | null)[];
    ndvi: (number | null)[];
  } | null;
  lag_analysis: LagCorrelation[];
  data_sources: SourceDataset[];
  provenance: {
    generated_at_utc: string;
    calculation_performed: boolean;
    measurements_included: boolean;
    catalog_discovery_is_analysis: boolean;
    software: string;
  };
};

export async function fetchDatasets(): Promise<{ status: string; data_downloaded: boolean; datasets: SourceDataset[] }> {
  const res = await fetch(`${API_BASE_URL}/datasets`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Dataset source request failed (HTTP ${res.status})`);
  return res.json();
}


export async function fetchNasaGranules(
  product: string,
  startYear: number,
  endYear: number,
  limit = 20,
  signal?: AbortSignal,
): Promise<NasaCatalogResponse> {
  const query = new URLSearchParams({
    product,
    start_year: String(startYear),
    end_year: String(endYear),
    limit: String(limit),
  });
  const res = await fetch(`${API_BASE_URL}/catalog/granules?${query}`, {
    cache: "no-store",
    signal,
  });
  if (!res.ok) {
    let detail = `NASA catalog request failed (HTTP ${res.status})`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") detail = body.detail;
    } catch { /* keep the HTTP fallback message */ }
    throw new Error(detail);
  }
  const data = await res.json();
  if (data.status !== "catalog_metadata" || data.is_download !== false || data.is_analysis !== false || data.returned_count_is_total !== false || !Array.isArray(data.granules)) {
    throw new Error("NASA catalog response did not satisfy the metadata-only contract");
  }
  return data as NasaCatalogResponse;
}

export async function fetchRegions(): Promise<{ status: string; regions: { id: string; name: string; country: string }[] }> {
  const res = await fetch(`${API_BASE_URL}/regions`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Region request failed (HTTP ${res.status})`);
  return res.json();
}

export async function fetchNepalAnalysis(
  zone: string,
  maxLag: number,
  startYear = 2003,
  endYear = 2024,
  signal?: AbortSignal,
): Promise<NepalAnalysisResponse> {
  const query = new URLSearchParams({
    zone,
    max_lag: String(maxLag),
    start_year: String(startYear),
    end_year: String(endYear),
  });
  const res = await fetch(`${API_BASE_URL}/analysis/nepal?${query}`, {
    cache: "no-store",
    signal,
  });
  if (!res.ok) throw new Error(`Analysis request failed (HTTP ${res.status})`);

  const data: unknown = await res.json();
  if (typeof data !== "object" || data === null) {
    throw new Error("Analysis API returned an invalid response");
  }
  const result = data as Record<string, unknown>;
  if (
    !["not_computed", "success"].includes(String(result.status)) ||
    result.zone !== zone ||
    result.max_lag_months !== maxLag ||
    result.year_start !== startYear ||
    result.year_end !== endYear ||
    !Array.isArray(result.lag_analysis) ||
    typeof result.analysis_status !== "string" ||
    typeof result.provenance !== "object" ||
    result.provenance === null
  ) {
    throw new Error("Analysis response failed the documented data contract");
  }
  if (result.analysis_status === "computed" && result.lag_analysis.length !== maxLag + 1) {
    throw new Error("Computed analysis is incomplete: expected one value for every requested lag");
  }
  if (result.analysis_status === "not_computed" && result.lag_analysis.length !== 0) {
    throw new Error("Uncomputed analysis must not contain result values");
  }
  return data as NepalAnalysisResponse;
}
