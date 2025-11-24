import { DepositStatus } from "@/types/enums/deposit";
import { DefaultPaginationResponse } from "../common";

export interface DepositListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  date_from?: string;
  date_to?: string;
  status?: DepositStatus;
}

export interface DepositListResponse extends DefaultPaginationResponse {
  data: DepositDataListItem[];
}

export interface DepositDataListItem {
  deposit_id: number;
  amount: number;
  status: string;
  transactionRef: string;
  holdExpiresAt: Date | null;
  post: {
    property: {
      title: string;
    }
  };
  seller: {
    name: string;
    phone: string;
  };
  buyer: {
    name: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DepositDetailResponse {
  deposit_id: number;
  post_id: number;
  buyerId: number;
  sellerId: number;
  amount: number;
  status: string;
  provider: string | null;
  transactionRef: string | null;
  holdExpiresAt: Date | null;
  paidAt: Date | null;
  confirmedAt: Date | null;
  releaseAt: Date | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  post: {
    postTitle: string;
    postContent: string;
    property: {
      title: string;
      description: string;
      price: number;
      lat: number;
      lon: number;
      location: string;
    }
  };
  buyer: {
    name: string;
    phone: string;
    email: string;
  };
  seller: {
    name: string;
    phone: string;
    email: string;
  }
}

export interface CreateDepositRequest { }

export interface UpdateDepositRequest {
  holdExpiresAt?: Date;
  note?: string;
}
