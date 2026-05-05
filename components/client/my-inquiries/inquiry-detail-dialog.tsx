"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeadDetail } from "@/hooks/inquiry/useInquiry";
import { LeadStatus } from "@/types/interfaces/api/inquiry.interface";

interface InquiryDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: number;
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: "Mới",
  [LeadStatus.CONTACTED]: "Đã liên hệ",
  [LeadStatus.FOLLOW_UP]: "Đang theo dõi",
  [LeadStatus.NEGOTIATION]: "Đang thương lượng",
  [LeadStatus.CONVERTED]: "Đã chuyển đổi",
  [LeadStatus.LOST]: "Mất",
  [LeadStatus.ARCHIVED]: "Lưu trữ",
};

function formatDate(d?: string | Date | null) {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "-";
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dt);
}

function formatPrice(price?: number) {
  if (typeof price !== "number") return "-";
  return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
}

export function InquiryDetailDialog({
  open,
  onOpenChange,
  leadId,
}: InquiryDetailDialogProps) {
  const { data: lead, isLoading } = useLeadDetail(leadId, { enabled: open });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto border-zinc-200 bg-white text-zinc-950 dark:border-[#262626] dark:bg-[#141414] dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Inquiry Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-full bg-zinc-100 dark:bg-white/5" />
            <Skeleton className="h-20 w-full bg-zinc-100 dark:bg-white/5" />
            <Skeleton className="h-20 w-full bg-zinc-100 dark:bg-white/5" />
          </div>
        ) : lead ? (
          <div className="space-y-6 py-4">
            {/* Post Information */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-[#262626] dark:bg-white/5">
              <h3 className="mb-3 text-lg font-semibold text-purple-700 dark:text-purple-400">
                Post Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-sm text-zinc-500 dark:text-white/60">Title:</span>
                  <span className="ml-4 flex-1 text-right font-medium text-zinc-950 dark:text-white">
                    {lead.post.postTitle}
                  </span>
                </div>
                {lead.post.property && (
                  <>
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-zinc-500 dark:text-white/60">Property:</span>
                      <span className="ml-4 flex-1 text-right text-zinc-950 dark:text-white">
                        {lead.post.property.title}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-zinc-500 dark:text-white/60">Price:</span>
                      <span className="ml-4 flex-1 text-right text-zinc-950 dark:text-white">
                        {formatPrice(lead.post.property.price)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-zinc-500 dark:text-white/60">Location:</span>
                      <span className="ml-4 flex-1 text-right text-zinc-950 dark:text-white">
                        {lead.post.property.location}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-[#262626] dark:bg-white/5">
              <h3 className="mb-3 text-lg font-semibold text-purple-700 dark:text-purple-400">
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-sm text-zinc-500 dark:text-white/60">Name:</span>
                  <span className="ml-4 flex-1 text-right text-zinc-950 dark:text-white">
                    {lead.name || "-"}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-sm text-zinc-500 dark:text-white/60">Email:</span>
                  <span className="ml-4 flex-1 text-right text-zinc-950 dark:text-white">
                    {lead.email || "-"}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-sm text-zinc-500 dark:text-white/60">Phone:</span>
                  <span className="ml-4 flex-1 text-right text-zinc-950 dark:text-white">
                    {lead.phone || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-[#262626] dark:bg-white/5">
              <h3 className="mb-3 text-lg font-semibold text-purple-700 dark:text-purple-400">
                Message
              </h3>
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-white/80">
                {lead.message || "No message provided"}
              </p>
            </div>

            {/* Note (Agent) */}
            {lead.note && (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-[#262626] dark:bg-white/5">
                <h3 className="mb-3 text-lg font-semibold text-purple-700 dark:text-purple-400">
                  Internal Note
                </h3>
                <p className="whitespace-pre-wrap text-zinc-700 dark:text-white/80">{lead.note}</p>
              </div>
            )}

            {/* Status & Agent */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-[#262626] dark:bg-white/5">
              <h3 className="mb-3 text-lg font-semibold text-purple-700 dark:text-purple-400">
                Status & Assignment
              </h3>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-sm text-zinc-500 dark:text-white/60">Status:</span>
                  <span className="ml-4 flex-1 text-right font-medium text-zinc-950 dark:text-white">
                    {STATUS_LABELS[lead.status]}
                  </span>
                </div>
                {lead.agent && (
                  <>
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-zinc-500 dark:text-white/60">
                        Assigned Agent:
                      </span>
                      <span className="ml-4 flex-1 text-right text-zinc-950 dark:text-white">
                        {lead.agent.name}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-zinc-500 dark:text-white/60">
                        Agent Email:
                      </span>
                      <span className="ml-4 flex-1 text-right text-zinc-950 dark:text-white">
                        {lead.agent.email}
                      </span>
                    </div>
                    {lead.agent.phone && (
                      <div className="flex items-start justify-between">
                        <span className="text-sm text-zinc-500 dark:text-white/60">
                          Agent Phone:
                        </span>
                        <span className="ml-4 flex-1 text-right text-zinc-950 dark:text-white">
                          {lead.agent.phone}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-[#262626] dark:bg-white/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-zinc-500 dark:text-white/60">Created:</span>
                  <div className="mt-1 text-zinc-950 dark:text-white">
                    {formatDate(lead.createdAt)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-zinc-500 dark:text-white/60">Last Updated:</span>
                  <div className="mt-1 text-zinc-950 dark:text-white">
                    {formatDate(lead.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-zinc-500 dark:text-white/60">
            Failed to load inquiry details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
