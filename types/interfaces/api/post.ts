// d:\Real-estate\real-estate-web\types\interfaces\api\post.ts
import { PostStatus, PostType } from "@/types/enums/post";
import { DefaultPaginationResponse } from "../common";

export interface PostListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  type?: string;
  status?: string;
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
    price: number;
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
      utility: {
        id: number;
        name: string;
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
