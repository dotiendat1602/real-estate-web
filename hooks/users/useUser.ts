// hooks/users/useUser.ts - Cập nhật với hooks mới
"use client";

import { UsersApi } from "@/lib/api/user";
import { ChangePasswordRequest, CreateUserRequest, UpdateProfileRequest, UpdateUserRequest, UserInfoResponse, UserListQuery, UserListResponse } from "@/types/interfaces/api/user";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const userKeys = {
  all: ["user"] as const,
  list: (q: UserListQuery = {}) => [...userKeys.all, "list", q] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
  me: () => [...userKeys.all, "me"] as const,
};

export function useUsers(query: UserListQuery) {
  return useQuery<UserListResponse>({
    queryKey: userKeys.list(query),
    queryFn: () => UsersApi.getAllUsers(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useUserDetail(userId: number) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => UsersApi.getOneUser(userId),
    staleTime: 60_000,
  });
}

export function useMe() {
  return useQuery<UserInfoResponse>({
    queryKey: userKeys.me(),
    queryFn: () => UsersApi.me(),
    staleTime: 60_000,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserRequest) =>
      UsersApi.createUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UpdateUserRequest }) =>
      UsersApi.updateUser(payload.id, payload.data),
    onSuccess: (_data, variables) => {
      // Invalidate list + detail
      qc.invalidateQueries({ queryKey: userKeys.all });
      qc.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      UsersApi.updatedProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.me() });
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useChangePassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      UsersApi.changePassword(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => UsersApi.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUserInfo() {
  return UsersApi.me();
}
