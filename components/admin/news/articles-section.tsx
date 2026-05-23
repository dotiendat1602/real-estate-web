"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select";
import { useNewsArticles } from "@/hooks/news/useNewsArticles";
import { useNewsTopics } from "@/hooks/news/useNewsTopics";
import { ArticleListQuery, NewsStatus } from "@/types/interfaces/api/news";
import { ArticleTable } from "./article-table";
import { CreateArticleModal } from "./create-article-modal";

export function ArticlesSection() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [query, setQuery] = React.useState<ArticleListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "createdAt",
    sortOrder: "desc",
  });

  const { data: topics } = useNewsTopics();
  const articlesQuery = useNewsArticles(query);

  const handleSearch = (search: string) => {
    setQuery((prev) => ({ ...prev, search: search || undefined, pageIndex: 1 }));
  };

  const handleTopicFilter = (topicId: string) => {
    setQuery((prev) => ({
      ...prev,
      topicId: topicId === "all" ? undefined : Number(topicId),
      pageIndex: 1,
    }));
  };

  const handleStatusFilter = (status: string) => {
    setQuery((prev) => ({
      ...prev,
      status: status === "all" ? undefined : (status as NewsStatus),
      pageIndex: 1,
    }));
  };

  const handlePageChange = (pageIndex: number, pageSize?: number) => {
    setQuery((prev) => ({ ...prev, pageIndex, pageSize: pageSize ?? prev.pageSize }));
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bài viết tin tức</h2>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý các bài viết tin tức và trạng thái xuất bản
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo bài viết
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Tìm kiếm bài viết..."
          className="max-w-xs"
          onChange={(e) => handleSearch(e.target.value)}
        />

        <NativeSelect
          value={query.topicId ? String(query.topicId) : "all"}
          onChange={handleTopicFilter}
          className="w-[200px]"
          selectClassName="h-10"
        >
          <option value="all">Tất cả chủ đề</option>
          {topics?.map((topic) => (
            <option key={topic.id} value={String(topic.id)}>
              {topic.name}
            </option>
          ))}
        </NativeSelect>

        <NativeSelect
          value={query.status ?? "all"}
          onChange={handleStatusFilter}
          className="w-[180px]"
          selectClassName="h-10"
        >
          <option value="all">Tất cả</option>
          <option value={NewsStatus.DRAFT}>Nháp</option>
          <option value={NewsStatus.PUBLISHED}>Đã xuất bản</option>
        </NativeSelect>
      </div>

      <ArticleTable
        data={articlesQuery.data?.data ?? []}
        isLoading={articlesQuery.isLoading}
        pagination={{
          pageIndex: query.pageIndex ?? 1,
          pageSize: query.pageSize ?? 10,
          total: articlesQuery.data?.totalItems ?? 0,
        }}
        onPaginationChange={handlePageChange}
      />

      <CreateArticleModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </section>
  );
}
