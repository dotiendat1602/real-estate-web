import { PostStatus, PostType } from "@/types/enums/post";
import { DefaultPaginationResponse } from "../common";

export enum ReportStatus {
  PENDING = "PENDING",
  UNDER_REVIEWED = "UNDER_REVIEWED",
  ACTION_TAKED = "ACTION_TAKED",
  REJECTED = "REJECTED",
  RESOLVED = "RESOLVED",
}

export interface PostListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  type?: string;
  status?: string;
  provinceId?: number;
  districtId?: number;
  wardId?: number;
}

export interface PostListResponse extends DefaultPaginationResponse {
  data: PostDataListItem[];
}

export interface PostDataListItem {
  id: number;
  postTitle: string;
  postType: PostType;
  postContent: number;
  postStatus?: PostStatus;
  property: {
    id: number;
    title: string;
    price: number | string;
    area?: number | string | null;
    bedroomNumber?: number | null;
    toiletNumber?: number | null;
    location?: string | null;
    category?: {
      id: number;
      categoryName: string;
    } | null;
    province?: {
      id: number;
      name: string;
    } | null;
    district?: {
      id: number;
      name: string;
    } | null;
    ward?: {
      id: number;
      name: string;
    } | null;
    images?: {
      id: number;
      imageUrl: string;
      isPrimary: boolean;
    }[];
  }
  createdBy: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PostDetailResponse {
  id: number;
  propertyId: number;
  postTitle: string;
  postType: PostType;
  postContent: string;
  postStatus: PostStatus;
  approvedById: number | null;
  approvedAt: Date | null;
  rejectedById: number | null;
  rejectionReason: string | null;
  publishedAt: Date | null;
  createdById: number;
  property: {
    id: number;
    title: string;
    description: string;
    price: string;
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
    images?: {
      id: number;
      imageUrl: string;
      isPrimary: boolean;
    }[];
    category: {
      id: number;
      name: string;
    } | null;
    ward: {
      name: string;
    } | null;
    district: {
      name: string;
    } | null;
    province: {
      name: string;
    } | null;
    propertyAmenities: {
      amenity: {
        id: number;
        name: string;
      };
    }[];
    propertyUtilities: {
      distanceM?: number | string | null;
      travelTimeS?: number | null;
      isPrimary?: boolean | null;
      note?: string | null;
      utility: {
        id: number;
        name?: string | null;
        utilityName?: string | null;
        utilityCategory?: string | null;
        lat?: number | string | null;
        lon?: number | string | null;
        location?: string | null;
      };
    }[];
  }
  createdBy: {
    id: number;
    name: string;
  };
  favorites: {
    id: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreatePostRequest {
  propertyId: number;
  postTitle: string;
  postType?: string;
  postContent?: string;
  postStatus: string;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> { }

// ============= PUBLIC API INTERFACES =============

export interface PublicPostListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  type?: string;
  priceFrom?: number;
  priceTo?: number;
  areaFrom?: number;
  areaTo?: number;
  bedroomNumber?: number;
  toiletNumber?: number;
  categoryId?: number;
  provinceId?: number;
  districtId?: number;
  wardId?: number;
  agentId?: number;
  amenityIds?: number[];
  utilityIds?: number[];
}

export interface PublicPostListResponse extends DefaultPaginationResponse {
  data: PostDataListItem[];
}

export interface ReportPostRequest {
  reporterId?: number;
  reason: string;
}

export interface ReportPostResponse {
  id: number;
  postId: number;
  reporterId: number | null;
  reason: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  postId?: number;
  status?: string;
}

export interface ReportListResponse extends DefaultPaginationResponse {
  data: ReportPostResponse[];
}

export interface UpdateReportRequest {
  status: ReportStatus;
}

// ============= FAVORITES =============

export interface FavoritesPostListQuery {
  pageIndex?: number;
  pageSize?: number;
}

export interface FavoritesPostListResponse extends DefaultPaginationResponse {
  data: PostDataListItem[];
}

export interface ToggleFavoriteResponse {
  isFavorited: boolean;
  action: "ADDED" | "REMOVED" | "RESTORED";
  favorite?: {
    id: number;
    userId: number;
    postId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  };
}
