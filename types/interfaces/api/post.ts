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
    id: number;
    name: string;
  };
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