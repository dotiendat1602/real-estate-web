"use client";

import { PropertyPlanningSummaryResponse } from "@/types/interfaces/api/planning";

type PlanningBadgeProps = {
  summary?: PropertyPlanningSummaryResponse;
  isLoading?: boolean;
};

function getStatusTone(status?: string) {
  if (status === "MATCHED") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
  }

  if (status === "NO_MATCH") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  }

  return "border-zinc-600 bg-zinc-900 text-zinc-300";
}

export function PlanningBadge({ summary, isLoading }: PlanningBadgeProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-3 text-sm text-zinc-300">
        Đang kiểm tra dữ liệu quy hoạch...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-3 text-sm text-zinc-300">
        Chưa có dữ liệu quy hoạch tham chiếu.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(summary.planningStatus)}`}>
          {summary.badge}
        </span>
        {summary.riskLevel ? (
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">
            Risk: {summary.riskLevel}
          </span>
        ) : null}
      </div>

      <div className="mt-3 grid gap-1 text-sm text-zinc-300">
        <div>
          Loại đất hiện trạng: <span className="text-zinc-100">{summary.landUseCurrent || "—"}</span>
        </div>
        <div>
          Loại đất quy hoạch: <span className="text-zinc-100">{summary.landUsePlanned || "—"}</span>
        </div>
        <div>
          Hồ sơ: <span className="text-zinc-100">{summary.dossier?.name || "—"}</span>
        </div>
      </div>
    </div>
  );
}
