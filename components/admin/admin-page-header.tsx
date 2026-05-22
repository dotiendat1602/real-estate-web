"use client";

import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-8 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          ) : null}
        </div>

        {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
