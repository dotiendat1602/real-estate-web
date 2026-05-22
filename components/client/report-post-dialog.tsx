// d:\Real-estate\real-estate-web\components\client\ReportDialog.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
  isLoading?: boolean;
}

const REPORT_REASONS = [
  "Thông tin không chính xác",
  "Hình ảnh không phù hợp",
  "Giá cả không hợp lý",
  "Tin đăng lừa đảo",
  "Nội dung vi phạm",
  "Trùng lặp tin đăng",
  "Khác",
];

export function ReportDialog({ open, onOpenChange, onSubmit, isLoading }: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = React.useState<string>("");
  const [customReason, setCustomReason] = React.useState<string>("");

  const handleSubmit = () => {
    const finalReason = selectedReason === "Khác"
      ? customReason.trim()
      : selectedReason;

    if (!finalReason) return;

    onSubmit(finalReason);
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedReason("");
      setCustomReason("");
      onOpenChange(false);
    }
  };

  const isValid = selectedReason && (selectedReason !== "Khác" || customReason.trim());

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-zinc-200 bg-white text-zinc-950 sm:max-w-[500px] dark:border-[#262626] dark:bg-[#141414] dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-zinc-950 dark:text-white">Báo cáo tin đăng</DialogTitle>
          <DialogDescription className="text-zinc-600 dark:text-white/60">
            Vui lòng chọn lý do báo cáo tin đăng này. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label className="text-zinc-800 dark:text-white">Lý do báo cáo</Label>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedReason === reason
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-500/10"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-white/20"
                    }`}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-purple-500 accent-purple-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-zinc-700 dark:text-white/90">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === "Khác" && (
            <div className="space-y-2">
              <Label htmlFor="custom-reason" className="text-zinc-800 dark:text-white">
                Chi tiết lý do
              </Label>
              <Textarea
                id="custom-reason"
                placeholder="Vui lòng mô tả chi tiết lý do báo cáo..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="min-h-[100px] border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-400 focus:border-purple-500 dark:border-[#262626] dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-white/40"
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="border-zinc-200 bg-transparent text-zinc-700 hover:bg-zinc-100 dark:border-[#262626] dark:text-white dark:hover:bg-white/5"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang gửi...
              </>
            ) : (
              "Gửi báo cáo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
