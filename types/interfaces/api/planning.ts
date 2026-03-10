export type PlanningLookupStatus = "MATCHED" | "NO_MATCH" | "ERROR";
export type PlanningRiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type PlanningConfidenceLevel = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";

export interface CoordinatePlanningLookupRequest {
  lat: number;
  lng: number;
  kyQuyHoach?: string;
  forceRefresh?: boolean;
}

export interface CoordinatePlanningLookupResponse {
  status: PlanningLookupStatus;
  source: string;
  query: {
    lat: number;
    lng: number;
    kyQuyHoach: string;
  };
  summary: {
    loaiDatHT: string | null;
    tenLoaiDatHT: string | null;
    loaiDatQH: string | null;
    tenLoaiDatQH: string | null;
    maHoSo: string | null;
    tenHoSo: string | null;
  };
  overlays: Array<{
    geometryType: string | null;
    geojson: any;
    bbox: [number, number, number, number] | null;
  }>;
  documents: Array<{
    id: number;
    title: string;
    format: string | null;
    url: string | null;
  }>;
  confidence: {
    level: PlanningConfidenceLevel;
    reason: string;
  };
  checkedAt: string | null;
}

export interface PropertyPlanningSummaryResponse {
  propertyId: number;
  planningStatus: PlanningLookupStatus;
  riskLevel: PlanningRiskLevel | null;
  badge: string;
  landUseCurrent: string | null;
  landUsePlanned: string | null;
  dossier: {
    code: string;
    name: string;
  } | null;
  checkedAt: string | null;
}

export interface PropertyPlanningMapResponse {
  property: {
    lat: number | null;
    lng: number | null;
  };
  layers: Array<{
    id: string;
    name: string;
    source: string;
    style: {
      stroke: string;
      fill: string;
    };
    geojson: any;
    bbox: [number, number, number, number] | null;
    meta?: {
      loaiDatHT?: string | null;
      loaiDatQH?: string | null;
      maHoSo?: string | null;
      tenHoSo?: string | null;
    };
  }>;
}

export interface PlanningDossierResponse {
  maHoSo: string;
  tenHoSo: string;
  source: string;
  fetchedAt: string;
  documents: Array<{
    id: number;
    title: string;
    format: string | null;
    sourceUrl: string | null;
    sourcePath: string | null;
    downloadStatus: "PENDING" | "DOWNLOADED" | "FAILED";
    createdAt: string;
  }>;
}
