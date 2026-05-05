"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useLocale } from "next-intl";

import { withLocalePath } from "@/lib/utils/i18n";
import { Button } from "@/components/ui/button";

const copy = {
  en: {
    title: "Find the right property in minutes.",
    intro:
      "Search approved listings by location, budget, area, bedrooms, amenities, and nearby utilities.",
    buy: "Buy",
    rent: "Rent",
    keyword: "Area, project, street...",
    priceFrom: "Min price",
    priceTo: "Max price",
    areaFrom: "Min area m2",
    search: "Search",
    chips: ["2+ bedrooms", "2+ bathrooms", "80+ m2", "Latest listings"],
  },
  vi: {
    title: "Tìm bất động sản phù hợp trong vài phút.",
    intro:
      "Tìm tin đã duyệt theo vị trí, ngân sách, diện tích, số phòng, tiện nghi và tiện ích xung quanh.",
    buy: "Mua",
    rent: "Thuê",
    keyword: "Khu vực, dự án, tên đường...",
    priceFrom: "Giá từ",
    priceTo: "Giá đến",
    areaFrom: "Diện tích từ m2",
    search: "Tìm kiếm",
    chips: ["2+ phòng ngủ", "2+ phòng tắm", "80+ m2", "Tin mới nhất"],
  },
};

export default function Hero() {
  const locale = useLocale();
  const router = useRouter();
  const text = locale === "vi" ? copy.vi : copy.en;
  const [mode, setMode] = React.useState<"sale" | "rent">("sale");
  const [search, setSearch] = React.useState("");
  const [priceFrom, setPriceFrom] = React.useState("");
  const [priceTo, setPriceTo] = React.useState("");
  const [areaFrom, setAreaFrom] = React.useState("");

  const submit = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (priceFrom) params.set("priceFrom", priceFrom);
    if (priceTo) params.set("priceTo", priceTo);
    if (areaFrom) params.set("areaFrom", areaFrom);
    router.push(
      `${withLocalePath(`/${mode}`, locale)}${params.toString() ? `?${params}` : ""}`
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-white to-purple-50/70 dark:bg-[#0a0a0a] dark:bg-none">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] sm:block">
        <Image
          src="/modern-blue-glass-buildings-3d-render.svg"
          alt=""
          fill
          priority
          sizes="58vw"
          className="object-contain object-right opacity-55 contrast-125 saturate-150 dark:opacity-60 dark:saturate-125"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/5 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/85 dark:to-[#0a0a0a]/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-purple-50/70 to-transparent dark:from-[#0a0a0a]" />

      <div className="relative z-10 px-4 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl space-y-8">
            <div className="space-y-4">
              <h1 className="text-[40px] leading-[1.1] font-bold text-zinc-950 sm:text-5xl lg:text-6xl dark:text-white">
                {text.title}
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-white/55">
                {text.intro}
              </p>
            </div>

            <div className="space-y-3">
              <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-100 p-1 dark:border-[#262626] dark:bg-[#101010]">
                {(["sale", "rent"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={`h-9 rounded-full px-5 text-sm transition-colors ${mode === item ? "bg-purple-600 text-white" : "text-zinc-600 hover:text-zinc-950 dark:text-white/60 dark:hover:text-white"}`}
                  >
                    {item === "sale" ? text.buy : text.rent}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_150px_150px_150px_auto]">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && submit()}
                  placeholder={text.keyword}
                  className="h-11 rounded-full bg-white px-5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-200 outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 dark:shadow-none dark:ring-white/10"
                />
                <input
                  value={priceFrom}
                  onChange={(event) => setPriceFrom(event.target.value)}
                  type="number"
                  min="0"
                  placeholder={text.priceFrom}
                  className="h-11 rounded-full bg-white px-5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-200 outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 dark:shadow-none dark:ring-white/10"
                />
                <input
                  value={priceTo}
                  onChange={(event) => setPriceTo(event.target.value)}
                  type="number"
                  min="0"
                  placeholder={text.priceTo}
                  className="h-11 rounded-full bg-white px-5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-200 outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 dark:shadow-none dark:ring-white/10"
                />
                <input
                  value={areaFrom}
                  onChange={(event) => setAreaFrom(event.target.value)}
                  type="number"
                  min="0"
                  placeholder={text.areaFrom}
                  className="h-11 rounded-full bg-white px-5 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-200 outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 dark:shadow-none dark:ring-white/10"
                />
                <Button
                  className="h-11 rounded-full bg-purple-600 px-6 text-white hover:bg-purple-700"
                  onClick={submit}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {text.search}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {text.chips.map((label) => (
                  <span
                    key={label}
                    className="inline-flex h-9 items-center rounded-full border border-zinc-200 bg-white px-4 text-xs text-zinc-700 shadow-sm dark:border-[#1a1a1a] dark:bg-[#0f0f0f] dark:text-white/70 dark:shadow-none"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
