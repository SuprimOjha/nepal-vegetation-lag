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
    code_revision: string | null;
    run_id: string | null;
    input_file_checksums: string[];
  };
};

export async function fetchDatasets(): Promise<{ status: string; data_downloaded: boolean; datasets: SourceDataset[] }> {
  const res = await fetch(`${API_BASE_URL}/datasets`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Dataset source request failed (HTTP ${res.status})`);
  const data: unknown = await res.json();
  if (typeof data !== "object" || data === null) throw new Error("Dataset catalogue returned an invalid response");
  const result = data as Record<string, unknown>;
  if (
    result.status !== "source_catalog" ||
    result.data_downloaded !== false ||
    !Array.isArray(result.datasets) ||
    !result.datasets.every((item: unknown) => {
      if (typeof item !== "object" || item === null) return false;
      const row = item as Record<string, unknown>;
      return ["short_name", "title", "variable", "provider", "landing_page", "catalog", "status", "role"]
        .every(key => typeof row[key] === "string");
    })
  ) {
    throw new Error("Dataset catalogue failed its source-status contract");
  }
  return data as { status: string; data_downloaded: boolean; datasets: SourceDataset[] };
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
  if (
    data.status !== "catalog_metadata" ||
    data.is_download !== false ||
    data.is_analysis !== false ||
    data.returned_count_is_total !== false ||
    data.product !== product ||
    data.temporal_filter?.start !== `${startYear}-01-01` ||
    data.temporal_filter?.end !== `${endYear}-12-31` ||
    !Array.isArray(data.granules) ||
    data.returned_count !== data.granules.length ||
    data.limit !== limit ||
    typeof data.queried_at_utc !== "string"
  ) {
    throw new Error("NASA catalog response failed the metadata-only contract or query-parameter checks");
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
  const provenance = result.provenance;
  const timeSeries = result.time_series;
  const lagAnalysis = result.lag_analysis;

  if (
    !["not_computed", "success"].includes(String(result.status)) ||
    !["not_computed", "computed"].includes(String(result.analysis_status)) ||
    result.zone !== zone ||
    result.max_lag_months !== maxLag ||
    result.year_start !== startYear ||
    result.year_end !== endYear ||
    typeof result.domain !== "string" ||
    !Array.isArray(result.bounding_box) ||
    !result.bounding_box.every((value) => typeof value === "number" && Number.isFinite(value)) ||
    !Array.isArray(lagAnalysis) ||
    !Array.isArray(result.data_sources) ||
    typeof provenance !== "object" ||
    provenance === null
  ) {
    throw new Error("Analysis response failed the documented data contract");
  }

  const provenanceRecord = provenance as Record<string, unknown>;
  if (
    typeof provenanceRecord.generated_at_utc !== "string" ||
    typeof provenanceRecord.calculation_performed !== "boolean" ||
    typeof provenanceRecord.measurements_included !== "boolean" ||
    typeof provenanceRecord.catalog_discovery_is_analysis !== "boolean" ||
    typeof provenanceRecord.software !== "string" ||
    !(provenanceRecord.code_revision === null || typeof provenanceRecord.code_revision === "string") ||
    !(provenanceRecord.run_id === null || typeof provenanceRecord.run_id === "string") ||
    !Array.isArray(provenanceRecord.input_file_checksums)
  ) {
    throw new Error("Analysis provenance is incomplete or malformed");
  }

  const isComputed = result.analysis_status === "computed";
  if (isComputed) {
    if (result.status !== "success" || lagAnalysis.length !== maxLag + 1) {
      throw new Error("Computed analysis is incomplete: expected one value for every requested lag");
    }
    if (
      provenanceRecord.calculation_performed !== true ||
      provenanceRecord.measurements_included !== true ||
      timeSeries === null ||
      typeof timeSeries !== "object"
    ) {
      throw new Error("Computed status requires measurements and calculation provenance");
    }
    const ts = timeSeries as Record<string, unknown>;
    if (
      !Array.isArray(ts.months) ||
      !Array.isArray(ts.precipitation_mm) ||
      !Array.isArray(ts.ndvi) ||
      ts.months.length !== ts.precipitation_mm.length ||
      ts.months.length !== ts.ndvi.length
    ) {
      throw new Error("Computed time-series arrays must have matching lengths");
    }
    for (const point of lagAnalysis) {
      if (typeof point !== "object" || point === null) {
        throw new Error("Malformed lag result");
      }
      const row = point as Record<string, unknown>;
      if (
        typeof row.lag !== "string" ||
        typeof row.correlation !== "number" ||
        !Number.isFinite(row.correlation) ||
        row.correlation < -1 ||
        row.correlation > 1
      ) {
        throw new Error("Lag result contains an invalid correlation coefficient");
      }
      if (row.n !== undefined && (typeof row.n !== "number" || !Number.isInteger(row.n) || row.n < 0)) {
        throw new Error("Lag result contains an invalid sample count");
      }
      if (row.p_value !== undefined && row.p_value !== null &&
        (typeof row.p_value !== "number" || row.p_value < 0 || row.p_value > 1)) {
        throw new Error("Lag result contains an invalid p-value");
      }
    }
  } else if (
    result.status !== "not_computed" ||
    lagAnalysis.length !== 0 ||
    timeSeries !== null ||
    provenanceRecord.calculation_performed !== false ||
    provenanceRecord.measurements_included !== false
  ) {
    throw new Error("Uncomputed analysis must not contain scientific result values");
  }
  return data as NepalAnalysisResponse;
}
