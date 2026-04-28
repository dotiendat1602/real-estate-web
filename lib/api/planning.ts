import {
  CoordinatePlanningLookupRequest,
  CoordinatePlanningLookupResponse,
  PlanningDossierResponse,
  PlanningExplainRequest,
  PlanningExplainResponse,
  PropertyPlanningMapResponse,
  PropertyPlanningSummaryResponse,
} from "@/types/interfaces/api/planning";
import { sendGet, sendPost } from "./axios";

export const PlanningApi = {
  lookupByCoordinate: async (
    data: CoordinatePlanningLookupRequest,
  ): Promise<CoordinatePlanningLookupResponse> => {
    const response = await sendPost("/api/core/v1/planning/lookups/coordinate", data);
    return response.data as CoordinatePlanningLookupResponse;
  },

  getPropertyPlanningSummary: async (
    propertyId: number,
  ): Promise<PropertyPlanningSummaryResponse> => {
    const response = await sendGet(`/api/core/v1/planning/properties/${propertyId}/summary`);
    return response.data as PropertyPlanningSummaryResponse;
  },

  getPropertyPlanningMap: async (
    propertyId: number,
  ): Promise<PropertyPlanningMapResponse> => {
    const response = await sendGet(`/api/core/v1/planning/properties/${propertyId}/map`);
    return response.data as PropertyPlanningMapResponse;
  },

  getPlanningDossier: async (maHoSo: string): Promise<PlanningDossierResponse> => {
    const response = await sendGet(`/api/core/v1/planning/dossiers/${encodeURIComponent(maHoSo)}`);
    return response.data as PlanningDossierResponse;
  },

  explainPropertyPlanning: async (
    propertyId: number,
    data: PlanningExplainRequest,
  ): Promise<PlanningExplainResponse> => {
    const response = await sendPost(`/api/core/v1/planning/properties/${propertyId}/explain`, data);
    return response.data as PlanningExplainResponse;
  },
};
