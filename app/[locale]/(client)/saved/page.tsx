"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Heart,
  X,
  Grid3x3,
  List,
  ChevronRight,
  Loader2,
  Trash2,
} from "lucide-react";

import { useFavoritesPosts, useToggleFavorite } from "@/hooks/post/usePost";
import { withLocalePath } from "@/lib/utils/i18n";
import type { FavoritesPostListQuery, PostDataListItem } from "@/types/interfaces/api/post";
import { useAuth } from "../auth/auth-provider";
import Pagination from "@/components/ui/pagination";

function primaryImageUrl(post: PostDataListItem) {
  const imgs = post.property?.images ?? [];
  const primary = imgs.find((x) => x.isPrimary);
  return (primary ?? imgs[0])?.imageUrl ?? null;
}

function moneyVnd(n?: number | string) {
  if (typeof n !== "number" && typeof n !== "string") return "—";
  return new Intl.NumberFormat("vi-VN").format(Number(n)) + " ₫";
}

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("vi-VN");
}

export default function SavedPropertiesPage() {
  const locale = useLocale();
  const { isAuthed, openAuthModal } = useAuth();
  const [pageIndex, setPageIndex] = React.useState(1);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [pageSize, setPageSize] = React.useState(12);

  const query: FavoritesPostListQuery = {
    pageIndex,
    pageSize,
  };

  const favoritesQ = useFavoritesPosts(query);
  const toggleFavoriteMut = useToggleFavorite();

  const totalItems = favoritesQ.data?.totalItems ?? 0;
  const totalPages = favoritesQ.data?.totalPages ?? 1;
  const posts = favoritesQ.data?.data ?? [];

  const showingFrom = totalItems === 0 ? 0 : (pageIndex - 1) * pageSize + 1;
  const showingTo =
    totalItems === 0
      ? 0
      : (pageIndex - 1) * pageSize + Math.min(pageSize, posts.length);

  const handleRemoveFavorite = (postId: number) => {
    toggleFavoriteMut.mutate(postId, {
      onSuccess: () => {
        // Nếu xóa item cuối cùng của page và không phải page đầu, về page trước
        if (posts.length === 1 && pageIndex > 1) {
          setPageIndex(pageIndex - 1);
        }
      },
    });
  };

  // Nếu chưa đăng nhập, hiển thị prompt
  if (!isAuthed) {
    return (
      <div className="bg-[#0a0a0a] min-h-[calc(100vh-200px)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-20">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-12 md:p-16 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-[#0a0a0a] border border-[#262626] rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Heart className="w-10 h-10 text-white/40" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Save Your Favorite Properties
            </h1>
            <p className="text-white/60 mb-8">
              Sign in to save and organize properties you love. Access your saved listings anytime, anywhere.
            </p>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-8"
              onClick={() => openAuthModal("signin")}
            >
              Sign In to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10 space-y-6">
        {/* Page Header */}
        <section className="bg-[#141414] border border-[#262626] rounded-xl p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-600/10 border border-purple-600/30 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-purple-400 fill-purple-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Saved Properties
                </h1>
              </div>
              <p className="text-white/60 max-w-3xl">
                {"Your collection of favorite properties. Browse, compare, and reach out when you're ready."}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-white">
                {totalItems === 0 ? (
                  "No saved properties yet"
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold">
                      {showingFrom}-{showingTo}
                    </span>{" "}
                    of <span className="font-semibold">{totalItems}</span>{" "}
                    saved {totalItems === 1 ? "property" : "properties"}
                  </>
                )}
                {favoritesQ.isFetching && (
                  <span className="ml-3 text-white/50 text-sm inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </span>
                )}
              </p>

              <div className="flex w-fit items-center gap-2 rounded-xl border border-[#262626] bg-[#0a0a0a] p-1">
                <button
                  type="button"
                  className={[
                    "rounded-lg p-2 transition-colors",
                    viewMode === "grid"
                      ? "bg-purple-600 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                  onClick={() => setViewMode("grid")}
                  aria-label="Show saved properties as grid"
                  aria-pressed={viewMode === "grid"}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className={[
                    "rounded-lg p-2 transition-colors",
                    viewMode === "list"
                      ? "bg-purple-600 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                  onClick={() => setViewMode("list")}
                  aria-label="Show saved properties as list"
                  aria-pressed={viewMode === "list"}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {favoritesQ.isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden"
                >
                  <div className="bg-[#0a0a0a] border-b border-[#262626] aspect-[4/3] animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-white/10 rounded w-2/3 animate-pulse" />
                    <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : favoritesQ.isError ? (
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-10 md:p-12">
              <div className="text-center max-w-md mx-auto">
                <div className="text-white/70 mb-4">
                  Failed to load your saved properties.
                </div>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => favoritesQ.refetch()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-10 md:p-12 min-h-[420px] flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-[#0a0a0a] border border-[#262626] rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  No saved properties yet
                </h3>
                <p className="text-white/60 mb-6">
                  {"Start exploring and save properties you're interested in. They'll appear here for easy access."}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    asChild
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Link href={withLocalePath("/rent", locale)}>Browse Rentals</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                  >
                    <Link href={withLocalePath("/sale", locale)}>Browse Sales</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((p) => {
                const img = primaryImageUrl(p);
                const price = p.property?.price;
                const isPending = toggleFavoriteMut.isPending;

                return (
                  <article
                    key={p.id}
                    className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden hover:border-purple-600/30 transition-colors group relative"
                  >
                    {/* Remove Button - Top Right */}
                    <button
                      className="absolute top-3 right-3 z-10 w-9 h-9 bg-[#141414]/90 backdrop-blur-sm border border-[#262626] rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600/20 hover:border-red-600/50"
                      onClick={() => handleRemoveFavorite(p.id)}
                      disabled={isPending}
                      title="Remove from saved"
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-white/60 hover:text-red-400" />
                      )}
                    </button>

                    {/* Image */}
                    <Link href={withLocalePath(`/posts/${p.id}`, locale)} prefetch={false}>
                      <div className="bg-[#0a0a0a] border-b border-[#262626] aspect-[4/3] overflow-hidden relative">
                        {img ? (
                          <Image
                            src={img}
                            alt={p.property?.title ?? p.postTitle}
                            fill
                            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white/40 text-sm">No image</span>
                          </div>
                        )}

                        {/* Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full bg-purple-600/90 backdrop-blur-sm border border-purple-400/30 text-purple-100 text-xs font-semibold">
                            {p.postType}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="space-y-2">
                        <Link href={withLocalePath(`/posts/${p.id}`, locale)} prefetch={false}>
                          <h3 className="text-white font-semibold line-clamp-1 hover:text-purple-400 transition-colors">
                            {p.property?.title ?? p.postTitle}
                          </h3>
                        </Link>

                        <div className="flex items-center justify-between gap-3">
                          <div className="text-purple-300 font-bold">
                            {moneyVnd(price)}
                            {p.postType === "RENT" && (
                              <span className="text-white/50 text-xs font-normal"> /mo</span>
                            )}
                          </div>
                          <Heart className="w-4 h-4 text-purple-400 fill-purple-400" />
                        </div>
                      </div>

                      <div className="text-white/60 text-sm line-clamp-2">
                        {p.postTitle}
                      </div>

                      <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
                        <span className="text-white/50 text-xs">
                          Saved {formatDate(p.createdAt)}
                        </span>

                        <Link
                          href={withLocalePath(`/posts/${p.id}`, locale)}
                          prefetch={false}
                          className="text-purple-400 hover:text-purple-300 text-sm inline-flex items-center gap-1 font-medium"
                        >
                          View <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((p) => {
                const img = primaryImageUrl(p);
                const price = p.property?.price;
                const isPending = toggleFavoriteMut.isPending;

                return (
                  <article
                    key={p.id}
                    className="overflow-hidden rounded-xl border border-[#262626] bg-[#141414] transition-colors hover:border-purple-600/30"
                  >
                    <div className="grid gap-0 md:grid-cols-[240px_minmax(0,1fr)_180px]">
                      <Link
                        href={withLocalePath(`/posts/${p.id}`, locale)}
                        prefetch={false}
                        className="block min-w-0"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0a0a0a] md:h-full md:min-h-[180px] md:aspect-auto">
                          {img ? (
                            <Image
                              src={img}
                              alt={p.property?.title ?? p.postTitle}
                              fill
                              sizes="260px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="text-sm text-white/40">No image</span>
                            </div>
                          )}
                          <span className="absolute left-3 top-3 rounded-full border border-purple-400/30 bg-purple-600/90 px-3 py-1 text-xs font-semibold text-purple-100">
                            {p.postType}
                          </span>
                        </div>
                      </Link>

                      <div className="min-w-0 space-y-3 border-t border-[#262626] p-5 md:border-l md:border-t-0">
                        <Link href={withLocalePath(`/posts/${p.id}`, locale)} prefetch={false}>
                          <h3 className="text-lg font-semibold text-white transition-colors hover:text-purple-400">
                            {p.property?.title ?? p.postTitle}
                          </h3>
                        </Link>
                        <div className="text-xl font-bold text-purple-300">
                          {moneyVnd(price)}
                          {p.postType === "RENT" && (
                            <span className="text-xs font-normal text-white/50"> /mo</span>
                          )}
                        </div>
                        <p className="line-clamp-2 text-sm text-white/60">{p.postTitle}</p>
                        <div className="text-xs text-white/50">Saved {formatDate(p.createdAt)}</div>
                      </div>

                      <div className="flex items-center gap-2 border-t border-[#262626] p-5 md:flex-col md:items-stretch md:justify-center md:border-l md:border-t-0">
                        <Button
                          asChild
                          className="bg-purple-600 text-white hover:bg-purple-700"
                        >
                          <Link href={withLocalePath(`/posts/${p.id}`, locale)} prefetch={false}>
                            View
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="border-[#262626] bg-transparent text-white hover:bg-red-600/10 hover:text-red-200"
                          onClick={() => handleRemoveFavorite(p.id)}
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                          )}
                          Remove
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <Pagination
            currentPage={pageIndex}
            totalPages={Math.max(1, totalPages)}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPageIndex(1);
            }}
            itemLabel={locale === "vi" ? "bài đã lưu" : "saved posts"}
            labels={
              locale === "vi"
                ? undefined
                : {
                    showing: "Showing",
                    totalPrefix: "of",
                    empty: "No",
                    rowsPerPage: "Rows/page",
                    previous: "Previous",
                    next: "Next",
                  }
            }
            isLoading={favoritesQ.isFetching}
            className="mt-8"
          />
        </div>

        {/* Help Section */}
        {posts.length > 0 && (
          <section className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-600/20 rounded-xl p-8 md:p-10">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-white mb-3">
                Ready to take the next step?
              </h2>
              <p className="text-white/70 mb-6">
                You have saved {totalItems} {totalItems === 1 ? "property" : "properties"}.
                Contact the agents to schedule viewings or get more information about properties you love.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href={withLocalePath("/agents", locale)}>Contact Agents</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                  onClick={() => favoritesQ.refetch()}
                >
                  Refresh List
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
