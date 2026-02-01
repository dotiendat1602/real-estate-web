"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import {
  LeadListItem,
  LeadStatus,
} from "@/types/interfaces/api/inquiry.interface";
import { InquiryDetailDialog } from "./inquiry-detail-dialog";
import { UpdateStatusDialog } from "./update-status-dialog";

interface MyInquiriesTableProps {
  data: LeadListItem[];
  isLoading: boolean;
  pagination: { pageIndex: number; pageSize: number; total: number };
  onPaginationChange: (page: number) => void;
}

function formatDate(d?: string | Date | null) {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "-";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const HH = String(dt.getHours()).padStart(2, "0");
  const MM = String(dt.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
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

function statusPillClass(status: LeadStatus) {
  switch (status) {
    case LeadStatus.NEW:
      return "bg-blue-600/10 border-blue-600/25 text-blue-200";
    case LeadStatus.CONTACTED:
      return "bg-cyan-600/10 border-cyan-600/25 text-cyan-200";
    case LeadStatus.FOLLOW_UP:
      return "bg-yellow-600/10 border-yellow-600/25 text-yellow-200";
    case LeadStatus.NEGOTIATION:
      return "bg-orange-600/10 border-orange-600/25 text-orange-200";
    case LeadStatus.CONVERTED:
      return "bg-green-600/10 border-green-600/25 text-green-200";
    case LeadStatus.LOST:
      return "bg-red-600/10 border-red-600/25 text-red-200";
    case LeadStatus.ARCHIVED:
      return "bg-white/5 border-[#262626] text-white/70";
    default:
      return "bg-white/5 border-[#262626] text-white/70";
  }
}

export function MyInquiriesTable({
  data,
  isLoading,
  pagination,
  onPaginationChange,
}: MyInquiriesTableProps) {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadListItem | null>(null);

  const handleViewDetail = (lead: LeadListItem) => {
    setSelectedLead(lead);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = (lead: LeadListItem) => {
    setSelectedLead(lead);
    setStatusDialogOpen(true);
  };

  const totalPages = Math.max(
    1,
    Math.ceil(pagination.total / pagination.pageSize)
  );

  const handlePageChange = (newPage: number) => {
    onPaginationChange(newPage);
  };

  if (isLoading) {
    return (
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-white/60">Loading...</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-8">
        <div className="text-center py-12">
          <p className="text-white/60 text-lg">No inquiries found</p>
          <p className="text-white/40 text-sm mt-2">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-[#262626]">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white/80">
                  Post
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white/80">
                  Contact Info
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white/80">
                  Message
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white/80">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white/80">
                  Created At
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-white/80">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-[#262626] hover:bg-white/[0.02] transition"
                >
                  <td className="py-4 px-6">
                    <div className="max-w-[200px]">
                      <div className="text-white font-medium line-clamp-2">
                        {lead.post.postTitle}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      {lead.name && (
                        <div className="text-white">{lead.name}</div>
                      )}
                      {lead.email && (
                        <div className="text-white/60">{lead.email}</div>
                      )}
                      {lead.phone && (
                        <div className="text-white/60">{lead.phone}</div>
                      )}
                      {!lead.name && !lead.email && !lead.phone && (
                        <div className="text-white/40">-</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="max-w-[250px] text-sm text-white/60 line-clamp-2">
                      {lead.message || "-"}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleUpdateStatus(lead)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusPillClass(
                        lead.status
                      )} hover:opacity-80 transition`}
                    >
                      {STATUS_LABELS[lead.status]}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-sm text-white/60">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetail(lead)}
                      className="text-white/60 hover:text-white hover:bg-white/5"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#262626]">
          <div className="text-sm text-white/60">
            Showing {(pagination.pageIndex - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(
              pagination.pageIndex * pagination.pageSize,
              pagination.total
            )}{" "}
            of {pagination.total} inquiries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.pageIndex === 1}
              onClick={() => handlePageChange(pagination.pageIndex - 1)}
              className="border-[#262626] bg-transparent text-white hover:bg-white/5 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="text-sm text-white/60 px-3">
              Page {pagination.pageIndex} of {totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={pagination.pageIndex >= totalPages}
              onClick={() => handlePageChange(pagination.pageIndex + 1)}
              className="border-[#262626] bg-transparent text-white hover:bg-white/5 disabled:opacity-40"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {selectedLead && (
        <>
          <InquiryDetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            leadId={selectedLead.id}
          />
          <UpdateStatusDialog
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            lead={selectedLead}
          />
        </>
      )}
    </>
  );
}
