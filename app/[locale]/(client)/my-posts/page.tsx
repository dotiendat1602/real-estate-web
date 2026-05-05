"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostListQuery } from "@/types/interfaces/api/post";
import { useMyPosts } from "@/hooks/post/usePost";
import { MyPostsFilters } from "@/components/client/my-posts/my-posts-filters";
import { MyPostsTable } from "@/components/client/my-posts/my-posts-table";
import { CreatePostDialog } from "@/components/client/my-posts/create-post-dialog";

export default function MyPostsPage() {
  const [query, setQuery] = useState<PostListQuery>({
    pageIndex: 1,
    pageSize: 10,
    sortKey: "createdAt",
    sortOrder: "desc",
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data, isLoading } = useMyPosts(query);

  const posts = data?.data ?? [];
  const pagination = {
    pageIndex: data?.pageIndex ?? query.pageIndex ?? 1,
    pageSize: query.pageSize ?? 10,
    total: data?.totalItems ?? 0,
  };

  const handleFilterChange = (newQuery: PostListQuery) => {
    setQuery((prev) => ({
      ...prev,
      ...newQuery,
      pageIndex: 1,
    }));
  };

  const handlePaginationChange = (newQuery: PostListQuery) => {
    setQuery((prev) => ({
      ...prev,
      ...newQuery,
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-[#0a0a0a] dark:text-white">
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10 space-y-6">
        {/* Header */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8 dark:border-[#262626] dark:bg-[#141414] dark:shadow-none">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-zinc-950 dark:text-white">
                Bài đăng của tôi
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-white/60">
                Quản lý các bài đăng tin bất động sản bạn đã tạo
              </p>
            </div>

            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white h-11 px-5 rounded-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tạo bài đăng mới
            </Button>
          </div>
        </section>

        {/* Content */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8 dark:border-[#262626] dark:bg-[#141414] dark:shadow-none">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-bold text-zinc-950 dark:text-white">
              Danh sách bài đăng
            </h2>
          </div>

          <MyPostsFilters onFilterChange={handleFilterChange} />

          <MyPostsTable
            data={posts}
            isLoading={isLoading}
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
          />
        </section>

        <CreatePostDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </main>
    </div>
  );
}
