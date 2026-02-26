"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportListQuery, ReportStatus } from "@/types/interfaces/api/post";
import { useReports, useUpdateReport } from "@/hooks/post/usePost";
import { ReportGroup } from "./report-group";
import { ToastContainer, useToast } from "@/components/ui/toast";

interface ReportsTableProps {
  query: ReportListQuery;
  onChangeQuery: (partial: Partial<ReportListQuery>) => void;
}

export function ReportsTable({ query, onChangeQuery }: ReportsTableProps) {
  const { data, isLoading, isError } = useReports(query);

  const { mutateAsync: updateReportAsync, isPending: isUpdating } = useUpdateReport();

  const toast = useToast();

  const reports = data?.data ?? [];
  const totalItems = data?.totalItems ?? 0;
  const pageIndex = data?.pageIndex ?? query.pageIndex ?? 1;
  const totalPages = data?.totalPages ?? 1;

  // Group reports by postId
  const groupedReports = useMemo(() => {
    const groups = new Map<number, typeof reports>();

    reports.forEach((report) => {
      const existing = groups.get(report.postId) || [];
      groups.set(report.postId, [...existing, report]);
    });

    return Array.from(groups.entries()).map(([postId, reports]) => ({
      postId,
      reports: reports.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }));
  }, [reports]);

  const handlePrevPage = () => {
    if (pageIndex <= 1) return;
    onChangeQuery({ pageIndex: pageIndex - 1 });
  };

  const handleNextPage = () => {
    if (pageIndex >= totalPages) return;
    onChangeQuery({ pageIndex: pageIndex + 1 });
  };

  const handleUpdateReportStatus = async (reportId: number, status: ReportStatus) => {
    try {
      await updateReportAsync({ reportId, data: { status } });
      toast.success("Thành công", "Cập nhật trạng thái báo cáo thành công");
    } catch (e: any) {
      toast.error("Thất bại", e?.message ?? "Không thể cập nhật trạng thái báo cáo");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Không thể tải danh sách báo cáo</p>

        {/* Toasts */}
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </div>
    );
  }

  if (groupedReports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không có báo cáo nào</p>

        {/* Toasts */}
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toasts */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      {/* Groups */}
      {groupedReports.map(({ postId, reports }) => (
        <ReportGroup
          key={postId}
          postId={postId}
          reports={reports}
          onUpdateStatus={handleUpdateReportStatus}
          isUpdating={isUpdating}
        />
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Trang {pageIndex} / {totalPages} • Tổng {totalItems} báo cáo
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrevPage} disabled={pageIndex <= 1}>
              Trước
            </Button>
            <Button variant="outline" onClick={handleNextPage} disabled={pageIndex >= totalPages}>
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
