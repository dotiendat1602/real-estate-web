"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/select";

import {
  AppointmentDataListItem,
  UpdateAppointmentRequest,
} from "@/types/interfaces/api/appointment";
import { AppointmentStatus } from "@/types/enums/appointment";
import { useAppointmentDetail, useUpdateAppointment } from "@/hooks/appointment/useAppointment";

interface AppointmentUpdateModalProps {
  appointmentId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}

export function UpdateAppointmentModal({
  appointmentId,
  open,
  onOpenChange,
  onUpdated,
}: AppointmentUpdateModalProps) {
  const enabled = useMemo(() => open && !!appointmentId, [open, appointmentId]);

  const { data, isLoading } = useAppointmentDetail(appointmentId ?? 0);
  const updateMutation = useUpdateAppointment();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "">("");
  const [notes, setNotes] = useState("");

  // fill form
  useEffect(() => {
    if (!open || !data) return;

    const appt: AppointmentDataListItem = data;

    // scheduledAt -> date + time
    if (appt.scheduledAt) {
      const d = new Date(appt.scheduledAt);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const mi = String(d.getMinutes()).padStart(2, "0");

      setDate(`${yyyy}-${mm}-${dd}`);
      setTime(`${hh}:${mi}`);
    } else {
      setDate("");
      setTime("");
    }

    setLocation(appt.location ?? "");
    setStatus((appt.appointmentStatus as AppointmentStatus) ?? "");
    setNotes(appt.notes ?? "");
  }, [open, data]);

  // reset khi đóng
  useEffect(() => {
    if (!open) {
      setDate("");
      setTime("");
      setLocation("");
      setStatus("");
      setNotes("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!appointmentId) return;

    const payload: UpdateAppointmentRequest = {};

    if (date) {
      const t = time || "00:00";
      const dateTime = new Date(`${date}T${t}:00`);
      payload.scheduledAt = dateTime;
    }

    if (location.trim()) payload.location = location.trim();
    if (status) payload.status = status as AppointmentStatus;
    if (notes.trim() || notes === "") payload.notes = notes.trim();

    updateMutation.mutate(
      { id: appointmentId, data: payload },
      {
        onSuccess: () => {
          if (onUpdated) onUpdated();
          onOpenChange(false);
        },
      },
    );
  };

  const isSubmitting = updateMutation.isPending;

  const renderStatusBadgeClass = (st: string) => {
    if (st === AppointmentStatus.SCHEDULED)
      return "bg-blue-50 text-blue-700 border-blue-200";
    if (st === AppointmentStatus.COMPLETED)
      return "bg-green-50 text-green-700 border-green-200";
    if (st === AppointmentStatus.RESCHEDULED)
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "";
  };

  return (
    <Dialog open={open && enabled} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cập nhật lịch hẹn xem property</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thời gian, địa điểm, trạng thái và ghi chú của lịch hẹn.
          </DialogDescription>
        </DialogHeader>

        {isLoading && !data ? (
          <div className="py-6 text-sm text-gray-500">
            Đang tải thông tin lịch hẹn...
          </div>
        ) : !data ? (
          <div className="py-6 text-sm text-red-500">
            Không tìm thấy thông tin lịch hẹn.
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-4 rounded-md border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span>
                  Property:{" "}
                  <span className="font-medium">
                    {data.post?.postTitle ?? "-"}
                  </span>
                </span>
                <Badge
                  variant="outline"
                  className={renderStatusBadgeClass(
                    data.appointmentStatus ?? "",
                  )}
                >
                  {data.appointmentStatus}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span>
                  Người mua:{" "}
                  <span className="font-medium">{data.buyer?.name}</span>{" "}
                  {data.buyer?.phone && (
                    <span className="text-gray-500">
                      ({data.buyer.phone})
                    </span>
                  )}
                </span>
                <span>
                  Thời gian hiện tại:{" "}
                  <span className="font-medium">
                    {data.scheduledAt
                      ? new Date(
                        data.scheduledAt,
                      ).toLocaleString("vi-VN")
                      : "-"}
                  </span>
                </span>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="apptDate">Ngày hẹn</Label>
                  <Input
                    id="apptDate"
                    type="date"
                    className="mt-1"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="apptTime">Giờ hẹn</Label>
                  <Input
                    id="apptTime"
                    type="time"
                    className="mt-1"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Địa điểm</Label>
                <Input
                  id="location"
                  className="mt-1"
                  placeholder="VD: Tại dự án, Văn phòng, Online..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <NativeSelect
                  id="status"
                  value={status || ""}
                  onChange={(value) =>
                    setStatus(value as AppointmentStatus | "")
                  }
                  className="mt-1 w-full"
                  selectClassName="bg-gray-50 border-gray-200"
                  placeholder="Chọn trạng thái"
                >
                  <option value="">Giữ nguyên</option>
                  <option value={AppointmentStatus.SCHEDULED}>
                    Scheduled
                  </option>
                  <option value={AppointmentStatus.COMPLETED}>
                    Completed
                  </option>
                  <option value={AppointmentStatus.RESCHEDULED}>
                    Rescheduled
                  </option>
                  {/* thêm CANCELED nếu có */}
                </NativeSelect>
              </div>

              <div>
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  className="mt-1"
                  rows={4}
                  placeholder="Nhập ghi chú cho lịch hẹn này..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !data}>
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
