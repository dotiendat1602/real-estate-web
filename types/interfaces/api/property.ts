import { DefaultPaginationResponse } from "../common";

export interface PropertyListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  priceFrom?: number;
  priceTo?: number;
  province_id?: number;
  district_id?: number;
  ward_id?: number;
}

export interface PropertyListResponse extends DefaultPaginationResponse {
  data: PropertyData[];
}

export interface PropertyData {
  property_id: number;
  title: string;
  description: string;
  price: number;
  area?: number;
  bedroomNumber?: number;
  toiletNumber?: number;
  floorNumber?: number;
  parking?: boolean;
  orientation?: string;
  frontage?: number;
  roadWidth?: number;
  furnitureStatus?: string;
  legalStatus?: string;
  yearBuilt?: number;
  lat?: number;
  lon?: number;
  location?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  category: {
    category_name: string;
  };
  owner: {
    name: string;
  };
  images: {
    image_id: number;
    imageUrl: string;
    isPrimary: boolean;
  }[];
  province: {
    province_id: number;
    name: string;
  };
  district: {
    district_id: number;
    name: string;
  };
  ward: {
    ward_id: number;
    name: string;
  };
  PropertyAmenities: {
    amenity: {
      amenity_id: number;
      name: string;
    };
  }[];
  post: {}[];
  PropertyUtilities: {
    distance_m?: number;
    travel_time_s?: number;
    is_primary?: boolean;
    note?: string;
    utility: {
      utility_id: number;
      name: string;
    };
  }[];
}

export interface CreatePropertyRequest {
  title: string;
  description?: string;
  images?: { imageUrl: string; isPrimary: boolean }[];
  price: number;
  area?: number;
  bedroomNumber?: number;
  toiletNumber?: number;
  floorNumber?: number;
  parking?: boolean;
  orientation?: string;
  frontage?: number;
  roadWidth?: number;
  furnitureStatus?: string;
  legalStatus?: string;
  yearBuilt?: number;
  lat?: number;
  lon?: number;
  location?: string;
  category_id: number;
  ward_id?: number;
  district_id?: number;
  province_id?: number;
  status?: "ACTIVE" | "INACTIVE";
  amenity_ids?: number[];
  utilities?: {
    utility_id: number;
    distance_m?: number;
    travel_time_s?: number;
    is_primary?: boolean;
    note?: string;
  }[];
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> { }
