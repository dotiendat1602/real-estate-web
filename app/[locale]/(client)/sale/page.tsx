"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  X,
  Grid3x3,
  List,
  Map,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

import { usePublicPosts } from "@/hooks/post/usePost";
import type { PublicPostListQuery, PostDataListItem } from "@/types/interfaces/api/post";

function primaryImageUrl(post: PostDataListItem) {
  const imgs = post.property?.images ?? [];
  const primary = imgs.find((x) => x.isPrimary);
  return (primary ?? imgs[0])?.imageUrl ?? null;
}

function moneyVnd(n?: string | number) {
  if (typeof n !== "string" && typeof n !== "number") return "—";
  return new Intl.NumberFormat("vi-VN").format(Number(n)) + " ₫";
}

export default function SalePropertyPage() {
  // -----------------------------
  // Query state (wired to API)
  // -----------------------------
  const [keyword, setKeyword] = React.useState("");
  const [appliedSearch, setAppliedSearch] = React.useState("");

  const [pageIndex, setPageIndex] = React.useState(1);
  const pageSize = 9;

  const [sortValue, setSortValue] = React.useState<
    "just_posted" | "price_low" | "price_high" | "area"
  >("just_posted");

  // Reset paging when filters change
  React.useEffect(() => {
    setPageIndex(1);
  }, [appliedSearch, sortValue]);

  const { sortKey, sortOrder } = React.useMemo(() => {
    // NOTE: backend must support these keys; otherwise keep sortKey="createdAt"
    switch (sortValue) {
      case "price_low":
        return { sortKey: "price", sortOrder: "asc" as const };
      case "price_high":
        return { sortKey: "price", sortOrder: "desc" as const };
      case "area":
        return { sortKey: "area", sortOrder: "desc" as const };
      default:
        return { sortKey: "createdAt", sortOrder: "desc" as const };
    }
  }, [sortValue]);

  const query: PublicPostListQuery = {
    pageIndex,
    pageSize,
    search: appliedSearch || undefined,
    type: "SALE",
    sortKey,
    sortOrder,
  };

  const postsQ = usePublicPosts(query);

  const totalItems = postsQ.data?.totalItems ?? 0;
  const totalPages = postsQ.data?.totalPages ?? 1;
  const posts = postsQ.data?.data ?? [];

  const showingFrom = totalItems === 0 ? 0 : (pageIndex - 1) * pageSize + 1;
  const showingTo =
    totalItems === 0
      ? 0
      : (pageIndex - 1) * pageSize + Math.min(pageSize, posts.length);

  const canPrev = pageIndex > 1;
  const canNext = pageIndex < totalPages;

  const applySearch = () => setAppliedSearch(keyword.trim());

  // Active filters (wired: search only for now)
  const activeFilters = React.useMemo(() => {
    const arr: string[] = [];
    if (appliedSearch) arr.push(appliedSearch);
    return arr;
  }, [appliedSearch]);

  return (
    <div className="bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10 space-y-6">
        {/* A) Page Header */}
        <section className="bg-[#141414] border border-[#262626] rounded-xl p-6 md:p-8">
          <div className="mt-3 flex flex-col gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Buy Properties <span className="text-white/50">(Sale Property)</span>
            </h1>
            <p className="text-white/60 max-w-3xl">
              Search by location, price range, area, bedrooms/bathrooms, amenities, and nearby utilities.
            </p>
          </div>
        </section>

        {/* B) Search + Quick Filters */}
        <section className="bg-[#141414] border border-[#262626] rounded-xl p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="flex-1">
              <Input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applySearch();
                }}
                placeholder="Search city, district, project..."
                className="bg-[#0a0a0a] border-[#262626] text-white h-12 rounded-lg w-full"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile: open filter drawer later */}
              <Button
                variant="outline"
                className="md:hidden border-[#262626] text-white hover:bg-white/5 bg-transparent h-12 px-4"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 rounded-lg"
                onClick={applySearch}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick chips (UI only for now) */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {["Hà Nội", "2PN+", "2WC+", "2-5 tỷ", "Near School"].map((filter) => (
              <button
                key={filter}
                className="bg-[#0a0a0a] border border-[#262626] rounded-full px-4 py-2 text-sm text-white/85 hover:border-purple-600 hover:text-white transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* C) Main grid */}
        <section className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Left: Sidebar filters (UI only - wire later) */}
          <aside className="hidden lg:block">
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Filters</h2>
                <button
                  className="text-white/60 hover:text-white text-sm"
                  onClick={() => {
                    setKeyword("");
                    setAppliedSearch("");
                    setSortValue("just_posted");
                  }}
                >
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                {/* Location */}
                <div>
                  <h3 className="text-white text-sm font-medium mb-3">Location</h3>
                  <div className="space-y-3">
                    <Input placeholder="Province/City" className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg" />
                    <Input placeholder="District" className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg" />
                    <Input placeholder="Ward" className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg" />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <h3 className="text-white text-sm font-medium mb-3">Property Type</h3>
                  <select className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-3 py-2.5">
                    <option>All</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <h3 className="text-white text-sm font-medium mb-3">Price Range (VND)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Min" className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg" />
                    <Input placeholder="Max" className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg" />
                  </div>
                </div>

                {/* Area */}
                <div>
                  <h3 className="text-white text-sm font-medium mb-3">Area (m²)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Min" className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg" />
                    <Input placeholder="Max" className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg" />
                  </div>
                </div>

                {/* Beds/Baths */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h3 className="text-white text-sm font-medium mb-3">Bedrooms</h3>
                    <select className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-3 py-2.5">
                      <option>Any</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-medium mb-3">Bathrooms</h3>
                    <select className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-3 py-2.5">
                      <option>Any</option>
                    </select>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-white text-sm font-medium mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Balcony", "Furnished", "Parking", "Gym", "Pool", "Elevator"].map((amenity) => (
                      <button
                        key={amenity}
                        className="bg-[#0a0a0a] border border-[#262626] text-white/80 px-3 py-1.5 rounded-lg text-sm hover:border-purple-600 hover:text-purple-400 transition-colors"
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nearby */}
                <div>
                  <h3 className="text-white text-sm font-medium mb-3">Nearby Utilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {["School", "Hospital", "Supermarket", "Park", "Metro"].map((utility) => (
                      <button
                        key={utility}
                        className="bg-[#0a0a0a] border border-[#262626] text-white/80 px-3 py-1.5 rounded-lg text-sm hover:border-purple-600 hover:text-purple-400 transition-colors"
                      >
                        {utility}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-lg font-medium"
                  onClick={() => postsQ.refetch()}
                >
                  Apply Filters
                </Button>

                <div className="pt-6 border-t border-[#262626]">
                  <h3 className="text-white font-medium mb-2">Need Help?</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Save your search and get notified when matching properties are posted.
                  </p>
                  <Button variant="outline" className="w-full border-[#262626] text-white hover:bg-white/5 bg-transparent">
                    Save Search
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Right: Listings */}
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-white">
                  Showing <span className="font-semibold">{showingFrom}-{showingTo}</span> of{" "}
                  <span className="font-semibold">{totalItems}</span> properties
                  {postsQ.isFetching && (
                    <span className="ml-3 text-white/50 text-sm inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">Sort:</span>
                    <select
                      value={sortValue}
                      onChange={(e) => setSortValue(e.target.value as typeof sortValue)}
                      className="bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="just_posted">Just posted</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="area">Area</option>
                    </select>
                  </div>

                  <div className="hidden md:flex items-center gap-2 border-l border-[#262626] pl-4">
                    <button className="p-2 bg-purple-600 text-white rounded-lg">
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-white/60 hover:bg-white/5 rounded-lg">
                      <List className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-white/60 hover:bg-white/5 rounded-lg">
                      <Map className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active filters (wired: search only) */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                {activeFilters.map((label) => (
                  <div
                    key={label}
                    className="bg-[#0a0a0a] border border-[#262626] rounded-full px-3 py-1.5 text-sm text-white flex items-center gap-2"
                  >
                    {label}
                    <button
                      className="text-white/60 hover:text-white"
                      onClick={() => {
                        setAppliedSearch("");
                        setKeyword("");
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            {postsQ.isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
                    <div className="bg-[#0a0a0a] border-b border-[#262626] aspect-[4/3]" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-white/10 rounded w-2/3" />
                      <div className="h-4 bg-white/10 rounded w-5/6" />
                      <div className="h-4 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : postsQ.isError ? (
              <div className="bg-[#141414] border border-[#262626] rounded-xl p-10 md:p-12">
                <div className="text-white/70">Failed to load sale listings.</div>
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white" onClick={() => postsQ.refetch()}>
                  Retry
                </Button>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-[#141414] border border-[#262626] rounded-xl p-10 md:p-12 min-h-[420px] flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-[#0a0a0a] border border-[#262626] rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white/70">No properties match your current filters</p>
                  <p className="text-white/40 text-sm mt-2">Try adjusting your search criteria</p>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((p) => {
                  const img = primaryImageUrl(p);
                  const price = p.property?.price;

                  return (
                    <article
                      key={p.id}
                      className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden hover:border-purple-600/30 transition-colors"
                    >
                      <div className="bg-[#0a0a0a] border-b border-[#262626] aspect-[4/3] overflow-hidden">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img}
                            alt={p.property?.title ?? p.postTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white/40 text-sm">Thumbnail</span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-white font-semibold line-clamp-1">
                            {p.property?.title ?? p.postTitle}
                          </div>
                          <div className="text-purple-300 text-sm font-semibold whitespace-nowrap">
                            {moneyVnd(price)}
                          </div>
                        </div>

                        <div className="text-white/60 text-sm line-clamp-2">{p.postTitle}</div>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-white/50 text-sm">By {p.createdBy?.name ?? "—"}</span>

                          <Link
                            href={`/posts/${p.id}`}
                            className="text-purple-400 hover:text-purple-300 text-sm inline-flex items-center gap-1"
                          >
                            View <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <button
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:bg-white/5 rounded-lg border border-[#262626] disabled:opacity-40 disabled:hover:bg-transparent"
                disabled={!canPrev || postsQ.isFetching}
                onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-white/60 text-sm px-4">
                {String(pageIndex).padStart(2, "0")} of {String(totalPages).padStart(2, "0")}
              </span>

              <button
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:bg-white/5 rounded-lg border border-[#262626] disabled:opacity-40 disabled:hover:bg-transparent"
                disabled={!canNext || postsQ.isFetching}
                onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
