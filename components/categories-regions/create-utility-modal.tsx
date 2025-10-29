"use client";

import { useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UtilityCategory } from "@/types/enums/utility";
import { NativeSelect } from "../ui/select";
import { useCreateUtility } from "@/hooks/categories-regions/useUtility";

export default function CreateUtilityModal({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}) {
  const { mutateAsync: createUtility, isPending } = useCreateUtility();

  const [utility_name, setName] = useState("");
  const [utility_category, setCategory] = useState<UtilityCategory | undefined>(undefined);
  const [location, setLocation] = useState<string>("");
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [province_id, setProvince] = useState<number | undefined>(undefined);
  const [district_id, setDistrict] = useState<number | undefined>(undefined);
  const [ward_id, setWard] = useState<number | undefined>(undefined);

  const categories = useMemo(() => Object.values(UtilityCategory), []);

  const canSubmit = utility_name.trim().length > 0 && !!utility_category;

  const handleSubmit = async () => {
    if (!canSubmit || !utility_category) return;
    await createUtility({
      utility_name: utility_name.trim(),
      utility_category,
      location: location.trim() || undefined,
      lat: lat.trim() || undefined,
      lon: lon.trim() || undefined,
      province_id,
      district_id,
      ward_id,
    });
    onOpenChange(false);
    // reset
    setName("");
    setCategory(undefined);
    setLocation("");
    setLat("");
    setLon("");
    setProvince(undefined);
    setDistrict(undefined);
    setWard(undefined);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tạo tiện ích</DialogTitle>
          <DialogDescription>Thêm tiện ích lân cận mới cho hệ thống.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="utility-name">Tên</Label>
            <Input
              id="utility-name"
              placeholder="Ví dụ: Vincom Mega Mall"
              value={utility_name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="utility-category">Danh mục</Label>
            <NativeSelect
              value={utility_category}
              onChange={(v) => setCategory(v as UtilityCategory)}
              placeholder="Chọn danh mục"
              id="utility-category"
              disabled={isPending}
              selectClassName="h-10"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="utility-location">Địa điểm</Label>
            <Input
              id="utility-location"
              placeholder="Số nhà, đường, phường/xã…"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="utility-lat">Lat</Label>
            <Input
              id="utility-lat"
              placeholder="20.9999"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="utility-lon">Lon</Label>
            <Input
              id="utility-lon"
              placeholder="105.1234"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prov">Tỉnh/TP ID</Label>
            <Input
              id="prov"
              type="number"
              placeholder="VD: 01"
              value={province_id ?? ""}
              onChange={(e) => setProvince(e.target.value ? Number(e.target.value) : undefined)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dist">Quận/Huyện ID</Label>
            <Input
              id="dist"
              type="number"
              placeholder="VD: 001"
              value={district_id ?? ""}
              onChange={(e) => setDistrict(e.target.value ? Number(e.target.value) : undefined)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ward">Phường/Xã ID</Label>
            <Input
              id="ward"
              type="number"
              placeholder="VD: 0001"
              value={ward_id ?? ""}
              onChange={(e) => setWard(e.target.value ? Number(e.target.value) : undefined)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Huỷ</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isPending}>
            {isPending ? "Đang tạo…" : "Tạo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
