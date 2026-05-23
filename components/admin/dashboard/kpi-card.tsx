import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";

export type DashboardKpi = {
  title: string;
  value: number | string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone: "purple" | "blue" | "emerald" | "amber" | "rose" | "slate";
  isLoading?: boolean;
};

const toneClass: Record<DashboardKpi["tone"], string> = {
  purple: "bg-purple-50 text-purple-700",
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-slate-100 text-slate-700",
};

function formatValue(value: number | string) {
  if (typeof value === "number") {
    return new Intl.NumberFormat("vi-VN").format(value);
  }

  return value;
}

export function KPICards({ items }: { items: DashboardKpi[] }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Tổng quan vận hành</h2>
        <p className="mt-1 text-sm text-gray-500">
          Các số liệu được lấy trực tiếp từ API quản trị.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">{item.title}</p>
                  <div className="mt-3 text-4xl font-bold text-gray-900">
                    {item.isLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    ) : (
                      formatValue(item.value)
                    )}
                  </div>
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClass[item.tone]}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 min-h-10 text-sm text-gray-500">{item.description}</p>

              <Link
                href={item.href}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-purple-700"
              >
                Mở trang quản lý
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
