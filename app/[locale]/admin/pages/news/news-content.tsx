"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ArticlesSection } from "@/components/admin/news/articles-section";
import { TopicsSection } from "@/components/admin/news/topics-section";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

export default function NewsPageContent() {
  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        <AdminPageHeader
          title="Quản lý tin tức"
          description="Quản lý chủ đề và bài viết tin tức bất động sản"
        />

        <div className="space-y-8 p-8">
          <TopicsSection />
          <ArticlesSection />
        </div>
      </main>
    </ProtectedLayout>
  );
}
