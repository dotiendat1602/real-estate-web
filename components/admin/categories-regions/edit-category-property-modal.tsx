"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCategoryProperty } from "@/hooks/categories-regions/useCategoryProperty";

const schema = z.object({
  categoryName: z.string().trim().min(1, "Vui lòng nhập tên danh mục"),
  categoryDescription: z.string().trim().optional(),
});
type Values = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: any | null;
  onSuccess: () => void;
}

export default function EditCategoryModal({
  open,
  onOpenChange,
  editingItem,
  onSuccess,
}: Props) {
  const { mutateAsync: updateCategory, isPending } = useUpdateCategoryProperty();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { categoryName: "", categoryDescription: "" },
    mode: "onSubmit",
  });

  // ❗️ Quan trọng: reset form khi mở modal hoặc khi editingItem thay đổi
  useEffect(() => {
    if (open && editingItem) {
      form.reset({
        categoryName: editingItem.categoryName ?? "",
        categoryDescription: editingItem.categoryDescription ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingItem]);

  const onSubmit = async (values: Values) => {
    if (!editingItem) return;
    await updateCategory({
      id: editingItem.category_id,
      data: {
        categoryName: values.categoryName ?? "",
        categoryDescription: values.categoryDescription ?? "",
      }
    } as any);
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          <DialogDescription>Cập nhật thông tin danh mục.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2" autoComplete="off">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên danh mục</label>
            <Input
              placeholder="Tên danh mục"
              {...form.register("categoryName")}
              autoFocus
            />
            {form.formState.errors.categoryName && (
              <p className="text-sm text-red-600">
                {form.formState.errors.categoryName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mô tả</label>
            <Textarea
              placeholder="Mô tả…"
              rows={4}
              {...form.register("categoryDescription")}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Huỷ
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}