"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, BadgeCheck, Building2, Mail, MapPin, Phone, Star, Tags, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePublicPosts } from "@/hooks/post/usePost";
import { useAgentDetail } from "@/hooks/users/useAgent";
import { formatPrice } from "@/lib/utils";
import { withLocalePath } from "@/lib/utils/i18n";
import type { PostDataListItem } from "@/types/interfaces/api/post";

function formatRating(value?: number | string | null) {
  const numeric = typeof value === "string" ? Number(value) : value;
  if (typeof numeric !== "number" || Number.isNaN(numeric)) return "0.0";
  return numeric.toFixed(1);
}

function listingImage(post: PostDataListItem) {
  const images = post.property?.images ?? [];
  return images.find((image) => image.isPrimary)?.imageUrl ?? images[0]?.imageUrl ?? null;
}

export default function AgentDetailPage() {
  const params = useParams<{ id: string }>();
  const locale = useLocale();
  const agentId = Number(params.id);
  const agentQ = useAgentDetail(Number.isFinite(agentId) ? agentId : 0);
  const postsQ = usePublicPosts({
    pageIndex: 1,
    pageSize: 6,
    sortKey: "publishedAt",
    sortOrder: "desc",
    agentId: Number.isFinite(agentId) ? agentId : undefined,
  });
  const agent = agentQ.data;
  const posts = postsQ.data?.data ?? [];
  const profile = agent?.agentProfile;
  const displayName = agent?.name || agent?.email || "Agent";

  return (
    <div className="bg-zinc-50 text-zinc-950 dark:bg-[#0a0a0a] dark:text-white">
      <section className="border-b border-zinc-200 bg-white px-4 py-6 sm:px-8 lg:px-14 2xl:px-20 dark:border-[#1a1a1a] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-7xl">
          <Link
            href={withLocalePath("/agents", locale)}
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-950 dark:text-white/60 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to agents
          </Link>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-8 lg:px-14 2xl:px-20">
        <div className="mx-auto max-w-7xl">
          {agentQ.isLoading ? (
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <div className="h-80 animate-pulse rounded-xl border border-zinc-200 bg-white dark:border-[#1a1a1a] dark:bg-[#141414]" />
              <div className="h-80 animate-pulse rounded-xl border border-zinc-200 bg-white dark:border-[#1a1a1a] dark:bg-[#141414]" />
            </div>
          ) : agentQ.isError || !agent ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              Agent profile was not found or is inactive.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <aside className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-purple-200 bg-purple-50 text-3xl font-bold text-purple-700 dark:border-white/10 dark:bg-white dark:text-zinc-950">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">
                      {displayName}
                    </h1>
                    <BadgeCheck className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-white/55">
                    {profile?.title || "Real estate agent"}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-zinc-200 p-3 dark:border-[#262626]">
                    <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-white/50">
                      <Star className="h-3.5 w-3.5" />
                      Rating
                    </div>
                    <div className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
                      {formatRating(profile?.rating)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-200 p-3 dark:border-[#262626]">
                    <div className="text-xs text-zinc-500 dark:text-white/50">Deals</div>
                    <div className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
                      {profile?.deals ?? 0}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:border-[#262626] dark:text-white/70 dark:hover:bg-white/5"
                  >
                    <Mail className="h-4 w-4 text-zinc-500 dark:text-white/50" />
                    <span className="min-w-0 truncate">{agent.email}</span>
                  </a>
                  {agent.phone ? (
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:border-[#262626] dark:text-white/70 dark:hover:bg-white/5"
                    >
                      <Phone className="h-4 w-4 text-zinc-500 dark:text-white/50" />
                      {agent.phone}
                    </a>
                  ) : null}
                </div>
              </aside>

              <main className="space-y-6">
                <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
                      Profile overview
                    </h2>
                  </div>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-white/60">
                    Contact this agent directly for property viewings, negotiation support and local market context.
                  </p>
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                      <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                        Areas
                      </h2>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(profile?.areas || []).length ? (
                        profile?.areas?.map((area) => (
                          <span key={area} className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-white/5 dark:text-white/70">
                            {area}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-500 dark:text-white/50">No areas configured.</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none">
                    <div className="flex items-center gap-2">
                      <Tags className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                      <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                        Specialties
                      </h2>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(profile?.tags || []).length ? (
                        profile?.tags?.map((tag) => (
                          <span key={tag} className="rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-700 dark:bg-purple-500/10 dark:text-purple-200">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-500 dark:text-white/50">No specialties configured.</p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                      <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                        Listings by this agent
                      </h2>
                    </div>
                    <span className="text-sm text-zinc-500 dark:text-white/50">
                      {postsQ.data?.totalItems ?? posts.length} posts
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {postsQ.isLoading ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-40 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100 dark:border-[#262626] dark:bg-[#0a0a0a]"
                        />
                      ))
                    ) : posts.length ? (
                      posts.map((post) => {
                        const imageUrl = listingImage(post);
                        const location = [post.property?.ward?.name, post.property?.district?.name, post.property?.province?.name]
                          .filter(Boolean)
                          .join(", ");

                        return (
                          <Link
                            key={post.id}
                            href={withLocalePath(`/posts/${post.id}`, locale)}
                            className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:border-purple-300 hover:shadow-sm dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-purple-500/50"
                          >
                            <div className="grid grid-cols-[120px_1fr]">
                              <div className="relative h-full min-h-32 bg-zinc-100 dark:bg-white/5">
                                {imageUrl ? (
                                  <Image
                                    src={imageUrl}
                                    alt={post.property?.title || post.postTitle}
                                    fill
                                    sizes="120px"
                                    className="object-cover"
                                  />
                                ) : null}
                              </div>
                              <div className="min-w-0 p-4">
                                <div className="line-clamp-2 text-sm font-semibold text-zinc-950 group-hover:text-purple-700 dark:text-white dark:group-hover:text-purple-200">
                                  {post.property?.title || post.postTitle}
                                </div>
                                <div className="mt-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
                                  {formatPrice(post.property?.price)}
                                </div>
                                <div className="mt-2 line-clamp-2 text-xs text-zinc-500 dark:text-white/50">
                                  {location || post.property?.location || "No location"}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <div className="rounded-lg border border-dashed border-zinc-200 p-6 text-sm text-zinc-500 md:col-span-2 dark:border-[#262626] dark:text-white/50">
                        This agent has no approved public listings yet.
                      </div>
                    )}
                  </div>
                </section>
              </main>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
