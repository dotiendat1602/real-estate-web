"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import DialogConfirm from "@/components/DialogConfirm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Pagination from "@/components/ui/pagination";
import { useDeleteUser } from "@/hooks/users/useUser";
import { formatRoleName } from "@/lib/utils";
import type { UserInfoResponse } from "@/types/interfaces/api/user";
import { CreateUserModal } from "./create-user-modal";
import { UpdateUserModal } from "./update-user-modal";

type UserTableProps = {
  users: UserInfoResponse[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

const formatLastLogin = (lastLogin: Date | string | null | undefined) => {
  if (!lastLogin) return "Chưa đăng nhập";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(lastLogin));
};

const formatStatus = (status?: string | null) => {
  return status === "ACTIVE" ? "Hoạt động" : "Không hoạt động";
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
  onPageSizeChange,
}: UserTableProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserInfoResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { mutate: deleteUser, isPending: deleting } = useDeleteUser();

  const totalPages =
    pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;

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
      deleteUser(userToDelete.id, { onSettled: () => resolve() });
    });

    setUserToDelete(null);
    onRetry();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-gray-500">
        Đang tải danh sách người dùng...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10">
        <p className="text-sm text-red-500">
          Có lỗi xảy ra khi tải danh sách người dùng.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="cursor-pointer"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-sm text-gray-500">
        <span>Chưa có người dùng nào.</span>
        <Button
          className="cursor-pointer bg-gray-900 text-white hover:bg-gray-800"
          size="sm"
          onClick={() => setCreateOpen(true)}
        >
          + Tạo người dùng
        </Button>

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
      <div className="flex items-center justify-end border-b border-gray-200 py-3">
        <Button
          className="cursor-pointer bg-gray-900 text-white hover:bg-gray-800"
          size="sm"
          onClick={() => setCreateOpen(true)}
        >
          + Tạo người dùng
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Tên
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Số điện thoại
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Vai trò
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Lần đăng nhập cuối
              </th>
              <th className="w-14 px-4 py-3" />
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
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {user.phone ?? "-"}
                  </td>
                  <td className="px-4 py-4">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {formatRoleName(user.role?.name) || "Không rõ"}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      className={
                        isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }
                    >
                      {formatStatus(user.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatLastLogin(user.lastLogin)}
                  </td>
                  <td className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer text-gray-400 hover:text-gray-600"
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
                          onClick={() => openDeleteDialog(user.id, user.name)}
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

      <Pagination
        currentPage={pageIndex}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={(page) => onPageChange?.(page)}
        onPageSizeChange={onPageSizeChange}
        itemLabel="người dùng"
      />

      <DialogConfirm
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xóa người dùng?"
        description={`Bạn chắc chắn muốn xóa "${userToDelete?.name ?? ""}"? Hành động này không thể hoàn tác.`}
        confirmText={deleting ? "Đang xóa..." : "Xóa"}
        cancelText="Hủy"
        confirmVariant="destructive"
        onConfirm={confirmDelete}
      />

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
