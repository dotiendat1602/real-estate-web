import { UtilityCategory } from "@/types/enums/utility";

export interface UtilityResponse {
  paging: boolean;
  hasMore: boolean;
  pageIndex: any;
  totalPages: number;
  totalItems: number;
  data: UtilityData[];
}

export interface UtilityData {
  id: number,
  utilityCategory: string,
  utilityName: string,
  lat?: string,
  lon?: string,
  location?: string,
  provinceId?: number,
  districtId?: number,
  wardId?: number,
  deletedAt?: number,
}

export interface UtilityRequest {
  utilityName: string,
  utilityCategory: UtilityCategory,
  lat?: string,
  lon?: string,
  location?: string,
  provinceId?: number,
  districtId?: number,
  wardId?: number,
}

export interface UtilityUpdate extends Partial<UtilityRequest> { }