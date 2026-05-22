"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { useCreateUser } from "@/hooks/users/useUser";
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

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email người dùng")
    .email("Email không hợp lệ"),
  name: z.string().trim().min(1, "Vui lòng nhập tên người dùng"),
  phone: z.string().trim().optional(),
  role: z.enum(["ADMIN", "MANAGER", "AGENT", "USER"], {
    message: "Vui lòng chọn vai trò",
  }),
});

type Values = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateUserModal({ open, onOpenChange, onSuccess }: Props) {
  const { mutateAsync: createUser, isPending } = useCreateUser();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      role: "USER",
    },
    mode: "onSubmit",
  });

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (values: Values) => {
    await createUser({
      email: values.email,
      name: values.name,
      phone: values.phone || undefined,
      role: values.role,
    });

    reset();
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tạo người dùng mới</DialogTitle>
            <DialogDescription>
              Thêm người dùng mới và gán vai trò truy cập hệ thống.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Nhập email người dùng"
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
              {isPending ? "Đang tạo..." : "Tạo người dùng"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
