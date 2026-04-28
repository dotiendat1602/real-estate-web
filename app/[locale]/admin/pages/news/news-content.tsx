// app/[locale]/admin/pages/news/news-content.tsx
"use client";

import React from "react";
import { Bell, Globe, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { TopicsSection } from "@/components/admin/news/topics-section";
import { ArticlesSection } from "@/components/admin/news/articles-section";

export default function NewsPageContent() {
  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Quản lý tin tức
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý chủ đề và bài viết tin tức bất động sản
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Topics Section */}
          <TopicsSection />

          {/* Articles Section */}
          <ArticlesSection />
        </div>
      </main>
    </ProtectedLayout>
  );
}
