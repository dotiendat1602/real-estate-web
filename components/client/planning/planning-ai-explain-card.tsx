"use client";

import React from "react";
import { usePlanningExplain } from "@/hooks/planning/usePlanning";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Loader2, MapPin, Sparkles } from "lucide-react";

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

  const formatLocator = (citation: {
    sourceLocator?: string | null;
    pageNumber?: number | null;
    lineStart?: number | null;
    lineEnd?: number | null;
  }) => {
    if (citation.sourceLocator) {
      return citation.sourceLocator;
    }

    if (citation.pageNumber && citation.lineStart && citation.lineEnd && citation.lineEnd !== citation.lineStart) {
      return `page:${citation.pageNumber},line:${citation.lineStart}-${citation.lineEnd}`;
    }

    if (citation.pageNumber && citation.lineStart) {
      return `page:${citation.pageNumber},line:${citation.lineStart}`;
    }

    if (citation.pageNumber) {
      return `page:${citation.pageNumber}`;
    }

    return "unknown";
  };

  const buildSourceHref = (citation: {
    sourceUrl?: string | null;
    pageNumber?: number | null;
  }) => {
    const source = citation.sourceUrl?.trim();
    if (!source) {
      return null;
    }

    if (!citation.pageNumber) {
      return source;
    }

    if (/\.pdf($|\?)/i.test(source)) {
      const separator = source.includes("#") ? "&" : "#";
      return `${source}${separator}page=${citation.pageNumber}`;
    }

    return source;
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

          {explainMutation.data.citations?.length ? (
            <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                <MapPin className="h-3.5 w-3.5 text-emerald-300" />
                Nguồn trích dẫn
              </div>

              <div className="space-y-2">
                {explainMutation.data.citations.slice(0, 8).map((citation, idx) => (
                  (() => {
                    const sourceHref = buildSourceHref(citation);
                    return (
                      <div key={`${citation.planningDocumentId || "doc"}-${citation.globalChunkIndex || idx}`} className="rounded-md border border-zinc-700/80 bg-zinc-950/60 p-2">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-300">
                          <FileText className="h-3.5 w-3.5 text-amber-300" />
                          <span className="font-medium text-zinc-100">{citation.title || `Tài liệu #${citation.planningDocumentId || "N/A"}`}</span>
                          <span className="rounded bg-zinc-800 px-1.5 py-0.5">{formatLocator(citation)}</span>
                          {citation.chunkType ? <span className="rounded bg-zinc-800 px-1.5 py-0.5">{citation.chunkType}</span> : null}
                        </div>

                        {citation.snippet ? (
                          <p className="mt-1 line-clamp-3 text-xs text-zinc-400">{citation.snippet}</p>
                        ) : null}

                        {sourceHref ? (
                          <a
                            href={sourceHref}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs text-sky-300 hover:text-sky-200 hover:underline"
                          >
                            Mở tài liệu nguồn
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : null}
                      </div>
                    );
                  })()
                ))}
              </div>
            </div>
          ) : null}

          <p className="text-xs text-zinc-500">{explainMutation.data.disclaimer}</p>
        </div>
      ) : null}
    </div>
  );
}
