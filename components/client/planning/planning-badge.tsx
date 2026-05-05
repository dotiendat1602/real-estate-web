"use client";

import { PropertyPlanningSummaryResponse } from "@/types/interfaces/api/planning";

type PlanningBadgeProps = {
  summary?: PropertyPlanningSummaryResponse;
  isLoading?: boolean;
};

function getStatusTone(status?: string) {
  if (status === "MATCHED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200";
  }

  if (status === "NO_MATCH") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200";
  }

  return "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300";
}

export function PlanningBadge({ summary, isLoading }: PlanningBadgeProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">
        Đang kiểm tra dữ liệu quy hoạch...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">
        Chưa có dữ liệu quy hoạch tham chiếu.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950/70">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(summary.planningStatus)}`}>
          {summary.badge}
        </span>
        {summary.riskLevel ? (
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200">
            Risk: {summary.riskLevel}
          </span>
        ) : null}
      </div>

      <div className="mt-3 grid gap-1 text-sm text-zinc-600 dark:text-zinc-300">
        <div>
          Loại đất hiện trạng: <span className="text-zinc-900 dark:text-zinc-100">{summary.landUseCurrent || "—"}</span>
        </div>
        <div>
          Loại đất quy hoạch: <span className="text-zinc-900 dark:text-zinc-100">{summary.landUsePlanned || "—"}</span>
        </div>
        <div>
          Hồ sơ: <span className="text-zinc-900 dark:text-zinc-100">{summary.dossier?.name || "—"}</span>
        </div>
      </div>
    </div>
  );
}
