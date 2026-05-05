"use client";

import { useLocale } from "next-intl";

import { useCategoriesProperty } from "@/hooks/categories-regions/useCategoryProperty";
import { usePublicPosts } from "@/hooks/post/usePost";

const copy = {
  en: {
    approved: "Approved listings",
    sale: "For sale",
    rent: "For rent",
    categories: "Property categories",
  },
  vi: {
    approved: "Tin đã duyệt",
    sale: "Tin bán",
    rent: "Tin thuê",
    categories: "Danh mục bất động sản",
  },
};

function formatCount(value?: number) {
  if (value === undefined) return "—";
  return new Intl.NumberFormat("vi-VN").format(value);
}

export default function Stats() {
  const locale = useLocale();
  const text = locale === "vi" ? copy.vi : copy.en;
  const saleQ = usePublicPosts({ pageIndex: 1, pageSize: 1, type: "SALE" });
  const rentQ = usePublicPosts({ pageIndex: 1, pageSize: 1, type: "RENT" });
  const categoriesQ = useCategoriesProperty({ pageIndex: 1, pageSize: 1 });
  const total = (saleQ.data?.totalItems ?? 0) + (rentQ.data?.totalItems ?? 0);

  const items = [
    { value: formatCount(total), label: text.approved },
    { value: formatCount(saleQ.data?.totalItems), label: text.sale },
    { value: formatCount(rentQ.data?.totalItems), label: text.rent },
    {
      value: formatCount(categoriesQ.data?.totalItems),
      label: text.categories,
    },
  ];

  return (
    <section className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="text-3xl font-bold text-zinc-950 md:text-4xl dark:text-white">
                {item.value}
              </div>
              <div className="text-zinc-600 dark:text-white/60">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
