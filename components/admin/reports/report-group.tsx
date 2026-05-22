"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Eye,
  Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { withLocalePath } from "@/lib/utils/i18n";
import {
  ReportStatus,
  type ReportPostResponse,
} from "@/types/interfaces/api/post";

interface ReportGroupProps {
  postId: number;
  postTitle?: string;
  reports: ReportPostResponse[];
  onUpdateStatus?: (
    reportId: number,
    status: ReportStatus
  ) => Promise<void> | void;
  isUpdating?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  [ReportStatus.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [ReportStatus.RESOLVED]: "bg-green-100 text-green-800 border-green-200",
  [ReportStatus.REJECTED]: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  [ReportStatus.PENDING]: "Chưa xử lý",
  [ReportStatus.RESOLVED]: "Đã xử lý",
  [ReportStatus.REJECTED]: "Từ chối",
  [ReportStatus.UNDER_REVIEWED]: "Đang xem xét",
  [ReportStatus.ACTION_TAKED]: "Đã thao tác",
};

export function ReportGroup({
  postId,
  postTitle,
  reports,
  onUpdateStatus,
  isUpdating,
}: ReportGroupProps) {
  const locale = useLocale();
  const [isExpanded, setIsExpanded] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const formatDate = (date: Date | string) => {
    const value = typeof date === "string" ? new Date(date) : date;
    return value.toLocaleDateString("vi-VN", {
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
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div
        className="flex cursor-pointer items-center justify-between bg-gray-50 p-4 transition-colors hover:bg-gray-100"
        onClick={() => setIsExpanded((value) => !value)}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>

          <AlertTriangle className="h-5 w-5 text-orange-500" />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">Bài đăng #{postId}</h3>
              <Badge
                variant="outline"
                className="border-red-200 bg-red-50 text-red-700"
              >
                {reports.length} báo cáo
              </Badge>
            </div>
            {postTitle && (
              <p className="mt-1 truncate text-sm text-gray-600">{postTitle}</p>
            )}
          </div>
        </div>

        <Link
          href={withLocalePath(`/posts/${postId}`, locale)}
          onClick={(event) => event.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer gap-2"
          >
            <Eye className="h-4 w-4" />
            Xem bài đăng
          </Button>
        </Link>
      </div>

      {isExpanded && (
        <div className="divide-y divide-gray-200">
          {reports.map((report) => {
            const rowUpdating = (isUpdating && updatingId === report.id) || false;

            return (
              <div key={report.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        Báo cáo #{report.id}
                      </span>
                      <Badge
                        variant="outline"
                        className={STATUS_COLORS[report.status] || ""}
                      >
                        {STATUS_LABELS[report.status] ?? report.status}
                      </Badge>
                    </div>

                    <p className="mb-2 text-sm text-gray-700">{report.reason}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>
                        {report.reporterId
                          ? `User ID: ${report.reporterId}`
                          : "Người dùng ẩn danh"}
                      </span>
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                  </div>

                  {report.status === ReportStatus.PENDING && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer border-green-200 text-green-600 hover:bg-green-50"
                        disabled={rowUpdating}
                        onClick={() =>
                          handleUpdate(report.id, ReportStatus.RESOLVED)
                        }
                      >
                        {rowUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý
                          </>
                        ) : (
                          "Đã xử lý"
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer border-red-200 text-red-600 hover:bg-red-50"
                        disabled={rowUpdating}
                        onClick={() =>
                          handleUpdate(report.id, ReportStatus.REJECTED)
                        }
                      >
                        {rowUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang cập nhật
                          </>
                        ) : (
                          "Từ chối"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
