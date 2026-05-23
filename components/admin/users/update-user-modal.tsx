"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { useUpdateUser } from "@/hooks/users/useUser";
import type { UserInfoResponse } from "@/types/interfaces/api/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";

const roleSchema = z.enum(["ADMIN", "MANAGER", "AGENT", "USER"]);

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email người dùng")
    .email("Email không hợp lệ"),
  name: z.string().trim().min(1, "Vui lòng nhập tên người dùng"),
  phone: z.string().trim().optional(),
  role: roleSchema,
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

type Values = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: UserInfoResponse | null;
  onSuccess: () => void;
}

const normalizeRole = (role?: string | null): Values["role"] => {
  const normalized = role?.toUpperCase();
  if (normalized === "ADMIN" || normalized === "MANAGER" || normalized === "AGENT") {
    return normalized;
  }
  return "USER";
};

const normalizeStatus = (status?: string | null): Values["status"] => {
  const normalized = status?.toUpperCase();
  return normalized === "INACTIVE" ? "INACTIVE" : "ACTIVE";
};

export function UpdateUserModal({
  open,
  onOpenChange,
  editingUser,
  onSuccess,
}: Props) {
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      role: "USER",
      status: "ACTIVE",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open && editingUser) {
      form.reset({
        email: editingUser.email ?? "",
        name: editingUser.name ?? "",
        phone: editingUser.phone ?? "",
        role: normalizeRole(editingUser.role?.name),
        status: normalizeStatus(editingUser.status),
      });
    }
  }, [editingUser, form, open]);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = async (values: Values) => {
    if (!editingUser) return;

    await updateUser({
      id: editingUser.id,
      data: {
        name: values.name,
        phone: values.phone || undefined,
        role: values.role,
        status: values.status,
      },
    });

    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cơ bản, vai trò và trạng thái của người dùng.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                disabled
                className="bg-gray-100"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                placeholder="Nhập tên người dùng"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                placeholder="Nhập số điện thoại"
                {...register("phone")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    className="w-full"
                    selectClassName="bg-white"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="AGENT">Agent</option>
                    <option value="USER">User</option>
                  </NativeSelect>
                )}
              />
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    className="w-full"
                    selectClassName="bg-white"
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Không hoạt động</option>
                  </NativeSelect>
                )}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
