"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Eye, AlertTriangle, Loader2 } from "lucide-react";
import { ReportPostResponse, ReportStatus } from "@/types/interfaces/api/post";
import Link from "next/link";

interface ReportGroupProps {
  postId: number;
  postTitle?: string;
  reports: ReportPostResponse[];

  // NEW: update status handler
  onUpdateStatus?: (reportId: number, status: ReportStatus) => Promise<void> | void;

  // NEW: global updating flag from react-query mutation
  isUpdating?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  RESOLVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};

export function ReportGroup({
  postId,
  postTitle,
  reports,
  onUpdateStatus,
  isUpdating,
}: ReportGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdate = async (reportId: number, status: ReportStatus) => {
    if (!onUpdateStatus) return;

    try {
      setUpdatingId(reportId);
      await onUpdateStatus(reportId, status);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div
        className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1">
          <button className="text-gray-500 hover:text-gray-700">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          <AlertTriangle className="w-5 h-5 text-orange-500" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">Bài đăng #{postId}</h3>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {reports.length} báo cáo
              </Badge>
            </div>
            {postTitle && <p className="text-sm text-gray-600 mt-1 truncate">{postTitle}</p>}
          </div>
        </div>

        <Link
          href={`/posts/${postId}`}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
            <Eye className="w-4 h-4" />
            Xem bài đăng
          </Button>
        </Link>
      </div>

      {/* Reports List */}
      {isExpanded && (
        <div className="divide-y divide-gray-200">
          {reports.map((report) => {
            const rowUpdating = (isUpdating && updatingId === report.id) || false;

            return (
              <div key={report.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Báo cáo #{report.id}
                      </span>
                      <Badge variant="outline" className={STATUS_COLORS[report.status] || ""}>
                        {report.status === "PENDING"
                          ? "Chờ xử lý"
                          : report.status === "RESOLVED"
                            ? "Đã xử lý"
                            : "Từ chối"}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-2">{report.reason}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {report.reporterId ? `User ID: ${report.reporterId}` : "Người dùng ẩn danh"}
                      </span>
                      <span>•</span>
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {report.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:bg-green-50 border-green-200"
                          disabled={rowUpdating}
                          onClick={() => handleUpdate(report.id, ReportStatus.RESOLVED)}
                        >
                          {rowUpdating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Đang xử lý
                            </>
                          ) : (
                            "Xử lý"
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50 border-red-200"
                          disabled={rowUpdating}
                          onClick={() => handleUpdate(report.id, ReportStatus.REJECTED)}
                        >
                          {rowUpdating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Đang cập nhật
                            </>
                          ) : (
                            "Từ chối"
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
