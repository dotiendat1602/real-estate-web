"use client";

import { useEffect, useState } from "react";
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

import { useUpdateLead } from "@/hooks/inquiry/useInquiry";
import {
  LeadListItem,
  LeadStatus,
} from "@/types/interfaces/api/inquiry.interface";
import { useToast } from "@/components/ui/toast";
import { NativeSelect } from "@/components/ui/select";

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: LeadListItem;
}

const STATUS_OPTIONS = [
  { value: LeadStatus.NEW, label: "Mới" },
  { value: LeadStatus.CONTACTED, label: "Đã liên hệ" },
  { value: LeadStatus.FOLLOW_UP, label: "Đang theo dõi" },
  { value: LeadStatus.NEGOTIATION, label: "Đang thương lượng" },
  { value: LeadStatus.CONVERTED, label: "Đã chuyển đổi" },
  { value: LeadStatus.LOST, label: "Mất" },
  { value: LeadStatus.ARCHIVED, label: "Lưu trữ" },
];

export function UpdateStatusDialog({
  open,
  onOpenChange,
  lead,
}: UpdateStatusDialogProps) {
  const toast = useToast(); // <-- hook custom của bạn
  const updateMutation = useUpdateLead();

  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [note, setNote] = useState(lead.note || "");

  // Reset lại form khi mở dialog / đổi lead
  useEffect(() => {
    if (!open) return;
    setStatus(lead.status);
    setNote(lead.note || "");
  }, [open, lead.id, lead.status, lead.note]);

  const handleSubmit = async () => {
    try {
      await updateMutation.mutateAsync({
        leadId: lead.id,
        data: { status, note: note.trim() || undefined },
      });

      toast.success("Success", "Inquiry status updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to update status:", error);

      toast.error(
        "Error",
        error?.response?.data?.message || "Failed to update inquiry status"
      );
    }
  };

  const isPending = updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-[#262626] text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Update Inquiry Status
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Update the status and add notes for this inquiry
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-white/80">
              Status
            </Label>

            <NativeSelect
              value={status}
              onChange={(v) => setStatus(v as LeadStatus)}
              disabled={isPending}
              placeholder="Select status"
              selectClassName="bg-[#0a0a0a] border-[#262626] text-white focus-visible:ring-purple-600/60"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#141414]">
                  {opt.label}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-white/80">
              Internal Note (Optional)
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add internal notes about this inquiry..."
              disabled={isPending}
              className="bg-[#0a0a0a] border-[#262626] text-white min-h-[120px] disabled:opacity-60"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="
              border border-white/20
              text-white/80
              bg-transparent
              hover:bg-white/10
              hover:text-white
              disabled:opacity-50
            "
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isPending ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
