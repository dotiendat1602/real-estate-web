"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UtilityCategory } from "@/types/enums/utility";
import { useUpdateUtility } from "@/hooks/categories-regions/useUtility";
import { NativeSelect } from "../../ui/select";

export default function EditUtilityModal({
  open,
  onOpenChange,
  editingItem,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editingItem: any | null; // UtilityData
  onSuccess?: () => void;
}) {
  const { mutateAsync: updateUtility, isPending } = useUpdateUtility();

  const [utilityName, setName] = useState("");
  const [utilityCategory, setCategory] = useState<UtilityCategory | undefined>(undefined);
  const [location, setLocation] = useState<string>("");
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [provinceId, setProvince] = useState<number | undefined>(undefined);
  const [districtId, setDistrict] = useState<number | undefined>(undefined);
  const [wardId, setWard] = useState<number | undefined>(undefined);

  const categories = useMemo(() => Object.values(UtilityCategory), []);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.utilityName ?? "");
      setCategory(editingItem.utilityCategory as UtilityCategory | undefined);
      setLocation(editingItem.location ?? "");
      setLat(editingItem.lat ?? "");
      setLon(editingItem.lon ?? "");
      setProvince(editingItem.provinceId ?? undefined);
      setDistrict(editingItem.districtId ?? undefined);
      setWard(editingItem.wardId ?? undefined);
    } else {
      setName("");
      setCategory(undefined);
      setLocation("");
      setLat("");
      setLon("");
      setProvince(undefined);
      setDistrict(undefined);
      setWard(undefined);
    }
  }, [editingItem]);

  const canSubmit = !!editingItem && utilityName.trim().length > 0 && !!utilityCategory;

  const handleSubmit = async () => {
    if (!canSubmit || !utilityCategory || !editingItem) return;
    await updateUtility({
      id: editingItem.utilityId as number,
      data: {
        utilityName: utilityName.trim(),
        utilityCategory: utilityCategory,
        location: location.trim() || undefined,
        lat: lat.trim() || undefined,
        lon: lon.trim() || undefined,
        provinceId: provinceId,
        districtId: districtId,
        wardId: wardId,
      },
    });
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tiện ích</DialogTitle>
          <DialogDescription>Cập nhật thông tin tiện ích lân cận.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="utility-name-edit">Tên</Label>
            <Input
              id="utility-name-edit"
              placeholder="Ví dụ: Vincom Mega Mall"
              value={utilityName}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="utility-category-edit">Danh mục</Label>
            <NativeSelect
              value={utilityCategory}
              onChange={(v) => setCategory(v as UtilityCategory)}
              placeholder="Chọn danh mục"
              id="utility-category-edit"
              disabled={isPending}
              selectClassName="h-10"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="utility-location-edit">Địa điểm</Label>
            <Input
              id="utility-location-edit"
              placeholder="Số nhà, đường, phường/xã…"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="utility-lat-edit">Lat</Label>
            <Input
              id="utility-lat-edit"
              placeholder="20.9999"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="utility-lon-edit">Lon</Label>
            <Input
              id="utility-lon-edit"
              placeholder="105.1234"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prov-edit">Tỉnh/TP ID</Label>
            <Input
              id="prov-edit"
              type="number"
              placeholder="VD: 01"
              value={provinceId ?? ""}
              onChange={(e) => setProvince(e.target.value ? Number(e.target.value) : undefined)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dist-edit">Quận/Huyện ID</Label>
            <Input
              id="dist-edit"
              type="number"
              placeholder="VD: 001"
              value={districtId ?? ""}
              onChange={(e) => setDistrict(e.target.value ? Number(e.target.value) : undefined)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ward-edit">Phường/Xã ID</Label>
            <Input
              id="ward-edit"
              type="number"
              placeholder="VD: 0001"
              value={wardId ?? ""}
              onChange={(e) => setWard(e.target.value ? Number(e.target.value) : undefined)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Huỷ</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isPending}>
            {isPending ? "Đang lưu…" : "Lưu thay đổi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
