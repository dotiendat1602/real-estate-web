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
      <DialogContent className="bg-[#141414] border-[#262626] text-white max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Inquiry Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-full bg-white/5" />
            <Skeleton className="h-20 w-full bg-white/5" />
            <Skeleton className="h-20 w-full bg-white/5" />
          </div>
        ) : lead ? (
          <div className="space-y-6 py-4">
            {/* Post Information */}
            <div className="bg-white/5 rounded-lg p-4 border border-[#262626]">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">
                Post Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-white/60 text-sm">Title:</span>
                  <span className="text-white font-medium text-right flex-1 ml-4">
                    {lead.post.postTitle}
                  </span>
                </div>
                {lead.post.property && (
                  <>
                    <div className="flex items-start justify-between">
                      <span className="text-white/60 text-sm">Property:</span>
                      <span className="text-white text-right flex-1 ml-4">
                        {lead.post.property.title}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-white/60 text-sm">Price:</span>
                      <span className="text-white text-right flex-1 ml-4">
                        {formatPrice(lead.post.property.price)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-white/60 text-sm">Location:</span>
                      <span className="text-white text-right flex-1 ml-4">
                        {lead.post.property.location}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/5 rounded-lg p-4 border border-[#262626]">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-white/60 text-sm">Name:</span>
                  <span className="text-white text-right flex-1 ml-4">
                    {lead.name || "-"}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-white/60 text-sm">Email:</span>
                  <span className="text-white text-right flex-1 ml-4">
                    {lead.email || "-"}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-white/60 text-sm">Phone:</span>
                  <span className="text-white text-right flex-1 ml-4">
                    {lead.phone || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-white/5 rounded-lg p-4 border border-[#262626]">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">
                Message
              </h3>
              <p className="text-white/80 whitespace-pre-wrap">
                {lead.message || "No message provided"}
              </p>
            </div>

            {/* Note (Agent) */}
            {lead.note && (
              <div className="bg-white/5 rounded-lg p-4 border border-[#262626]">
                <h3 className="text-lg font-semibold mb-3 text-purple-400">
                  Internal Note
                </h3>
                <p className="text-white/80 whitespace-pre-wrap">{lead.note}</p>
              </div>
            )}

            {/* Status & Agent */}
            <div className="bg-white/5 rounded-lg p-4 border border-[#262626]">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">
                Status & Assignment
              </h3>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-white/60 text-sm">Status:</span>
                  <span className="text-white font-medium text-right flex-1 ml-4">
                    {STATUS_LABELS[lead.status]}
                  </span>
                </div>
                {lead.agent && (
                  <>
                    <div className="flex items-start justify-between">
                      <span className="text-white/60 text-sm">
                        Assigned Agent:
                      </span>
                      <span className="text-white text-right flex-1 ml-4">
                        {lead.agent.name}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-white/60 text-sm">
                        Agent Email:
                      </span>
                      <span className="text-white text-right flex-1 ml-4">
                        {lead.agent.email}
                      </span>
                    </div>
                    {lead.agent.phone && (
                      <div className="flex items-start justify-between">
                        <span className="text-white/60 text-sm">
                          Agent Phone:
                        </span>
                        <span className="text-white text-right flex-1 ml-4">
                          {lead.agent.phone}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white/5 rounded-lg p-4 border border-[#262626]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-white/60 text-sm">Created:</span>
                  <div className="text-white mt-1">
                    {formatDate(lead.createdAt)}
                  </div>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Last Updated:</span>
                  <div className="text-white mt-1">
                    {formatDate(lead.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-white/60">
            Failed to load inquiry details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
