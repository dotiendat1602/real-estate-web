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
  utility_id: number,
  utility_category: string,
  utility_name: string,
  lat?: string,
  lon?: string,
  location?: string,
  province_id?: number,
  district_id?: number,
  ward_id?: number,
  deletedAt?: number,
}

export interface UtilityRequest {
  utility_name: string,
  utility_category: UtilityCategory,
  lat?: string,
  lon?: string,
  location?: string,
  province_id?: number,
  district_id?: number,
  ward_id?: number,
}

export interface UtilityUpdate extends Partial<UtilityRequest> { }