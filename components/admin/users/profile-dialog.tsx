"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateProfile, useMe } from "@/hooks/users/useUser";
import { useToast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  phone: z.string().min(1, "Số điện thoại không được để trống"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { data: user, isLoading: isLoadingUser } = useMe();
  const updateProfile = useUpdateProfile();
  const toast = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success("Cập nhật hồ sơ thành công!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật hồ sơ thất bại!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hồ sơ người dùng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cá nhân của bạn
          </DialogDescription>
        </DialogHeader>

        {isLoadingUser ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mb-4">
                <FormLabel>Email</FormLabel>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email không thể thay đổi
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={updateProfile.isPending}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}