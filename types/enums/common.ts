export enum ApiErrorCode {
  // Các mã lỗi chung
  INVALID_REQUEST = "INVALID_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",

  // Lỗi xác thực
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",

  // Lỗi dữ liệu
}

export const ROLE_NAME_MAP: Record<string, string> = {
  USER: "User",
  MANAGER: "Manager",
  ADMIN: "Admin",
};

export const PERMISSION_NAME_MAP: Record<string, string> = {
  MANAGE_USERS: "Quản lý người dùng",
  MANAGE_ROLES: "Quản lý vai trò",
  MANAGE_PAYMENT: "Quản lý đặt cọc",
  MANAGE_PROPERTY: "Quản lý bất động sản",
  MANAGE_POST: "Quản lý bài viết",
  MANAGE_CATEGORY: "Quản lý danh mục",
  MANAGE_AMENITIES: "Quản lý tiện ích",
};

export const FURNITURE_STATUS_MAP: Record<string, string> = {
  FULLY_FURNISHED: "Đầy đủ nội thất",
  PARTLY_FURNISHED: "Một phần nội thất",
  UNFURNISHED: "Không nội thất",
};

export const LEGAL_STATUS_MAP: Record<string, string> = {
  FREEHOLD: "Sở hữu lâu dài",
  LEASEHOLD: "Sở hữu có thời hạn (Thuê)",
  RED_BOOK: "Sổ đỏ",
  PINK_BOOK: "Sổ hồng",
  OTHER: "Khác",
};
