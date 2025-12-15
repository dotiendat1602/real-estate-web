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
  provinceId?: number;
  districtId?: number;
  wardId?: number;
}

export interface PropertyListResponse extends DefaultPaginationResponse {
  data: PropertyData[];
}

export interface PropertyData {
  id: number;
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
    categoryName: string;
  };
  owner: {
    name: string;
  };
  images: {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
  }[];
  province: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name: string;
  };
  ward: {
    id: number;
    name: string;
  };
  PropertyAmenities: {
    amenity: {
      id: number;
      name: string;
    };
  }[];
  post: {}[];
  PropertyUtilities: {
    distanceM?: number;
    travelTimeS?: number;
    isPrimary?: boolean;
    note?: string;
    utility: {
      id: number;
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
  categoryId: number;
  wardId?: number;
  districtId?: number;
  provinceId?: number;
  status?: "ACTIVE" | "INACTIVE";
  amenityIds?: number[];
  utilities?: {
    id: number;
    distanceM?: number;
    travelTimeS?: number;
    isPrimary?: boolean;
    note?: string;
  }[];
}

export interface UpdatePropertyRequest extends Partial<CreatePropertyRequest> { }
