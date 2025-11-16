import { DefaultPaginationResponse } from "../common";

export interface UpdateProfileRequest {
  name: string;
  phone: string;
}

export interface UserInfoResponse {
  user_id: number;
  email: string;
  name: string;
  phone: string;
  status: string;
  lastLogin: Date;
  createdAt: Date;
  role: {
    name: string;
  }
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserListQuery {
  pageIndex?: number;
  pageSize?: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: string;
  role?: string;
}

export interface UserListResponse extends DefaultPaginationResponse {
  data: UserInfoResponse[];
}

export interface CreateUserRequest {
  email: string;
  name: string;
  phone?: string;
  role: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  status?: string;
}
