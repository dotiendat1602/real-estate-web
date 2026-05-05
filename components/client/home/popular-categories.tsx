"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

import { withLocalePath } from "@/lib/utils/i18n";
import { useCategoriesProperty } from "@/hooks/categories-regions/useCategoryProperty";

const copy = {
  en: {
    title: "Popular categories",
    intro: "Browse active categories managed from the admin panel.",
    viewAll: "View all properties",
    detail: "View listings",
    empty: "No property categories are available yet.",
  },
  vi: {
    title: "Danh mục phổ biến",
    intro:
      "Khám phá các danh mục bất động sản đang được quản trị trong hệ thống.",
    viewAll: "Xem tất cả bất động sản",
    detail: "Xem tin đăng",
    empty: "Chưa có danh mục bất động sản để hiển thị.",
  },
};

export default function PopularCategories() {
  const locale = useLocale();
  const text = locale === "vi" ? copy.vi : copy.en;
  const categoriesQ = useCategoriesProperty({
    pageIndex: 1,
    pageSize: 6,
    sortKey: "categoryName",
    sortOrder: "asc",
  });
  const categories = categoriesQ.data?.data ?? [];

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-start justify-between gap-4">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-4xl font-bold text-zinc-950 dark:text-white">
              {text.title}
            </h2>
            <p className="text-zinc-600 dark:text-white/60">{text.intro}</p>
          </div>

          <Link
            href={withLocalePath("/sale", locale)}
            prefetch={false}
            className="hidden items-center gap-2 rounded-lg border border-zinc-200 px-6 py-3 text-zinc-800 transition-colors hover:bg-zinc-100 md:flex dark:border-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
          >
            {text.viewAll}
          </Link>
        </div>

        {categoriesQ.isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-44 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-zinc-600 dark:border-[#1a1a1a] dark:bg-[#141414] dark:text-white/60">
            {text.empty}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none"
              >
                <h3 className="text-2xl font-bold text-zinc-950 dark:text-white">
                  {category.categoryName}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-white/60">
                  {category.categoryDescription || text.intro}
                </p>

                <Link
                  href={`${withLocalePath("/sale", locale)}?categoryId=${category.id}`}
                  prefetch={false}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-950 transition-colors hover:text-purple-600 dark:text-white dark:hover:text-purple-400"
                >
                  {text.detail}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
