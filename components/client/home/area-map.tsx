"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Route, ShieldCheck } from "lucide-react";
import { useLocale } from "next-intl";

import { withLocalePath } from "@/lib/utils/i18n";

const copy = {
  en: {
    title: "Location insight",
    intro:
      "Use listing detail pages to review map position, planning data, amenities, and nearby facilities before contacting an agent.",
    sale: "Browse sale listings",
    rent: "Browse rental listings",
    items: [
      "Map position and address hierarchy",
      "Nearby schools, hospitals, parks, and transport",
      "Planning dossier where property coordinates are available",
    ],
  },
  vi: {
    title: "Thông tin khu vực",
    intro:
      "Ở trang chi tiết tin đăng, bạn có thể xem vị trí bản đồ, dữ liệu quy hoạch, tiện nghi và tiện ích xung quanh trước khi liên hệ môi giới.",
    sale: "Xem tin bán",
    rent: "Xem tin thuê",
    items: [
      "Vị trí bản đồ và địa chỉ hành chính",
      "Trường học, bệnh viện, công viên, giao thông gần đó",
      "Hồ sơ quy hoạch khi bất động sản có tọa độ",
    ],
  },
};

export default function AreaMap() {
  const locale = useLocale();
  const text = locale === "vi" ? copy.vi : copy.en;
  const icons = [MapPin, Route, ShieldCheck];

  return (
    <section className="px-4 py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none">
          <Image
            src="/modern-luxury-villa-pool.svg"
            alt={text.title}
            width={640}
            height={420}
            className="h-[420px] w-full object-cover"
          />
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-zinc-950 dark:text-white">
              {text.title}
            </h2>
            <p className="max-w-2xl text-zinc-600 dark:text-white/60">
              {text.intro}
            </p>
          </div>

          <div className="space-y-4">
            {text.items.map((item, index) => {
              const Icon = icons[index];
              return (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-zinc-700 shadow-sm dark:border-[#1a1a1a] dark:bg-[#141414] dark:text-white/70 dark:shadow-none"
                >
                  <Icon className="h-5 w-5 text-purple-400" />
                  <span>{item}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={withLocalePath("/sale", locale)}
              prefetch={false}
              className="rounded-lg bg-purple-600 px-5 py-3 text-white hover:bg-purple-700"
            >
              {text.sale}
            </Link>
            <Link
              href={withLocalePath("/rent", locale)}
              prefetch={false}
              className="rounded-lg border border-zinc-200 px-5 py-3 text-zinc-800 hover:bg-zinc-100 dark:border-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
            >
              {text.rent}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
