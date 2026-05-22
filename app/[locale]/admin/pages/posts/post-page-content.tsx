"use client";

import { useState } from "react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PostFilters } from "@/components/admin/posts/post-filters";
import { PostTable } from "@/components/admin/posts/post-table";
import { ReportFilters } from "@/components/admin/reports/report-filters";
import { ReportsTable } from "@/components/admin/reports/reports-table";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { PostStatus } from "@/types/enums/post";
import type { PostListQuery, ReportListQuery } from "@/types/interfaces/api/post";

const STATUS_TABS: { label: string; value: PostStatus }[] = [
  { label: "Nháp", value: PostStatus.DRAFT },
  { label: "Chờ duyệt", value: PostStatus.PENDING },
  { label: "Đã duyệt", value: PostStatus.APPROVED },
  { label: "Từ chối", value: PostStatus.REJECTED },
  { label: "Đã lưu trữ", value: PostStatus.ARCHIVED },
];

export default function PostPageContent() {
  const [postQuery, setPostQuery] = useState<PostListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "createdAt",
    sortOrder: "desc",
    status: PostStatus.PENDING,
  });

  const [reportQuery, setReportQuery] = useState<ReportListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "createdAt",
    sortOrder: "desc",
  });

  const handleChangePostQuery = (partial: Partial<PostListQuery>) => {
    setPostQuery((prev) => ({
      ...prev,
      ...partial,
      pageIndex:
        partial.search !== undefined ||
        partial.status !== undefined ||
        partial.type !== undefined ||
        partial.provinceId !== undefined ||
        partial.districtId !== undefined ||
        partial.wardId !== undefined
          ? 1
          : partial.pageIndex ?? prev.pageIndex,
    }));
  };

  const handleChangeReportQuery = (partial: Partial<ReportListQuery>) => {
    setReportQuery((prev) => ({
      ...prev,
      ...partial,
      pageIndex:
        partial.search !== undefined || partial.status !== undefined
          ? 1
          : partial.pageIndex ?? prev.pageIndex,
    }));
  };

  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        <AdminPageHeader
          title="Quản lý tin đăng"
          description="Duyệt bài đăng và xử lý báo cáo từ người dùng"
        />

        <div className="space-y-6 p-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Duyệt bài</h2>
            </div>

            <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200">
              {STATUS_TABS.map((tab) => {
                const isActive = postQuery.status === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => handleChangePostQuery({ status: tab.value })}
                    className={
                      "-mb-px cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition-colors " +
                      (isActive
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-900")
                    }
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <PostFilters query={postQuery} onChangeQuery={handleChangePostQuery} />
            <PostTable query={postQuery} onChangeQuery={handleChangePostQuery} />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Báo cáo bài đăng
              </h2>
            </div>

            <ReportFilters
              query={reportQuery}
              onChangeQuery={handleChangeReportQuery}
            />
            <ReportsTable
              query={reportQuery}
              onChangeQuery={handleChangeReportQuery}
            />
          </div>
        </div>
      </main>
    </ProtectedLayout>
  );
}
