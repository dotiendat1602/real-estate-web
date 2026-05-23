"use client";

import { useLocale } from "next-intl";
import { usePublicPosts } from "@/hooks/post/usePost";

const copy = {
  en: {
    approved: "Total posts",
    sale: "For sale",
    rent: "For rent",
  },
  vi: {
    approved: "Tổng số tin",
    sale: "Tin bán",
    rent: "Tin thuê",
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
  const total = (saleQ.data?.totalItems ?? 0) + (rentQ.data?.totalItems ?? 0);

  const items = [
    { value: formatCount(total), label: text.approved },
    { value: formatCount(saleQ.data?.totalItems), label: text.sale },
    { value: formatCount(rentQ.data?.totalItems), label: text.rent },
  ];

  return (
    <section className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="space-y-2 rounded-lg border border-zinc-200 bg-white/80 p-5 shadow-sm dark:border-white/15 dark:bg-white/[0.03] dark:shadow-none"
            >
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
