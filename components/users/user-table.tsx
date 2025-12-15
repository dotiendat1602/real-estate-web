"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserInfoResponse } from "@/types/interfaces/api/user";
import { UpdateUserModal } from "./update-user-modal";
import DialogConfirm from "../DialogConfirm";
import { CreateUserModal } from "./create-user-modal";
import { useDeleteUser } from "@/hooks/users/useUser";

type UserTableProps = {
  users: UserInfoResponse[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onPageChange?: (page: number) => void;
};

export function UserTable({
  users,
  isLoading,
  isError,
  onRetry,
  pageIndex,
  pageSize,
  totalItems,
  onPageChange,
}: UserTableProps) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // ---------- Modal create user ----------
  const [createOpen, setCreateOpen] = useState(false);

  // ---------- Modal edit user ----------
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserInfoResponse | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);

  const { mutate: deleteUser, isPending: deleting } = useDeleteUser();

  const openEdit = (user: UserInfoResponse) => {
    setEditingUser(user);
    setEditOpen(true);
  };

  const openDeleteDialog = (id: number, name: string) => {
    setUserToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    await new Promise<void>((resolve) => {
      deleteUser(userToDelete.id, { onSettled: () => resolve() } as any);
    });
    setUserToDelete(null);
    onRetry();
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const formatLastLogin = (lastLogin: Date | null | undefined) => {
    if (!lastLogin) return "Chưa đăng nhập";

    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(lastLogin);
  };

  const totalPages =
    pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-gray-500">
        Đang tải danh sách người dùng...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <p className="text-sm text-red-500">
          Có lỗi xảy ra khi tải danh sách người dùng.
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Thử lại
          </Button>
        )}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-sm text-gray-500">
        <span>Chưa có người dùng nào.</span>
        <Button
          className="bg-gray-900 hover:bg-gray-800 text-white"
          size="sm"
          onClick={() => setCreateOpen(true)}
        >
          + Tạo người dùng
        </Button>

        {/* Modal tạo user khi chưa có dữ liệu */}
        <CreateUserModal
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSuccess={onRetry}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar: nút tạo user + info chọn tất cả */}
      <div className="flex items-center justify-between py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
          <span className="text-sm text-gray-600">Chọn tất cả</span>
          <span className="text-sm text-gray-400">
            {selectedUsers.length} mục đã được chọn
          </span>
        </div>

        <Button
          className="bg-gray-900 hover:bg-gray-800 text-white"
          size="sm"
          onClick={() => setCreateOpen(true)}
        >
          + Tạo người dùng
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-12"></th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Tên
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Số điện thoại
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Vai trò
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Trạng thái hoạt động
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Lần đăng nhập cuối
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isActive = user.status === "ACTIVE";

              return (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {user.phone ?? "-"}
                  </td>
                  <td className="py-4 px-4">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {user.role?.name ?? "UNKNOWN"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      className={
                        isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }
                    >
                      {isActive ? "HOẠT ĐỘNG" : "KHÔNG HOẠT ĐỘNG"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {formatLastLogin(user.lastLogin)}
                  </td>
                  <td className="py-4 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => openEdit(user)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            openDeleteDialog(user.id, user.name)
                          }
                          className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination đơn giản */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-gray-500">
          Trang {pageIndex} / {totalPages} — {totalItems} người dùng
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pageIndex <= 1}
            onClick={() => onPageChange?.(pageIndex - 1)}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pageIndex >= totalPages}
            onClick={() => onPageChange?.(pageIndex + 1)}
          >
            Sau
          </Button>
        </div>
      </div>

      {/* Confirm delete */}
      <DialogConfirm
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xoá người dùng?"
        description={`Bạn chắc chắn muốn xoá “${userToDelete?.name ?? ""}”? Hành động này không thể hoàn tác.`}
        confirmText={deleting ? "Đang xoá..." : "Xoá"}
        cancelText="Huỷ"
        confirmVariant="destructive"
        onConfirm={confirmDelete}
      />

      {/* Modal create/edit user */}
      <CreateUserModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={onRetry}
      />
      <UpdateUserModal
        open={editOpen}
        onOpenChange={setEditOpen}
        editingUser={editingUser}
        onSuccess={onRetry}
      />
    </div>
  );
}
