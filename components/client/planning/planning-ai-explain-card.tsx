"use client";

import React from "react";
import { usePlanningExplain } from "@/hooks/planning/usePlanning";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

type PlanningAiExplainCardProps = {
  propertyId: number;
};

export function PlanningAiExplainCard({ propertyId }: PlanningAiExplainCardProps) {
  const [question, setQuestion] = React.useState("");
  const explainMutation = usePlanningExplain(propertyId);

  const handleExplain = () => {
    if (!propertyId) {
      return;
    }
    explainMutation.mutate(question);
  };

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
      <div className="flex items-center gap-2 text-zinc-100">
        <Sparkles className="h-4 w-4 text-amber-300" />
        <h3 className="text-sm font-semibold">Phân tích AI (tham khảo)</h3>
      </div>

      <p className="mt-2 text-xs text-zinc-400">
        Nhập câu hỏi nếu bạn muốn AI tập trung vào một mối quan tâm cụ thể.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ví dụ: Rủi ro lớn nhất cần kiểm tra trước khi đặt cọc là gì?"
        className="mt-3 min-h-[84px] w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-sky-500"
      />

      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          onClick={handleExplain}
          disabled={explainMutation.isPending || !propertyId}
          className="bg-amber-500 text-zinc-900 hover:bg-amber-400"
        >
          {explainMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang phân tích...
            </>
          ) : (
            "Phân tích"
          )}
        </Button>
      </div>

      {explainMutation.isError ? (
        <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          Không thể lấy phân tích AI lúc này. Vui lòng thử lại sau.
        </div>
      ) : null}

      {explainMutation.data ? (
        <div className="mt-3 space-y-3">
          {explainMutation.data.highlights.length ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-200">
              {explainMutation.data.highlights.map((item, idx) => (
                <li key={`${idx}-${item}`}>{item}</li>
              ))}
            </ul>
          ) : null}

          <div className="whitespace-pre-line rounded-lg border border-zinc-700 bg-zinc-900/70 p-3 text-sm text-zinc-100">
            {explainMutation.data.answer}
          </div>

          <p className="text-xs text-zinc-500">{explainMutation.data.disclaimer}</p>
        </div>
      ) : null}
    </div>
  );
}
