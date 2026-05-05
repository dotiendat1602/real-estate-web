"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";

import type { PostDataListItem } from "@/types/interfaces/api/post";
import { withLocalePath } from "@/lib/utils/i18n";
import { usePublicPosts } from "@/hooks/post/usePost";
import { Card } from "@/components/ui/card";

const copy = {
  en: {
    title: "Featured properties",
    intro: "Fresh approved listings from sale and rental inventory.",
    viewAll: "View all properties",
    view: "View details",
    empty: "No approved listings are available yet.",
  },
  vi: {
    title: "Bất động sản nổi bật",
    intro: "Các tin đã duyệt mới nhất từ danh sách bán và cho thuê.",
    viewAll: "Xem tất cả bất động sản",
    view: "Xem chi tiết",
    empty: "Chưa có tin đã duyệt để hiển thị.",
  },
};

function primaryImageUrl(post: PostDataListItem) {
  const imgs = post.property?.images ?? [];
  const primary = imgs.find((item) => item.isPrimary);
  return (primary ?? imgs[0])?.imageUrl ?? null;
}

function moneyVnd(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "—";
  return `${new Intl.NumberFormat("vi-VN").format(Number(value))} VND`;
}

export default function FeaturedProperties() {
  const locale = useLocale();
  const text = locale === "vi" ? copy.vi : copy.en;
  const postsQ = usePublicPosts({
    pageIndex: 1,
    pageSize: 6,
    sortKey: "createdAt",
    sortOrder: "desc",
  });
  const posts = postsQ.data?.data ?? [];

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-start justify-between gap-4">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-zinc-950 dark:text-white">
              {text.title}
            </h2>
            <p className="max-w-2xl text-zinc-600 dark:text-white/60">
              {text.intro}
            </p>
          </div>

          <Link
            href={withLocalePath("/sale", locale)}
            prefetch={false}
            className="hidden items-center gap-2 rounded-lg border border-zinc-200 px-6 py-3 text-zinc-800 transition-colors hover:bg-zinc-100 md:inline-flex dark:border-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
          >
            {text.viewAll}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {postsQ.isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[390px] rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-10 text-zinc-600 dark:border-[#1a1a1a] dark:bg-[#141414] dark:text-white/60">
            {text.empty}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const image = primaryImageUrl(post);
              return (
                <Card
                  key={post.id}
                  className="overflow-hidden border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none"
                >
                  {image ? (
                    <div className="relative h-56 w-full">
                      <Image
                        src={image}
                        alt={post.property?.title ?? post.postTitle}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-56 w-full items-center justify-center bg-zinc-100 text-sm text-zinc-400 dark:bg-[#0a0a0a] dark:text-white/40">
                      Thumbnail
                    </div>
                  )}

                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="mb-2 line-clamp-2 text-xl font-bold text-zinc-950 dark:text-white">
                        {post.property?.title ?? post.postTitle}
                      </h3>
                      <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-white/60">
                        {post.postTitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-zinc-200 pt-4 text-center dark:border-[#1a1a1a]">
                      <div className="rounded-lg border border-zinc-200 py-2 text-xs text-zinc-700 dark:border-[#1a1a1a] dark:text-white/70">
                        {moneyVnd(post.property?.price)}
                      </div>
                      <div className="rounded-lg border border-zinc-200 py-2 text-xs text-zinc-700 dark:border-[#1a1a1a] dark:text-white/70">
                        {post.property?.area ?? "—"} m2
                      </div>
                      <div className="rounded-lg border border-zinc-200 py-2 text-xs text-zinc-700 dark:border-[#1a1a1a] dark:text-white/70">
                        {post.property?.category?.categoryName ?? "—"}
                      </div>
                    </div>

                    <Link
                      href={withLocalePath(`/posts/${post.id}`, locale)}
                      prefetch={false}
                      className="inline-flex h-10 w-full items-center justify-center rounded-md bg-purple-600 text-white hover:bg-purple-700"
                    >
                      {text.view}
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
