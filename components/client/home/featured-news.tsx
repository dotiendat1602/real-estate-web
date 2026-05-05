"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { useLocale } from "next-intl";

import { NewsStatus, type NewsArticleData } from "@/types/interfaces/api/news";
import { withLocalePath } from "@/lib/utils/i18n";
import { useNewsArticles } from "@/hooks/news/useNewsArticles";

const copy = {
  en: {
    title: "Featured news",
    intro:
      "Market notes, buying guidance, and local updates from published articles.",
    viewAll: "View all news",
    readMore: "Read article",
    empty: "No published news is available yet.",
    imageAlt: "Article cover",
  },
  vi: {
    title: "Tin nổi bật",
    intro:
      "Góc nhìn thị trường, hướng dẫn mua bán và cập nhật khu vực từ các bài viết đã xuất bản.",
    viewAll: "Xem tất cả tin tức",
    readMore: "Đọc bài viết",
    empty: "Chưa có tin tức đã xuất bản để hiển thị.",
    imageAlt: "Ảnh bài viết",
  },
};

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function sortFeaturedFirst(items: NewsArticleData[]) {
  return [...items].sort((left, right) => {
    if (left.isFeatured !== right.isFeatured) return left.isFeatured ? -1 : 1;
    return (
      new Date(right.publishedAt ?? right.createdAt).getTime() -
      new Date(left.publishedAt ?? left.createdAt).getTime()
    );
  });
}

export default function FeaturedNews() {
  const locale = useLocale();
  const text = locale === "vi" ? copy.vi : copy.en;
  const articlesQ = useNewsArticles({
    pageIndex: 1,
    pageSize: 4,
    status: NewsStatus.PUBLISHED,
    sortKey: "publishedAt",
    sortOrder: "desc",
  });

  const articles = sortFeaturedFirst(articlesQ.data?.data ?? []);
  const lead = articles[0];
  const sideItems = articles.slice(1, 4);

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
            href={withLocalePath("/news", locale)}
            prefetch={false}
            className="hidden items-center gap-2 rounded-lg border border-zinc-200 px-6 py-3 text-zinc-800 transition-colors hover:bg-zinc-100 md:inline-flex dark:border-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
          >
            {text.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {articlesQ.isLoading ? (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="h-[430px] rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[132px] rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none"
                />
              ))}
            </div>
          </div>
        ) : !lead ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-10 text-zinc-600 dark:border-[#1a1a1a] dark:bg-[#141414] dark:text-white/60">
            {text.empty}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none">
              <Link
                href={withLocalePath(`/news/${lead.id}`, locale)}
                prefetch={false}
                className="block"
              >
                <div className="relative h-72 bg-zinc-100 dark:bg-[#0a0a0a]">
                  {lead.coverImageUrl ? (
                    <Image
                      src={lead.coverImageUrl}
                      alt={lead.title}
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-400 dark:text-white/40">
                      {text.imageAlt}
                    </div>
                  )}
                </div>
              </Link>

              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-white/50">
                  <span className="rounded-full bg-purple-600 px-3 py-1 font-medium text-white">
                    {lead.topic?.name ?? "News"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(lead.publishedAt ?? lead.createdAt)}
                  </span>
                  {lead.readMin ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-4 w-4" />
                      {lead.readMin} min
                    </span>
                  ) : null}
                </div>

                <div>
                  <h3 className="line-clamp-2 text-2xl font-bold text-zinc-950 dark:text-white">
                    {lead.title}
                  </h3>
                  {lead.excerpt ? (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-white/60">
                      {lead.excerpt}
                    </p>
                  ) : null}
                </div>

                <Link
                  href={withLocalePath(`/news/${lead.id}`, locale)}
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-200"
                >
                  {text.readMore}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>

            <div className="space-y-4">
              {sideItems.map((article) => (
                <Link
                  key={article.id}
                  href={withLocalePath(`/news/${article.id}`, locale)}
                  prefetch={false}
                  className="grid grid-cols-[120px_1fr] gap-4 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-purple-500/50 hover:shadow-md dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none dark:hover:border-purple-600/50"
                >
                  <div className="relative h-[108px] overflow-hidden rounded-lg bg-zinc-100 dark:bg-[#0a0a0a]">
                    {article.coverImageUrl ? (
                      <Image
                        src={article.coverImageUrl}
                        alt={article.title}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 py-1">
                    <div className="mb-2 text-xs text-zinc-500 dark:text-white/50">
                      {article.topic?.name ?? "News"} ·{" "}
                      {formatDate(article.publishedAt ?? article.createdAt)}
                    </div>
                    <h3 className="line-clamp-2 font-semibold text-zinc-950 dark:text-white">
                      {article.title}
                    </h3>
                    {article.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-white/55">
                        {article.excerpt}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
