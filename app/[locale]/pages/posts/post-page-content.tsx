"use client";

import { Bell, Globe } from "lucide-react";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { PostFilters } from "@/components/posts/post-filters";
import { PostTable } from "@/components/posts/post-table";
import { useState } from "react";
import { PostListQuery } from "@/types/interfaces/api/post";
import { PostStatus } from "@/types/enums/post";

const STATUS_TABS: { label: string; value: PostStatus }[] = [
  { label: "Nháp", value: PostStatus.DRAFT },
  { label: "Chờ duyệt", value: PostStatus.PENDING },
  { label: "Đã duyệt", value: PostStatus.APPROVED },
  { label: "Từ chối", value: PostStatus.REJECTED },
  { label: "Đã lưu trữ", value: PostStatus.ARCHIVED },
];

export default function PostPageContent() {
  const [query, setQuery] = useState<PostListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "createdAt",
    sortOrder: "desc",
    status: PostStatus.PENDING,
  });

  const handleChangeQuery = (partial: Partial<PostListQuery>) => {
    setQuery((prev) => ({
      ...prev,
      ...partial,
      // khi đổi filter search/type/status thì về trang 1
      pageIndex:
        partial.search !== undefined ||
          partial.status !== undefined ||
          partial.type !== undefined
          ? 1
          : partial.pageIndex ?? prev.pageIndex,
    }));
  };

  const handleChangeStatusTab = (status: PostStatus) => {
    handleChangeQuery({ status });
  };

  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Duyệt bài</h1>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý và phê duyệt các tin đăng bất động sản của người dùng
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
        <div className="p-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Danh sách bài đăng
              </h2>
            </div>

            {/* Tabs theo PostStatus */}
            <div className="mb-6 border-b border-gray-200 flex gap-2">
              {STATUS_TABS.map((tab) => {
                const isActive = query.status === tab.value;

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

            <PostFilters query={query} onChangeQuery={handleChangeQuery} />
            <PostTable query={query} onChangeQuery={handleChangeQuery} />
          </div>
        </div>
      </main>
    </ProtectedLayout>
  );
}
