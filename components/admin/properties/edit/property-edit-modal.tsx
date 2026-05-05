"use client"

import { useState } from "react"
import type { FurnitureStatusValue, LegalStatusValue, PropertyData, UpdatePropertyRequest } from "@/types/interfaces/api/property"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/select"
import { PropertyImageItem, PropertyImagesFieldAdmin } from "./property-image-field-admin"

type ParkingValue = "" | "true" | "false"
type StatusValue = "ACTIVE" | "INACTIVE"

interface PropertyEditFormProps {
  property: PropertyData
  onSubmit: (values: UpdatePropertyRequest) => void
  isSubmitting?: boolean
}

type FurnitureStatusFormValue = "" | FurnitureStatusValue;
type LegalStatusFormValue = "" | LegalStatusValue;

interface FormState {
  title: string
  price: string
  area: string
  bedroomNumber: string
  toiletNumber: string
  floorNumber: string
  parking: ParkingValue
  orientation: string
  frontage: string
  roadWidth: string
  furnitureStatus: FurnitureStatusFormValue
  legalStatus: LegalStatusFormValue
  yearBuilt: string
  lat: string
  lon: string
  location: string
  status: StatusValue
  images: PropertyImageItem[]
}

export function PropertyEditModal({ property, onSubmit, isSubmitting }: PropertyEditFormProps) {
  const [form, setForm] = useState<FormState>(() => ({
    title: property.title || "",
    price: property.price?.toString() ?? "",
    area: property.area?.toString() ?? "",
    bedroomNumber: property.bedroomNumber?.toString() ?? "",
    toiletNumber: property.toiletNumber?.toString() ?? "",
    floorNumber: property.floorNumber?.toString() ?? "",
    parking:
      property.parking == null ? "" : property.parking ? "true" : "false",
    orientation: property.orientation || "",
    frontage: property.frontage?.toString() ?? "",
    roadWidth: property.roadWidth?.toString() ?? "",
    furnitureStatus: (property.furnitureStatus ?? "") as FurnitureStatusFormValue,
    legalStatus: (property.legalStatus ?? "") as LegalStatusFormValue,
    yearBuilt: property.yearBuilt?.toString() ?? "",
    lat: property.lat?.toString() ?? "",
    lon: property.lon?.toString() ?? "",
    location: property.location || "",
    status: (property.status as StatusValue) || "ACTIVE",
    images: (property.images || []).map((img) => ({
      id: `existing-${img.id}`,
      imageUrl: img.imageUrl,
      isPrimary: img.isPrimary,
    })),
  }))

  const handleChange =
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
      }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: UpdatePropertyRequest = {
      title: form.title.trim(),
      price: form.price ? Number(form.price) : property.price,
      area: form.area ? Number(form.area) : undefined,
      bedroomNumber: form.bedroomNumber ? Number(form.bedroomNumber) : undefined,
      toiletNumber: form.toiletNumber ? Number(form.toiletNumber) : undefined,
      floorNumber: form.floorNumber ? Number(form.floorNumber) : undefined,
      parking:
        form.parking === ""
          ? undefined
          : form.parking === "true",
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
      images: form.images.map((img) => ({
        imageUrl: img.imageUrl,
        isPrimary: img.isPrimary || false,
      })),
    }

    onSubmit(payload)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-8"
    >
      {/* Hình ảnh */}
      <section className="space-y-4">
        <PropertyImagesFieldAdmin
          label="Hình ảnh"
          helper="Tải lên ảnh bất động sản. Ảnh đầu tiên sẽ là ảnh chính mặc định."
          value={form.images}
          onChange={(images) => setForm((prev) => ({ ...prev, images }))}
          max={12}
        />
      </section>

      {/* Thông tin cơ bản */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Thông tin cơ bản
          </h2>
          <p className="text-sm text-gray-500">
            Cập nhật tiêu đề, giá và các thông số chính của bất động sản.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="VD: Nhà phố 3 tầng mặt tiền rộng, trung tâm quận..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price">Giá rao bán (VND)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              value={form.price}
              onChange={handleChange("price")}
              placeholder="VD: 5500000000"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="area">Diện tích (m²)</Label>
            <Input
              id="area"
              type="number"
              min={0}
              step="0.1"
              value={form.area}
              onChange={handleChange("area")}
              placeholder="VD: 75"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bedroomNumber">Số phòng ngủ</Label>
            <Input
              id="bedroomNumber"
              type="number"
              min={0}
              value={form.bedroomNumber}
              onChange={handleChange("bedroomNumber")}
              placeholder="VD: 3"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="toiletNumber">Số phòng tắm / WC</Label>
            <Input
              id="toiletNumber"
              type="number"
              min={0}
              value={form.toiletNumber}
              onChange={handleChange("toiletNumber")}
              placeholder="VD: 2"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="floorNumber">Số tầng</Label>
            <Input
              id="floorNumber"
              type="number"
              min={0}
              value={form.floorNumber}
              onChange={handleChange("floorNumber")}
              placeholder="VD: 3"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Chỗ đậu xe</Label>
            <NativeSelect
              value={form.parking}
              onChange={(v) =>
                setForm((prev) => ({ ...prev, parking: v as ParkingValue }))
              }
            >
              <option value="">Không rõ</option>
              <option value="true">Có</option>
              <option value="false">Không</option>
            </NativeSelect>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="yearBuilt">Năm xây dựng</Label>
            <Input
              id="yearBuilt"
              type="number"
              min={1900}
              max={2100}
              value={form.yearBuilt}
              onChange={handleChange("yearBuilt")}
              placeholder="VD: 2019"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Trạng thái</Label>
            <NativeSelect
              id="status"
              value={form.status}
              onChange={(v) =>
                setForm((prev) => ({ ...prev, status: v as StatusValue }))
              }
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
          <h2 className="text-base font-semibold text-gray-900">
            Thông tin cấu trúc & pháp lý
          </h2>
          <p className="text-sm text-gray-500">
            Cập nhật mặt tiền, lộ giới, hướng, nội thất và tình trạng pháp lý.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="orientation">Hướng nhà</Label>
            <Input
              id="orientation"
              value={form.orientation}
              onChange={handleChange("orientation")}
              placeholder="VD: Đông Nam"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="frontage">Mặt tiền (m)</Label>
            <Input
              id="frontage"
              type="number"
              min={0}
              step="0.1"
              value={form.frontage}
              onChange={handleChange("frontage")}
              placeholder="VD: 5"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="roadWidth">Lộ giới (m)</Label>
            <Input
              id="roadWidth"
              type="number"
              min={0}
              step="0.1"
              value={form.roadWidth}
              onChange={handleChange("roadWidth")}
              placeholder="VD: 8"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="furnitureStatus">Tình trạng nội thất</Label>
            <NativeSelect
              id="furnitureStatus"
              value={form.furnitureStatus}
              onChange={(v) =>
                setForm((prev) => ({ ...prev, furnitureStatus: v as FurnitureStatusFormValue }))
              }
            >
              <option value="">Không rõ</option>
              <option value="UNFURNISHED">Chưa nội thất</option>
              <option value="PARTLY_FURNISHED">Nội thất cơ bản</option>
              <option value="FULLY_FURNISHED">Full nội thất</option>
            </NativeSelect>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="legalStatus">Tình trạng pháp lý</Label>
            <NativeSelect
              id="legalStatus"
              value={form.legalStatus}
              onChange={(v) =>
                setForm((prev) => ({ ...prev, legalStatus: v as LegalStatusFormValue }))
              }
            >
              <option value="">Không rõ</option>
              <option value="FREEHOLD">Sở hữu lâu dài</option>
              <option value="LEASEHOLD">Thuê/50 năm</option>
              <option value="RED_BOOK">Sổ đỏ</option>
              <option value="PINK_BOOK">Sổ hồng</option>
              <option value="OTHER">Khác</option>
            </NativeSelect>
          </div>
        </div>
      </section>

      {/* Vị trí & toạ độ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Vị trí & toạ độ
          </h2>
          <p className="text-sm text-gray-500">
            Thông tin vị trí giúp tư vấn viên và khách hàng dễ hình dung và tìm kiếm.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location">Địa chỉ chi tiết</Label>
          <Input
            id="location"
            value={form.location}
            onChange={handleChange("location")}
            placeholder="VD: 123 Lê Lợi, phường 7..."
          />
          <p className="text-xs text-gray-400">
            Thông tin phường / quận / tỉnh đang lấy từ trường quan hệ và không chỉnh ở đây.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="lat">Vĩ độ (Lat)</Label>
            <Input
              id="lat"
              type="number"
              step="0.000001"
              value={form.lat}
              onChange={handleChange("lat")}
              placeholder="VD: 10.123456"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lon">Kinh độ (Lon)</Label>
            <Input
              id="lon"
              type="number"
              step="0.000001"
              value={form.lon}
              onChange={handleChange("lon")}
              placeholder="VD: 106.654321"
            />
          </div>
        </div>
      </section>

      {/* TODO: sau này có thể thêm section edit hình ảnh, tiện ích, utilities */}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Huỷ
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  )
}
