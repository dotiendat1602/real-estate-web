"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";

import Pagination from "@/components/ui/pagination";
import { ToastContainer, useToast } from "@/components/ui/toast";
import { useReports, useUpdateReport } from "@/hooks/post/usePost";
import {
  ReportStatus,
  type ReportListQuery,
} from "@/types/interfaces/api/post";
import { ReportGroup } from "./report-group";

interface ReportsTableProps {
  query: ReportListQuery;
  onChangeQuery: (partial: Partial<ReportListQuery>) => void;
}

export function ReportsTable({ query, onChangeQuery }: ReportsTableProps) {
  const { data, isLoading, isError } = useReports(query);
  const { mutateAsync: updateReportAsync, isPending: isUpdating } =
    useUpdateReport();
  const toast = useToast();

  const reports = useMemo(() => data?.data ?? [], [data?.data]);
  const totalItems = data?.totalItems ?? 0;
  const pageIndex = data?.pageIndex ?? query.pageIndex ?? 1;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const groupedReports = useMemo(() => {
    const groups = new Map<number, typeof reports>();

    reports.forEach((report) => {
      const existing = groups.get(report.postId) || [];
      groups.set(report.postId, [...existing, report]);
    });

    return Array.from(groups.entries()).map(([postId, reports]) => ({
      postId,
      reports: reports.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }));
  }, [reports]);

  const handleUpdateReportStatus = async (
    reportId: number,
    status: ReportStatus
  ) => {
    try {
      await updateReportAsync({ reportId, data: { status } });
      toast.success(
        "Thành công",
        "Cập nhật trạng thái báo cáo thành công"
      );
    } catch (error: any) {
      toast.error(
        "Thất bại",
        error?.message ?? "Không thể cập nhật trạng thái báo cáo"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Không thể tải danh sách báo cáo</p>
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </div>
    );
  }

  if (groupedReports.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Không có báo cáo nào</p>
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      {groupedReports.map(({ postId, reports }) => (
        <ReportGroup
          key={postId}
          postId={postId}
          reports={reports}
          onUpdateStatus={handleUpdateReportStatus}
          isUpdating={isUpdating}
        />
      ))}

      <Pagination
        currentPage={pageIndex}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={query.pageSize ?? 10}
        onPageChange={(page) => onChangeQuery({ pageIndex: page })}
        onPageSizeChange={(pageSize) =>
          onChangeQuery({ pageIndex: 1, pageSize })
        }
        itemLabel="báo cáo"
      />
    </div>
  );
}
