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

import { UpdateDepositRequest } from "@/types/interfaces/api/deposit";
import { useDepositDetail, useUpdateDeposit } from "@/hooks/deposit/useDeposit";

interface UpdateDepositModalProps {
  depositId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}

export function UpdateDepositModal({
  depositId,
  open,
  onOpenChange,
  onUpdated,
}: UpdateDepositModalProps) {
  const { data, isLoading } = useDepositDetail(depositId);

  const updateMutation = useUpdateDeposit();

  const [holdDate, setHoldDate] = useState("");
  const [holdTime, setHoldTime] = useState("");
  const [note, setNote] = useState("");

  // Khi mở modal + có data thì fill form
  useEffect(() => {
    if (!open || !data) return;

    // holdExpiresAt -> date + time
    if (data.holdExpiresAt) {
      const d = new Date(data.holdExpiresAt);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const mi = String(d.getMinutes()).padStart(2, "0");

      setHoldDate(`${yyyy}-${mm}-${dd}`);
      setHoldTime(`${hh}:${mi}`);
    } else {
      setHoldDate("");
      setHoldTime("");
    }

    setNote(data.note ?? "");
  }, [open, data]);

  // Đóng modal thì reset nhẹ state (optional)
  useEffect(() => {
    if (!open) {
      setHoldDate("");
      setHoldTime("");
      setNote("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!depositId) return;

    const payload: UpdateDepositRequest = {};

    // Nếu có chọn ngày thì build Date, nếu không thì bỏ trống để BE giữ nguyên / clear
    if (holdDate) {
      const time = holdTime || "00:00";
      const dateTime = new Date(`${holdDate}T${time}:00`);
      payload.holdExpiresAt = dateTime;
    }

    if (note.trim().length > 0) {
      payload.note = note.trim();
    } else {
      payload.note = "";
    }

    updateMutation.mutate(
      { id: depositId, data: payload },
      {
        onSuccess: () => {
          // react-query đã invalidate list + detail trong hook useUpdateDeposit
          if (onUpdated) onUpdated();
          onOpenChange(false);
        },
      },
    );
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cập nhật đặt cọc</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin ghi chú và thời gian hết đặt cọc cho giao dịch đặt cọc này.
          </DialogDescription>
        </DialogHeader>

        {isLoading && !data ? (
          <div className="py-6 text-sm text-gray-500">
            Đang tải thông tin đặt cọc...
          </div>
        ) : !data ? (
          <div className="py-6 text-sm text-red-500">
            Không tìm thấy thông tin đặt cọc.
          </div>
        ) : (
          <>
            {/* Info summary */}
            <div className="mb-4 rounded-md border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700 space-y-1">
              <div className="flex items-center justify-between">
                <span>
                  Mã giao dịch:{" "}
                  <span className="font-mono font-medium">
                    {data.transactionRef || "-"}
                  </span>
                </span>
                <Badge
                  variant="outline"
                  className={
                    data.status === "CONFIRMED"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : data.status === "REFUNDED"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : data.status === "CANCELLED"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : ""
                  }
                >
                  {data.status}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span>
                  Property:{" "}
                  <span className="font-medium">
                    {data.post?.property?.title ?? "-"}
                  </span>
                </span>
                <span>
                  Số tiền:{" "}
                  <span className="font-semibold">
                    {data.amount.toLocaleString("vi-VN")} VND
                  </span>
                </span>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="holdDate">Hết hạn đặt cọc - Ngày</Label>
                  <Input
                    id="holdDate"
                    type="date"
                    className="mt-1"
                    value={holdDate}
                    onChange={(e) => setHoldDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="holdTime">Hết hạn đặt cọc - Giờ</Label>
                  <Input
                    id="holdTime"
                    type="time"
                    className="mt-1"
                    value={holdTime}
                    onChange={(e) => setHoldTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="note">Ghi chú nội bộ</Label>
                <Textarea
                  id="note"
                  className="mt-1"
                  rows={4}
                  placeholder="Nhập ghi chú cho giao dịch đặt cọc này (chỉ hiển thị nội bộ)..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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
