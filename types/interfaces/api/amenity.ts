import { AmenityCategory } from "@/types/enums/amenity";

export interface AmenityResponse {
  paging: boolean;
  hasMore: boolean;
  pageIndex: any;
  totalPages: number;
  totalItems: number;
  data: AmenityData[];
}

export interface AmenityData {
  amenity_id: number,
  name: string,
  category: string,
  propertiesCount: number,
}

export interface AmenityRequest {
  name: string,
  category: AmenityCategory,
}

export interface AmenityUpdate extends Partial<AmenityRequest> { }