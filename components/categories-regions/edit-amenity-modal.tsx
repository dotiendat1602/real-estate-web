"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AmenityCategory } from "@/types/enums/amenity";
import { NativeSelect } from "../ui/select";
import { useUpdateAmenity } from "@/hooks/categories-regions/useAmenity";

export default function EditAmenityModal({
  open,
  onOpenChange,
  editingItem,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editingItem: any | null; // AmenityData
  onSuccess?: () => void;
}) {
  const { mutateAsync: updateAmenity, isPending } = useUpdateAmenity();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<AmenityCategory | undefined>(undefined);

  const categories = useMemo(() => Object.values(AmenityCategory), []);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name ?? "");
      setCategory(editingItem.category as AmenityCategory | undefined);
    } else {
      setName("");
      setCategory(undefined);
    }
  }, [editingItem]);

  const canSubmit = !!editingItem && name.trim().length > 0 && !!category;

  const handleSubmit = async () => {
    if (!canSubmit || !category || !editingItem) return;
    await updateAmenity({
      id: editingItem.amenity_id as number,
      data: { name: name.trim(), category },
    });
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tiện nghi</DialogTitle>
          <DialogDescription>Cập nhật thông tin tiện nghi.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="amenity-name-edit">Tên</Label>
            <Input
              id="amenity-name-edit"
              placeholder="Ví dụ: Hồ bơi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amenity-category-edit">Danh mục</Label>
            <NativeSelect
              value={category}
              onChange={(v) => setCategory(v as AmenityCategory)}
              placeholder="Chọn danh mục"
              id="amenity-category-edit"
              disabled={isPending}
              selectClassName="h-10"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Huỷ
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit || isPending}>
              {isPending ? "Đang lưu…" : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
