"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ArrowRight,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewsStatus, type NewsArticleData } from "@/types/interfaces/api/news";

import { useNewsTopics } from "@/hooks/news/useNewsTopics";
import {
  useNewsArticles,
  useSavedArticles,
  useToggleSaveArticle,
} from "@/hooks/news/useNewsArticles";
import { withLocalePath } from "@/lib/utils/i18n";
import { useAuth } from "../auth/auth-provider";
import { NewsApi } from "@/lib/api/news";

type SortValue = "newest" | "oldest" | "popular";

function formatDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  // keep similar style to your mock (mm/dd/yyyy)
  return dt.toLocaleDateString("en-US");
}

function getFeatured(articles: NewsArticleData[]) {
  const featured = articles.find((a) => a.isFeatured && !a.deletedAt);
  return featured ?? articles[0] ?? null;
}

export default function NewsPage() {
  const locale = useLocale();
  const { isAuthed, openAuthModal } = useAuth();

  const [keyword, setKeyword] = React.useState("");
  const [appliedSearch, setAppliedSearch] = React.useState("");
  const [selectedTopicId, setSelectedTopicId] = React.useState<number | null>(
    null
  );

  const [pageIndex, setPageIndex] = React.useState(1);
  const pageSize = 9;

  const [sort, setSort] = React.useState<SortValue>("newest");
  const [newsletterEmail, setNewsletterEmail] = React.useState("");
  const [newsletterMessage, setNewsletterMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [newsletterLoading, setNewsletterLoading] = React.useState(false);

  // reset pagination when filters change
  React.useEffect(() => {
    setPageIndex(1);
  }, [appliedSearch, selectedTopicId, sort]);

  // ----------------------------
  // Queries
  // ----------------------------
  const topicsQ = useNewsTopics();

  const { sortKey, sortOrder } = React.useMemo(() => {
    // IMPORTANT: make sure these keys match what your backend supports.
    // If your API doesn't support "savedByCount", keep it as publishedAt.
    if (sort === "oldest") return { sortKey: "publishedAt", sortOrder: "asc" as const };
    if (sort === "popular") return { sortKey: "savedByCount", sortOrder: "desc" as const };
    return { sortKey: "publishedAt", sortOrder: "desc" as const };
  }, [sort]);

  const articlesQ = useNewsArticles({
    pageIndex,
    pageSize,
    topicId: selectedTopicId ?? undefined,
    search: appliedSearch || undefined,
    status: NewsStatus.PUBLISHED, // public page: show published only
    sortKey,
    sortOrder,
  });

  // saved articles (optional if user not logged in)
  const savedQ = useSavedArticles({
    enabled: isAuthed, // Only run query when authenticated
  });

  const savedIdSet = React.useMemo(() => {
    if (!isAuthed) return new Set<number>(); // ✅ Return empty set if not logged in
    const arr = (savedQ.data ?? []) as Array<{ articleId: number }>;
    return new Set(arr.map((x) => x.articleId));
  }, [savedQ.data, isAuthed]);

  // small optimistic layer for the Save button (optional)
  const [optimisticSaved, setOptimisticSaved] = React.useState<Set<number>>(
    () => new Set()
  );

  const isSaved = (id: number) => {
    if (!isAuthed) return false;
    const base = savedIdSet.has(id);
    const opt = optimisticSaved.has(id);
    return opt ? !base : base;
  };

  const toggleSaveM = useToggleSaveArticle();

  const onToggleSave = async (articleId: number) => {
    // ✅ Check if user is authenticated first
    if (!isAuthed) {
      openAuthModal("signin");
      return;
    }

    // optimistic flip
    setOptimisticSaved((prev) => {
      const next = new Set(prev);
      if (next.has(articleId)) next.delete(articleId);
      else next.add(articleId);
      return next;
    });

    toggleSaveM.mutate(articleId, {
      onError: () => {
        // revert optimistic flip if failed
        setOptimisticSaved((prev) => {
          const next = new Set(prev);
          if (next.has(articleId)) next.delete(articleId);
          else next.add(articleId);
          return next;
        });
      },
      onSuccess: () => {
        // clear local override once server state is refreshed by invalidations
        setOptimisticSaved((prev) => {
          const next = new Set(prev);
          next.delete(articleId);
          return next;
        });
      },
    });
  };

  // ----------------------------
  // Derived data
  // ----------------------------
  const topics = topicsQ.data ?? [];
  const articlesRes = articlesQ.data;
  const articles = articlesRes?.data ?? [];
  const featured = getFeatured(articles);

  const totalItems = articlesRes?.totalItems ?? 0;
  const totalPages = articlesRes?.totalPages ?? 1;

  const showingFrom =
    totalItems === 0 ? 0 : (pageIndex - 1) * pageSize + 1;
  const showingTo =
    totalItems === 0
      ? 0
      : (pageIndex - 1) * pageSize + Math.min(pageSize, articles.length);

  const canPrev = pageIndex > 1;
  const canNext = pageIndex < totalPages;

  const subscribeNewsletter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = newsletterEmail.trim();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setNewsletterMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setNewsletterLoading(true);
    try {
      const response = await NewsApi.subscribeNewsletter({ email });
      setNewsletterMessage({
        type: "success",
        text: response.message || "Newsletter subscription successful. We'll send weekly updates to your inbox.",
      });
      setNewsletterEmail("");
    } catch (error: any) {
      setNewsletterMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to subscribe right now. Please try again.",
      });
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10 space-y-6">
        {/* A) Page Header / Hero */}
        <section className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
          <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
            {/* Left */}
            <div className="space-y-5">
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white text-balance">
                  Real Estate News & Insights
                </h1>
                <p className="text-white/60 max-w-3xl">
                  Stay updated with market trends, buying/renting tips, legal
                  guidance, finance, and regional analysis.
                </p>
              </div>

              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setAppliedSearch(keyword.trim());
                    }}
                    placeholder="Search articles: area, keyword, topic..."
                    className="bg-[#0a0a0a] border-[#262626] text-white h-12 rounded-lg w-full pl-11"
                  />
                  <Search className="w-5 h-5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 rounded-lg"
                  onClick={() => setAppliedSearch(keyword.trim())}
                >
                  Search
                </Button>
              </div>

              {/* Topic pills (API) */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTopicId(null)}
                  className={[
                    "px-4 py-2 bg-[#0a0a0a] border rounded-full text-sm transition-colors",
                    selectedTopicId === null
                      ? "border-purple-600/60 text-white"
                      : "border-[#262626] text-white/80 hover:border-purple-600/50 hover:text-white",
                  ].join(" ")}
                >
                  All
                </button>

                {topicsQ.isLoading ? (
                  <div className="text-white/50 text-sm flex items-center gap-2 px-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading topics...
                  </div>
                ) : (
                  topics.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTopicId(t.id)}
                      className={[
                        "px-4 py-2 bg-[#0a0a0a] border rounded-full text-sm transition-colors",
                        selectedTopicId === t.id
                          ? "border-purple-600/60 text-white"
                          : "border-[#262626] text-white/80 hover:border-purple-600/50 hover:text-white",
                      ].join(" ")}
                      title={`${t._count?.articles ?? 0} articles`}
                    >
                      {t.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right: Featured box (API) */}
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-600/10 border border-purple-500/25 rounded-xl p-6">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                  Featured
                </span>
                <span className="px-3 py-1 bg-[#0a0a0a] border border-[#262626] text-white/80 text-xs font-semibold rounded-full">
                  Weekly
                </span>
              </div>

              {articlesQ.isLoading ? (
                <div className="text-white/60 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading featured...
                </div>
              ) : featured ? (
                <>
                  <h3 className="text-white font-bold mb-2 line-clamp-2">
                    {featured.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-3">
                    {featured.excerpt || "No excerpt."}
                  </p>

                  <Button
                    asChild
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-lg"
                  >
                    <Link href={withLocalePath(`/news/${featured.id}`, locale)} prefetch={false}>
                      Read Weekly Digest
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </>
              ) : (
                <div className="text-white/50 text-sm">No featured article.</div>
              )}
            </div>
          </div>
        </section>

        {/* B) Main grid */}
        <section className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="space-y-6 sticky top-6">
              {/* Topics (API) */}
              <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Topics</h3>
                  <button
                    className="text-white/60 text-sm hover:text-white"
                    onClick={() => {
                      setSelectedTopicId(null);
                      setKeyword("");
                      setAppliedSearch("");
                      setSort("newest");
                    }}
                  >
                    Reset
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTopicId(null)}
                    className={[
                      "px-3 py-2 bg-[#0a0a0a] border rounded-lg text-sm transition-colors",
                      selectedTopicId === null
                        ? "border-purple-600/60 text-white"
                        : "border-[#262626] text-white/80 hover:border-purple-600/50 hover:text-white",
                    ].join(" ")}
                  >
                    All
                  </button>

                  {topics.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTopicId(t.id)}
                      className={[
                        "px-3 py-2 bg-[#0a0a0a] border rounded-lg text-sm transition-colors",
                        selectedTopicId === t.id
                          ? "border-purple-600/60 text-white"
                          : "border-[#262626] text-white/80 hover:border-purple-600/50 hover:text-white",
                      ].join(" ")}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter (sort wired; other selects are UI-only for now) */}
              <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-5">
                <h3 className="text-white font-bold">Filter</h3>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">
                    Sort
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortValue)}
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Most popular</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">
                    Time
                  </label>
                  <select className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option>All time</option>
                    <option>Today</option>
                    <option>This week</option>
                    <option>This month</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/60 text-sm mb-2 block">
                    Region
                  </label>
                  <select className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 mb-3">
                    <option>Province/City</option>
                    <option>Hanoi</option>
                    <option>Ho Chi Minh City</option>
                    <option>Da Nang</option>
                  </select>
                  <select className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option>District</option>
                    <option>Hoan Kiem</option>
                    <option>Ba Dinh</option>
                    <option>Cau Giay</option>
                  </select>
                </div>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-lg font-semibold"
                  onClick={() => {
                    // currently sort already applied, search/topic already applied;
                    // keep button for future filter wiring.
                    articlesQ.refetch();
                  }}
                >
                  Apply
                </Button>
              </div>

              {/* Newsletter */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-[#262626] dark:bg-[#141414]">
                <h3 className="mb-2 font-bold text-zinc-950 dark:text-white">Newsletter</h3>
                <p className="mb-4 text-sm text-zinc-600 dark:text-white/60">
                  Get weekly article updates in your inbox.
                </p>
                <form className="flex gap-2" onSubmit={subscribeNewsletter}>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(event) => {
                      setNewsletterEmail(event.target.value);
                      setNewsletterMessage(null);
                    }}
                    placeholder="Enter your email"
                    className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:border-[#262626] dark:bg-[#0a0a0a] dark:text-white dark:placeholder:text-white/40"
                    disabled={newsletterLoading}
                  />
                  <Button
                    type="submit"
                    className="bg-purple-600 px-4 text-white hover:bg-purple-700"
                    disabled={newsletterLoading}
                  >
                    {newsletterLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </Button>
                </form>
                {newsletterMessage && (
                  <div
                    className={[
                      "mt-3 rounded-lg border px-3 py-2 text-sm",
                      newsletterMessage.type === "success"
                        ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
                        : "border-red-500/30 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200",
                    ].join(" ")}
                  >
                    {newsletterMessage.text}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="space-y-6">
            {/* Featured Article (top of list) */}
            <article className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
                <div className="relative bg-[#0a0a0a] rounded-lg aspect-video flex items-center justify-center border border-[#262626] overflow-hidden">
                  {featured?.coverImageUrl ? (
                    <Image
                      src={featured.coverImageUrl}
                      alt={featured.title}
                      fill
                      priority
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-white/40 text-sm">
                      Featured Article Image
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-6">
                  {articlesQ.isLoading ? (
                    <div className="text-white/60 text-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </div>
                  ) : featured ? (
                    <>
                      <div>
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                            {featured.topic?.name ?? "Topic"}
                          </span>
                          <span className="text-white/60 text-sm">
                            {featured.readMin ? `${featured.readMin} min read` : "—"}
                          </span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60 text-sm">
                            {formatDate(featured.publishedAt ?? featured.createdAt)}
                          </span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3 text-balance">
                          {featured.title}
                        </h2>

                        <p className="text-white/60">
                          {featured.excerpt || "No excerpt."}
                        </p>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                          <Link href={withLocalePath(`/news/${featured.id}`, locale)} prefetch={false}>
                            Read More
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                          onClick={() => onToggleSave(featured.id)}
                          disabled={toggleSaveM.isPending}
                        >
                          {isSaved(featured.id) ? "Saved" : "Save"}
                        </Button>

                        <Button
                          variant="outline"
                          className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              navigator.share?.({
                                title: featured.title,
                                url: `${window.location.origin}${withLocalePath(`/news/${featured.id}`, locale)}`,
                              }).catch(() => {
                                navigator.clipboard
                                  ?.writeText(`${window.location.origin}${withLocalePath(`/news/${featured.id}`, locale)}`)
                                  .catch(() => { });
                              });
                            }
                          }}
                        >
                          Share
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-white/50 text-sm">
                      No articles yet.
                    </div>
                  )}
                </div>
              </div>
            </article>

            {/* Toolbar */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white/60 text-sm">Showing</span>
                  <span className="text-white font-semibold">
                    {showingFrom}–{showingTo}
                  </span>
                  <span className="text-white/60 text-sm">of</span>
                  <span className="text-white font-semibold">{totalItems}</span>
                  <span className="text-white/60 text-sm">articles</span>

                  {articlesQ.isFetching && (
                    <span className="ml-3 text-white/50 text-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </span>
                  )}
                </div>

                {/* (UI only) */}
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-sm">View:</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-purple-600 bg-purple-600/20 text-white hover:bg-purple-600/30"
                    >
                      Grid
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#262626] text-white/70 hover:bg-white/5 bg-transparent"
                    >
                      List
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#262626] text-white/70 hover:bg-white/5 bg-transparent"
                    >
                      Trending
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active filters (wired) */}
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedTopicId !== null && (
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#262626] rounded-full text-sm text-white hover:border-purple-600/50 transition-colors"
                    onClick={() => setSelectedTopicId(null)}
                  >
                    {topics.find((t) => t.id === selectedTopicId)?.name ??
                      "Topic"}
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                )}

                {appliedSearch && (
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#262626] rounded-full text-sm text-white hover:border-purple-600/50 transition-colors"
                    onClick={() => {
                      setAppliedSearch("");
                      setKeyword("");
                    }}
                  >
                    {appliedSearch}
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                )}
              </div>
            </div>

            {/* Articles Grid (API) */}
            {articlesQ.isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden"
                  >
                    <div className="bg-[#0a0a0a] border-b border-[#262626] aspect-video" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-white/10 rounded w-2/3" />
                      <div className="h-4 bg-white/10 rounded w-5/6" />
                      <div className="h-4 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : articlesQ.isError ? (
              <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 text-white/70">
                Failed to load articles.
              </div>
            ) : articles.length === 0 ? (
              <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 text-white/70">
                No articles found.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((a) => (
                  <article
                    key={a.id}
                    className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden hover:border-purple-600/30 transition-colors"
                  >
                    <div className="relative bg-[#0a0a0a] border-b border-[#262626] aspect-video overflow-hidden">
                      {a.coverImageUrl ? (
                        <Image
                          src={a.coverImageUrl}
                          alt={a.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/40 text-sm">
                            Thumbnail
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-white/60 flex-wrap">
                        <span className="px-2.5 py-1 bg-[#0a0a0a] border border-[#262626] rounded-full">
                          {a.topic?.name ?? "Topic"}
                        </span>
                        <span>•</span>
                        <span>{a.readMin ? `${a.readMin} min read` : "—"}</span>
                        <span>•</span>
                        <span>{formatDate(a.publishedAt ?? a.createdAt)}</span>
                      </div>

                      <h3 className="text-white font-semibold leading-snug text-balance line-clamp-2">
                        {a.title}
                      </h3>

                      <p className="text-white/60 text-sm line-clamp-2">
                        {a.excerpt || "No excerpt."}
                      </p>

                      <div className="pt-2 flex items-center justify-between gap-3">
                        <Button
                          variant="outline"
                          className="border-[#262626] text-white/80 hover:bg-white/5 bg-transparent h-9 px-3"
                          onClick={() => onToggleSave(a.id)}
                          disabled={toggleSaveM.isPending}
                          title={
                            isSaved(a.id)
                              ? "Unsave this article"
                              : "Save this article"
                          }
                        >
                          {isSaved(a.id) ? "Saved" : "Save"}
                          <span className="ml-2 text-white/50">
                            ({a._count?.savedBy ?? 0})
                          </span>
                        </Button>

                        <Link
                          href={withLocalePath(`/news/${a.id}`, locale)}
                          prefetch={false}
                          className="text-purple-400 hover:text-purple-300 text-sm inline-flex items-center gap-1"
                        >
                          Read <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination (API) */}
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">
                {String(pageIndex).padStart(2, "0")} of{" "}
                {String(totalPages).padStart(2, "0")}
              </div>

              <div className="flex gap-2">
                <button
                  className="w-10 h-10 flex items-center justify-center text-white/60 hover:bg-white/5 rounded-lg border border-[#262626] disabled:opacity-40 disabled:hover:bg-transparent"
                  disabled={!canPrev || articlesQ.isFetching}
                  onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  className="w-10 h-10 flex items-center justify-center text-white/60 hover:bg-white/5 rounded-lg border border-[#262626] disabled:opacity-40 disabled:hover:bg-transparent"
                  disabled={!canNext || articlesQ.isFetching}
                  onClick={() =>
                    setPageIndex((p) => Math.min(totalPages, p + 1))
                  }
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* FAQs (UI only) */}
            <section className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    News FAQs
                  </h2>
                  <p className="text-white/60">
                    Quick answers: how to save articles, follow topics, and get
                    weekly updates.
                  </p>
                </div>

              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                {[
                  {
                    q: "How do I save an article?",
                    a: "Click Save on an article. You'll find it later in your Saved list.",
                  },
                  {
                    q: "Can I filter by topic?",
                    a: "Yes. Click a topic pill or choose a topic in the sidebar.",
                  },
                  {
                    q: "How do I search?",
                    a: "Type keywords in the search bar and press Enter or Search.",
                  },
                  {
                    q: "How is Trending calculated?",
                    a: "Trending is based on recent views, saves, and shares over a short time window.",
                  },
                ].map((it) => (
                  <div
                    key={it.q}
                    className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-5"
                  >
                    <div className="text-white font-semibold mb-1">{it.q}</div>
                    <div className="text-white/60 text-sm">{it.a}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
