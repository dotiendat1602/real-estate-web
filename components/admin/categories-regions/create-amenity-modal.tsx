"use client";

import { useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AmenityCategory } from "@/types/enums/amenity";
import { useCreateAmenity } from "@/hooks/categories-regions/useAmenity";
import { NativeSelect } from "../../ui/select";

export default function CreateAmenityModal({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}) {
  const { mutateAsync: createAmenity, isPending } = useCreateAmenity();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<AmenityCategory | undefined>(undefined);

  const categories = useMemo(() => Object.values(AmenityCategory), []);

  const canSubmit = name.trim().length > 0 && !!category;

  const handleSubmit = async () => {
    if (!canSubmit || !category) return;
    await createAmenity({ name: name.trim(), category });
    onOpenChange(false);
    setName("");
    setCategory(undefined);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo tiện nghi</DialogTitle>
          <DialogDescription>Thêm tiện nghi mới cho hệ thống.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="amenity-name">Tên</Label>
            <Input
              id="amenity-name"
              placeholder="Ví dụ: Hồ bơi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amenity-category">Danh mục</Label>
            <NativeSelect
              value={category}
              onChange={(v: any) => setCategory(v as AmenityCategory)}
              placeholder="Chọn danh mục"
              id="amenity-category"
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
              {isPending ? "Đang tạo…" : "Tạo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}