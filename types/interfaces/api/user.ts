export interface UpdateProfileRequest {
  name: string;
  phone: string;
}

export interface UserInfoResponse {
  user_id: string;
  email: string;
  name: string;
  phone: string;
  status: string;
  roles: {
    name: string;
  }
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}