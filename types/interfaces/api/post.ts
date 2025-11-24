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
  post_id: number;
  postTitle: string;
  postType: string;
  postContent: number;
  postStatus?: number;
  property: {
    property_id: number;
    title: string;
    price: number;
    images?: {
      image_id: number;
      imageUrl: string;
      isPrimary: boolean;
    }[];
  }
  createdBy: {
    user_id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PostDetailResponse {
  post_id: number;
  property_id: number;
  postTitle: string;
  postType: string;
  postContent: string;
  postStatus: string;
  approvedById: number | null;
  approvedAt: Date | null;
  rejectedById: number | null;
  rejectionReason: string | null;
  publishedAt: Date | null;
  createdById: number;
  property: {
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
  }
  createdBy: {
    user_id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreatePostRequest {
  property_id: number;
  postTitle: string;
  postType?: string;
  postContent?: string;
  postStatus: string;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> { }