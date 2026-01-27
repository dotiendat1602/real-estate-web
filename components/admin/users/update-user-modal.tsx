"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import type { UserInfoResponse } from "@/types/interfaces/api/user";
import { useUpdateUser } from "@/hooks/users/useUser";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email người dùng")
    .email("Email không hợp lệ"),
  name: z.string().trim().min(1, "Vui lòng nhập tên người dùng"),
  phone: z.string().trim().optional(),
  role: z.string().trim().optional(),
  status: z.string().trim().optional(),
});

type Values = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: UserInfoResponse | null;
  onSuccess: () => void;
}

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
      role: "",
      status: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open && editingUser) {
      form.reset({
        email: editingUser.email ?? "",
        name: editingUser.name ?? "",
        phone: editingUser.phone ?? "",
        role: editingUser.role.name ?? "",
        status: editingUser.status ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingUser]);

  const onSubmit = async (values: Values) => {
    if (!editingUser) return;

    await updateUser({
      id: editingUser.id,
      data: {
        // email đang disable nên backend thường không cho đổi
        // nếu backend cho đổi thì để email: values.email
        name: values.name,
        phone: values.phone || null,
        role: values.role,
        status: values.status || null,
      },
    } as any);

    onOpenChange(false);
    onSuccess();
  };

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cơ bản của người dùng trong hệ thống.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Email (readonly) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                disabled
                className="bg-gray-100"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                placeholder="Nhập tên người dùng"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">
                  {errors.name.message as string}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                placeholder="Nhập số điện thoại"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">
                  {errors.phone.message as string}
                </p>
              )}
            </div>

            {/* Role */}
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
                    placeholder="Chọn vai trò"
                  >
                    <option value="">Chọn vai trò</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="agent">Agent</option>
                    <option value="viewer">Viewer</option>
                  </NativeSelect>
                )}
              />
              {errors.role && (
                <p className="text-sm text-red-500">
                  {errors.role.message as string}
                </p>
              )}
            </div>

            {/* (Optional) Status nếu muốn show */}
            {/* 
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Input
                id="status"
                placeholder="Nhập trạng thái (ví dụ: active/inactive)"
                {...register("status")}
              />
              {errors.status && (
                <p className="text-sm text-red-500">
                  {errors.status.message as string}
                </p>
              )}
            </div>
            */}
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
