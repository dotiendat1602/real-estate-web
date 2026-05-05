"use client";

import { Bell, Globe } from "lucide-react";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { useState } from "react";

import { PostFilters } from "@/components/admin/posts/post-filters";
import { PostTable } from "@/components/admin/posts/post-table";

import { ReportFilters } from "@/components/admin/reports/report-filters";
import { ReportsTable } from "@/components/admin/reports/reports-table";

import { PostListQuery } from "@/types/interfaces/api/post";
import { ReportListQuery } from "@/types/interfaces/api/post";
import { PostStatus } from "@/types/enums/post";

const STATUS_TABS: { label: string; value: PostStatus }[] = [
  { label: "Nháp", value: PostStatus.DRAFT },
  { label: "Chờ duyệt", value: PostStatus.PENDING },
  { label: "Đã duyệt", value: PostStatus.APPROVED },
  { label: "Từ chối", value: PostStatus.REJECTED },
  { label: "Đã lưu trữ", value: PostStatus.ARCHIVED },
];

export default function PostPageContent() {
  // -------------------------
  // POSTS (duyệt bài)
  // -------------------------
  const [postQuery, setPostQuery] = useState<PostListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "createdAt",
    sortOrder: "desc",
    status: PostStatus.PENDING,
  });

  const handleChangePostQuery = (partial: Partial<PostListQuery>) => {
    setPostQuery((prev) => ({
      ...prev,
      ...partial,
      // khi đổi filter search/type/status thì về trang 1
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

  const handleChangeStatusTab = (status: PostStatus) => {
    handleChangePostQuery({ status });
  };

  // -------------------------
  // REPORTS (báo cáo)
  // -------------------------
  const [reportQuery, setReportQuery] = useState<ReportListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "createdAt",
    sortOrder: "desc",
    search: undefined,
  });

  const handleChangeReportQuery = (partial: Partial<ReportListQuery>) => {
    setReportQuery((prev) => ({
      ...prev,
      ...partial,
      // đổi search => về trang 1
      pageIndex:
        partial.search !== undefined ? 1 : partial.pageIndex ?? prev.pageIndex,
    }));
  };

  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Quản lý tin đăng
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Duyệt bài đăng & xử lý báo cáo từ người dùng
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* =========================
              POSTS CARD
              ========================= */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Duyệt bài</h2>
            </div>

            {/* Tabs theo PostStatus */}
            <div className="mb-6 border-b border-gray-200 flex gap-2">
              {STATUS_TABS.map((tab) => {
                const isActive = postQuery.status === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => handleChangeStatusTab(tab.value)}
                    className={
                      "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors " +
                      (isActive
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200")
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

          {/* =========================
              REPORTS CARD
              ========================= */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
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
