"use client";

import React, { useMemo, useState } from "react";
import type {
  PropertyData,
  UpdatePropertyRequest,
  FurnitureStatusValue,
  LegalStatusValue,
} from "@/types/interfaces/api/property";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";
import { PropertyImageItem, PropertyImagesField } from "./property-images-field";

type ParkingValue = "" | "true" | "false";
type StatusValue = "ACTIVE" | "INACTIVE";

interface EditPropertyFormProps {
  property: PropertyData;
  onSubmit: (values: UpdatePropertyRequest) => void;
  isSubmitting?: boolean;
}

interface FormState {
  title: string;
  price: string;
  area: string;
  bedroomNumber: string;
  toiletNumber: string;
  floorNumber: string;
  parking: ParkingValue;
  orientation: string;
  frontage: string;
  roadWidth: string;
  furnitureStatus: FurnitureStatusValue;
  legalStatus: LegalStatusValue;
  yearBuilt: string;
  lat: string;
  lon: string;
  location: string;
  status: StatusValue;
}

const labelCls = "text-white/70 text-sm";
const helperCls = "text-white/50 text-sm";
const cardCls = "bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8";
const inputCls =
  "bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg placeholder:text-white/40 focus-visible:ring-purple-600/60";
const selectCls = "bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg";

const furnitureStatusOptions: { value: Exclude<FurnitureStatusValue, "">; label: string }[] = [
  { value: "UNFURNISHED", label: "Chưa có nội thất" },
  { value: "PARTLY_FURNISHED", label: "Nội thất cơ bản" },
  { value: "FULLY_FURNISHED", label: "Full nội thất" },
];

const legalStatusOptions: { value: Exclude<LegalStatusValue, "">; label: string }[] = [
  { value: "FREEHOLD", label: "Sở hữu lâu dài" },
  { value: "LEASEHOLD", label: "Sở hữu có thời hạn" },
  { value: "RED_BOOK", label: "Sổ đỏ" },
  { value: "PINK_BOOK", label: "Sổ hồng" },
  { value: "OTHER", label: "Khác" },
];

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function EditPropertyForm({ property, onSubmit, isSubmitting }: EditPropertyFormProps) {
  const [form, setForm] = useState<FormState>(() => ({
    title: property.title || "",
    price: property.price?.toString() ?? "",
    area: property.area?.toString() ?? "",
    bedroomNumber: property.bedroomNumber?.toString() ?? "",
    toiletNumber: property.toiletNumber?.toString() ?? "",
    floorNumber: property.floorNumber?.toString() ?? "",
    parking: property.parking == null ? "" : property.parking ? "true" : "false",
    orientation: property.orientation || "",
    frontage: property.frontage?.toString() ?? "",
    roadWidth: property.roadWidth?.toString() ?? "",
    furnitureStatus: (property.furnitureStatus as FurnitureStatusValue) || "",
    legalStatus: (property.legalStatus as LegalStatusValue) || "",
    yearBuilt: property.yearBuilt?.toString() ?? "",
    lat: property.lat?.toString() ?? "",
    lon: property.lon?.toString() ?? "",
    location: property.location || "",
    status: (property.status as StatusValue) || "ACTIVE",
  }));

  const [images, setImages] = useState<PropertyImageItem[]>(() => {
    const imgs = (property as any).images ?? [];
    return imgs.map((img: any) => ({
      id: uid(),
      imageUrl: img.imageUrl ?? img.url ?? img,
      isPrimary: !!img.isPrimary,
    }));
  });

  const handleChange =
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value as any }));
      };

  const imagesPayload = useMemo(() => {
    return images.map((x) => ({
      imageUrl: x.imageUrl,
      isPrimary: !!x.isPrimary,
    }));
  }, [images]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UpdatePropertyRequest = {
      title: form.title.trim(),
      price: form.price ? Number(form.price) : property.price,
      area: form.area ? Number(form.area) : undefined,
      bedroomNumber: form.bedroomNumber ? Number(form.bedroomNumber) : undefined,
      toiletNumber: form.toiletNumber ? Number(form.toiletNumber) : undefined,
      floorNumber: form.floorNumber ? Number(form.floorNumber) : undefined,
      parking: form.parking === "" ? undefined : form.parking === "true",
      orientation: form.orientation.trim() || undefined,
      frontage: form.frontage ? Number(form.frontage) : undefined,
      roadWidth: form.roadWidth ? Number(form.roadWidth) : undefined,
      furnitureStatus: form.furnitureStatus === "" ? undefined : form.furnitureStatus,
      legalStatus: form.legalStatus === "" ? undefined : form.legalStatus,
      yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
      lat: form.lat ? Number(form.lat) : undefined,
      lon: form.lon ? Number(form.lon) : undefined,
      location: form.location.trim() || undefined,
      status: form.status,
      images: imagesPayload,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className={`${cardCls} space-y-8 text-white`}>
      {/* Upload + Preview + Replace */}
      <PropertyImagesField
        label="Hình ảnh bất động sản"
        helper="Bạn có thể thay ảnh, xoá ảnh, và chọn ảnh chính."
        value={images}
        onChange={setImages}
        max={12}
      />

      {/* Thông tin cơ bản */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white">Thông tin cơ bản</h2>
          <p className={helperCls}>Cập nhật tiêu đề, giá và các thông số chính của bất động sản.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <Label className={labelCls} htmlFor="title">
              Tiêu đề *
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="VD: Nhà phố 3 tầng mặt tiền rộng, trung tâm quận..."
              required
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="price">
              Giá rao bán (VND) *
            </Label>
            <Input
              id="price"
              type="number"
              min={0}
              value={form.price}
              onChange={handleChange("price")}
              placeholder="VD: 5500000000"
              required
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="area">
              Diện tích (m²)
            </Label>
            <Input
              id="area"
              type="number"
              min={0}
              step="0.1"
              value={form.area}
              onChange={handleChange("area")}
              placeholder="VD: 75"
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="bedroomNumber">
              Số phòng ngủ
            </Label>
            <Input
              id="bedroomNumber"
              type="number"
              min={0}
              value={form.bedroomNumber}
              onChange={handleChange("bedroomNumber")}
              placeholder="VD: 3"
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="toiletNumber">
              Số phòng tắm / WC
            </Label>
            <Input
              id="toiletNumber"
              type="number"
              min={0}
              value={form.toiletNumber}
              onChange={handleChange("toiletNumber")}
              placeholder="VD: 2"
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="floorNumber">
              Số tầng
            </Label>
            <Input
              id="floorNumber"
              type="number"
              min={0}
              value={form.floorNumber}
              onChange={handleChange("floorNumber")}
              placeholder="VD: 3"
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls}>Chỗ đậu xe</Label>
            <NativeSelect
              value={form.parking}
              onChange={(v) => setForm((prev) => ({ ...prev, parking: v as ParkingValue }))}
              selectClassName={selectCls}
            >
              <option value="">Không rõ</option>
              <option value="true">Có</option>
              <option value="false">Không</option>
            </NativeSelect>
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="yearBuilt">
              Năm xây dựng
            </Label>
            <Input
              id="yearBuilt"
              type="number"
              min={1900}
              max={2100}
              value={form.yearBuilt}
              onChange={handleChange("yearBuilt")}
              placeholder="VD: 2019"
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="status">
              Trạng thái *
            </Label>
            <NativeSelect
              id="status"
              value={form.status}
              onChange={(v) => setForm((prev) => ({ ...prev, status: v as StatusValue }))}
              selectClassName={selectCls}
            >
              <option value="ACTIVE">Đang đăng</option>
              <option value="INACTIVE">Ngừng đăng</option>
            </NativeSelect>
          </div>
        </div>
      </section>

      {/* Thông tin cấu trúc & pháp lý */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white">Thông tin cấu trúc & pháp lý</h2>
          <p className={helperCls}>Cập nhật thông tin về cấu trúc nhà và tình trạng pháp lý.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="orientation">
              Hướng nhà
            </Label>
            <Input
              id="orientation"
              value={form.orientation}
              onChange={handleChange("orientation")}
              placeholder="VD: Đông Nam"
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="frontage">
              Mặt tiền (m)
            </Label>
            <Input
              id="frontage"
              type="number"
              min={0}
              step="0.1"
              value={form.frontage}
              onChange={handleChange("frontage")}
              placeholder="VD: 5.5"
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="roadWidth">
              Đường vào (m)
            </Label>
            <Input
              id="roadWidth"
              type="number"
              min={0}
              step="0.1"
              value={form.roadWidth}
              onChange={handleChange("roadWidth")}
              placeholder="VD: 6"
              className={inputCls}
            />
          </div>

          {/* ✅ furnitureStatus -> select (giống file create) */}
          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="furnitureStatus">
              Tình trạng nội thất
            </Label>
            <NativeSelect
              id="furnitureStatus"
              value={form.furnitureStatus}
              onChange={(v) =>
                setForm((prev) => ({ ...prev, furnitureStatus: v as FurnitureStatusValue }))
              }
              selectClassName={selectCls}
            >
              <option value="">Không rõ</option>
              {furnitureStatusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </NativeSelect>
          </div>

          {/* ✅ legalStatus -> select (giống file create) */}
          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="legalStatus">
              Tình trạng pháp lý
            </Label>
            <NativeSelect
              id="legalStatus"
              value={form.legalStatus}
              onChange={(v) => setForm((prev) => ({ ...prev, legalStatus: v as LegalStatusValue }))}
              selectClassName={selectCls}
            >
              <option value="">Không rõ</option>
              {legalStatusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
      </section>

      {/* Thông tin vị trí */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white">Thông tin vị trí</h2>
          <p className={helperCls}>Cập nhật địa chỉ và tọa độ GPS (nếu có).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <Label className={labelCls} htmlFor="location">
              Địa chỉ
            </Label>
            <Input
              id="location"
              value={form.location}
              onChange={handleChange("location")}
              placeholder="VD: 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM"
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="lat">
              Vĩ độ (Latitude)
            </Label>
            <Input
              id="lat"
              type="number"
              step="0.000001"
              value={form.lat}
              onChange={handleChange("lat")}
              placeholder="VD: 10.762622"
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={labelCls} htmlFor="lon">
              Kinh độ (Longitude)
            </Label>
            <Input
              id="lon"
              type="number"
              step="0.000001"
              value={form.lon}
              onChange={handleChange("lon")}
              placeholder="VD: 106.660172"
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#262626]">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
          className="border-[#262626] text-white hover:bg-white/5 bg-transparent h-11 rounded-lg"
        >
          Hủy
        </Button>

        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-lg px-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </div>
    </form>
  );
}
