"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Search, Star, BadgeCheck, MapPin, ArrowRight, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFeaturedAgents } from "@/hooks/users/useAgent";
import { withLocalePath } from "@/lib/utils/i18n";

function formatRating(value?: number | string | null) {
  const numeric = typeof value === "string" ? Number(value) : value;
  if (typeof numeric !== "number" || Number.isNaN(numeric)) return "0.0";
  return numeric.toFixed(1);
}

export default function AgentsPage() {
  const locale = useLocale();
  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [pageIndex, setPageIndex] = useState(1);

  const agentsQ = useFeaturedAgents({
    pageIndex,
    pageSize: 12,
    search: appliedKeyword || undefined,
  });

  const agents = agentsQ.data?.data ?? [];
  const totalPages = Math.max(1, agentsQ.data?.totalPages ?? 1);
  const totalItems = agentsQ.data?.totalItems ?? 0;

  const applySearch = () => {
    setAppliedKeyword(keyword.trim());
    setPageIndex(1);
  };

  return (
    <div className="bg-zinc-50 text-zinc-950 dark:bg-[#0a0a0a] dark:text-white">
      <section className="border-b border-zinc-200 bg-white px-4 py-10 sm:px-8 lg:px-14 2xl:px-20 dark:border-[#1a1a1a] dark:bg-[#0f0f0f]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-200">
              <Users className="h-3.5 w-3.5" />
              Agent directory
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Find the right real estate agent
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-white/60">
              Browse active agents by name, email, area and specialty. Each profile includes contact details and working focus.
            </p>
          </div>

          <div className="flex w-full max-w-xl gap-2">
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") applySearch();
              }}
              placeholder="Search by name, email, area or tag..."
              className="h-11 border-zinc-200 bg-white text-zinc-950 dark:border-[#262626] dark:bg-[#141414] dark:text-white"
            />
            <Button className="h-11 bg-purple-600 text-white hover:bg-purple-700" onClick={applySearch}>
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-8 lg:px-14 2xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center justify-between">
            <div className="text-sm text-zinc-500 dark:text-white/50">
              {agentsQ.isFetching ? "Syncing agents..." : `${totalItems} agents`}
            </div>
          </div>

          {agentsQ.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-56 animate-pulse rounded-xl border border-zinc-200 bg-white dark:border-[#1a1a1a] dark:bg-[#141414]" />
              ))}
            </div>
          ) : agentsQ.isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              Failed to load agents.
            </div>
          ) : agents.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-zinc-600 dark:border-[#1a1a1a] dark:bg-[#141414] dark:text-white/60">
              No matching agents found.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => {
                const profile = agent.agentProfile;
                const name = agent.name || agent.email;
                const title = profile?.title || "Real estate agent";
                const initial = name.charAt(0).toUpperCase();

                return (
                  <Link
                    key={agent.id}
                    href={withLocalePath(`/agents/${agent.id}`, locale)}
                    className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-purple-400 hover:shadow-md dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none dark:hover:border-purple-500/60"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-lg font-bold text-white dark:bg-white dark:text-zinc-950">
                        {initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-lg font-semibold text-zinc-950 dark:text-white">
                            {name}
                          </h2>
                          <BadgeCheck className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-300" />
                        </div>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-white/55">{title}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-zinc-200 p-3 dark:border-[#262626]">
                        <div className="flex items-center gap-1 text-zinc-500 dark:text-white/50">
                          <Star className="h-3.5 w-3.5" />
                          Rating
                        </div>
                        <div className="mt-1 font-semibold text-zinc-950 dark:text-white">
                          {formatRating(profile?.rating)}
                        </div>
                      </div>
                      <div className="rounded-lg border border-zinc-200 p-3 dark:border-[#262626]">
                        <div className="text-zinc-500 dark:text-white/50">Deals</div>
                        <div className="mt-1 font-semibold text-zinc-950 dark:text-white">
                          {profile?.deals ?? 0}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(profile?.areas || []).slice(0, 3).map((area) => (
                        <span key={area} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:bg-white/5 dark:text-white/70">
                          <MapPin className="h-3 w-3" />
                          {area}
                        </span>
                      ))}
                      {(profile?.tags || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-purple-50 px-2.5 py-1 text-xs text-purple-700 dark:bg-purple-500/10 dark:text-purple-200">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-purple-700 group-hover:text-purple-800 dark:text-purple-300 dark:group-hover:text-purple-200">
                      View profile
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between text-sm text-zinc-600 dark:text-white/60">
            <span>
              Page <span className="font-medium text-zinc-950 dark:text-white">{pageIndex}</span> / {totalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" disabled={pageIndex <= 1} onClick={() => setPageIndex((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <Button variant="outline" disabled={pageIndex >= totalPages} onClick={() => setPageIndex((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
