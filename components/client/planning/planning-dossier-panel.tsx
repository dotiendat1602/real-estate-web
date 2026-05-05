"use client";

import { PlanningDossierResponse } from "@/types/interfaces/api/planning";
import { FileText, LinkIcon } from "lucide-react";

type PlanningDossierPanelProps = {
  dossier?: PlanningDossierResponse;
  isLoading?: boolean;
};

export function PlanningDossierPanel({ dossier, isLoading }: PlanningDossierPanelProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
        Đang tải hồ sơ và danh sách tài liệu...
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
        Chưa có hồ sơ/tài liệu quy hoạch để hiển thị.
      </div>
    );
  }

  const pdfDocuments = dossier.documents.filter((doc) => {
    const format = (doc.format || "").toLowerCase();
    const title = (doc.title || "").toLowerCase();
    return format.includes("pdf") || title.includes("pdf");
  });

  const docs = pdfDocuments.length ? pdfDocuments : dossier.documents;

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950/70">
      <div className="mb-3">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">Hồ sơ</div>
        <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{dossier.tenHoSo}</div>
        <div className="text-xs text-zinc-500">Mã: {dossier.maHoSo}</div>
      </div>

      {!docs.length ? (
        <div className="text-sm text-zinc-500 dark:text-zinc-400">Không có tài liệu đính kèm.</div>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900/60"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <FileText className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-300" />
                  <span className="truncate text-sm font-medium">{doc.title}</span>
                </div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Format: {(doc.format || "unknown").toUpperCase()} • Status: {doc.downloadStatus}
                </div>
              </div>

              {doc.sourceUrl ? (
                <a
                  href={doc.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-100 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  Mở PDF
                </a>
              ) : (
                <span className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500 dark:border-zinc-600 dark:text-zinc-400">
                  Không có link
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
