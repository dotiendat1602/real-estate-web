"use client";

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
import { useCreateCategoryProperty } from "@/hooks/categories-regions/useCategoryProperty";

const schema = z.object({
  category_name: z.string().trim().min(1, "Vui lòng nhập tên danh mục"),
  category_description: z.string().trim().optional(),
});
type Values = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateCategoryPropertyModal({ open, onOpenChange, onSuccess }: Props) {
  const { mutateAsync: createCategory, isPending } = useCreateCategoryProperty();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { category_name: "", category_description: "" },
  });

  const onSubmit = async (values: Values) => {
    await createCategory({
      category_name: values.category_name,
      category_description: values.category_description ?? "",
    } as any);
    form.reset();
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <DialogHeader>
          <DialogTitle>Tạo danh mục</DialogTitle>
          <DialogDescription>Nhập thông tin danh mục bất động sản.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2" autoComplete="off">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên danh mục</label>
            <Input
              placeholder="Ví dụ: Thương mại"
              {...form.register("category_name")}
              autoFocus
            />
            {form.formState.errors.category_name && (
              <p className="text-sm text-red-600">
                {form.formState.errors.category_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mô tả</label>
            <Textarea
              placeholder="Mô tả ngắn gọn…"
              rows={4}
              {...form.register("category_description")}
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
              {isPending ? "Đang tạo..." : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
