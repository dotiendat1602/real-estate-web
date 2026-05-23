"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Bath,
  BedDouble,
  ChevronRight,
  Grid3x3,
  Loader2,
  MapPin,
  Ruler,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertySearchChips, {
  appendSearchChip,
} from "@/components/client/property-search-chips";
import { useAmenities } from "@/hooks/categories-regions/useAmenity";
import { useCategoriesProperty } from "@/hooks/categories-regions/useCategoryProperty";
import { useDistricts, useProvinces, useWards } from "@/hooks/categories-regions/useLocation";
import { useUtilities } from "@/hooks/categories-regions/useUtility";
import { usePublicPosts } from "@/hooks/post/usePost";
import { withLocalePath } from "@/lib/utils/i18n";
import type { PostDataListItem, PublicPostListQuery } from "@/types/interfaces/api/post";
import Pagination from "@/components/ui/pagination";

type ListingMode = "SALE" | "RENT";
type SortValue = "newest" | "price_asc" | "price_desc" | "area_desc";

type FilterDraft = {
  search: string;
  priceFrom: string;
  priceTo: string;
  areaFrom: string;
  areaTo: string;
  bedroomNumber: string;
  toiletNumber: string;
  categoryId: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  amenityIds: number[];
  utilityIds: number[];
};

const emptyDraft: FilterDraft = {
  search: "",
  priceFrom: "",
  priceTo: "",
  areaFrom: "",
  areaTo: "",
  bedroomNumber: "",
  toiletNumber: "",
  categoryId: "",
  provinceId: "",
  districtId: "",
  wardId: "",
  amenityIds: [],
  utilityIds: [],
};

const copy = {
  en: {
    saleTitle: "Sale Properties",
    rentTitle: "Rent Properties",
    saleIntro: "Filter approved sale listings by location, price, area, rooms, amenities, and nearby utilities.",
    rentIntro: "Filter approved rental listings by location, monthly rent, area, rooms, amenities, and nearby utilities.",
    searchPlaceholder: "Search city, district, project, street...",
    search: "Search",
    filters: "Filters",
    reset: "Reset",
    apply: "Apply filters",
    location: "Location",
    propertyType: "Property type",
    all: "All",
    price: "Price",
    rent: "Monthly rent",
    min: "Min",
    max: "Max",
    area: "Area",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    any: "Any",
    amenities: "Amenities",
    nearby: "Nearby utilities",
    showing: "Showing",
    of: "of",
    properties: "properties",
    updating: "Updating...",
    sort: "Sort",
    newest: "Newest",
    priceAsc: "Price: Low to High",
    priceDesc: "Price: High to Low",
    areaDesc: "Area: Large to Small",
    loadError: "Failed to load listings.",
    retry: "Retry",
    noResult: "No properties match your current filters",
    adjust: "Try adjusting your search criteria",
    view: "View",
    by: "By",
    province: "Province/City",
    district: "District",
    ward: "Ward",
    vnd: "VND",
    month: "/mo",
  },
  vi: {
    saleTitle: "Bất động sản bán",
    rentTitle: "Bất động sản cho thuê",
    saleIntro: "Lọc tin bán đã duyệt theo vị trí, giá, diện tích, số phòng, tiện nghi và tiện ích xung quanh.",
    rentIntro: "Lọc tin thuê đã duyệt theo vị trí, giá thuê, diện tích, số phòng, tiện nghi và tiện ích xung quanh.",
    searchPlaceholder: "Tìm thành phố, quận, dự án, tên đường...",
    search: "Tìm kiếm",
    filters: "Bộ lọc",
    reset: "Đặt lại",
    apply: "Áp dụng bộ lọc",
    location: "Vị trí",
    propertyType: "Loại bất động sản",
    all: "Tất cả",
    price: "Giá",
    rent: "Giá thuê tháng",
    min: "Từ",
    max: "Đến",
    area: "Diện tích",
    bedrooms: "Phòng ngủ",
    bathrooms: "Phòng tắm",
    any: "Bất kỳ",
    amenities: "Tiện nghi",
    nearby: "Tiện ích xung quanh",
    showing: "Hiển thị",
    of: "trên",
    properties: "bất động sản",
    updating: "Đang cập nhật...",
    sort: "Sắp xếp",
    newest: "Mới nhất",
    priceAsc: "Giá: thấp đến cao",
    priceDesc: "Giá: cao đến thấp",
    areaDesc: "Diện tích: lớn đến nhỏ",
    loadError: "Không tải được danh sách.",
    retry: "Thử lại",
    noResult: "Không có bất động sản phù hợp bộ lọc",
    adjust: "Hãy thử điều chỉnh tiêu chí tìm kiếm",
    view: "Xem",
    by: "Đăng bởi",
    province: "Tỉnh/Thành phố",
    district: "Quận/Huyện",
    ward: "Phường/Xã",
    vnd: "VND",
    month: "/tháng",
  },
};

function primaryImageUrl(post: PostDataListItem) {
  const imgs = post.property?.images ?? [];
  const primary = imgs.find((x) => x.isPrimary);
  return (primary ?? imgs[0])?.imageUrl ?? null;
}

function toNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function moneyVnd(value?: number | string | null) {
  if (value === undefined || value === null || value === "") return "—";
  return `${new Intl.NumberFormat("vi-VN").format(Number(value))} VND`;
}

function locationText(post: PostDataListItem) {
  const parts = [post.property?.ward?.name, post.property?.district?.name, post.property?.province?.name].filter(Boolean);
  return parts.length ? parts.join(", ") : post.property?.location ?? "—";
}

function toggleId(ids: number[], id: number) {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

function draftFromParams(params: URLSearchParams): FilterDraft {
  const parseIds = (key: string) =>
    (params.get(key) ?? "")
      .split(",")
      .map((item) => Number(item))
      .filter((item) => Number.isInteger(item) && item > 0);

  return {
    search: params.get("search") ?? "",
    priceFrom: params.get("priceFrom") ?? "",
    priceTo: params.get("priceTo") ?? "",
    areaFrom: params.get("areaFrom") ?? "",
    areaTo: params.get("areaTo") ?? "",
    bedroomNumber: params.get("bedroomNumber") ?? "",
    toiletNumber: params.get("toiletNumber") ?? "",
    categoryId: params.get("categoryId") ?? "",
    provinceId: params.get("provinceId") ?? "",
    districtId: params.get("districtId") ?? "",
    wardId: params.get("wardId") ?? "",
    amenityIds: parseIds("amenityIds"),
    utilityIds: parseIds("utilityIds"),
  };
}

function queryFromDraft(draft: FilterDraft, mode: ListingMode, pageIndex: number, pageSize: number, sortValue: SortValue): PublicPostListQuery {
  const sort =
    sortValue === "price_asc"
      ? { sortKey: "price", sortOrder: "asc" as const }
      : sortValue === "price_desc"
        ? { sortKey: "price", sortOrder: "desc" as const }
        : sortValue === "area_desc"
          ? { sortKey: "area", sortOrder: "desc" as const }
          : { sortKey: "createdAt", sortOrder: "desc" as const };

  return {
    pageIndex,
    pageSize,
    type: mode,
    search: draft.search.trim() || undefined,
    priceFrom: toNumber(draft.priceFrom),
    priceTo: toNumber(draft.priceTo),
    areaFrom: toNumber(draft.areaFrom),
    areaTo: toNumber(draft.areaTo),
    bedroomNumber: toNumber(draft.bedroomNumber),
    toiletNumber: toNumber(draft.toiletNumber),
    categoryId: toNumber(draft.categoryId),
    provinceId: toNumber(draft.provinceId),
    districtId: toNumber(draft.districtId),
    wardId: toNumber(draft.wardId),
    amenityIds: draft.amenityIds.length ? draft.amenityIds : undefined,
    utilityIds: draft.utilityIds.length ? draft.utilityIds : undefined,
    ...sort,
  };
}

export default function PostListingPage({ mode }: { mode: ListingMode }) {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const text = locale === "vi" ? copy.vi : copy.en;
  const initialDraft = React.useMemo(() => draftFromParams(searchParams), [searchParams]);

  const [draft, setDraft] = React.useState<FilterDraft>(initialDraft);
  const [applied, setApplied] = React.useState<FilterDraft>(initialDraft);
  const [pageIndex, setPageIndex] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(9);
  const [sortValue, setSortValue] = React.useState<SortValue>("newest");
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  const [filterError, setFilterError] = React.useState("");

  const provincesQ = useProvinces();
  const districtsQ = useDistricts(toNumber(draft.provinceId));
  const wardsQ = useWards(toNumber(draft.districtId));
  const categoriesQ = useCategoriesProperty({ pageIndex: 1, pageSize: 100, sortKey: "categoryName", sortOrder: "asc" });
  const amenitiesQ = useAmenities({ pageIndex: 1, pageSize: 100, sortKey: "name", sortOrder: "asc" });
  const utilitiesQ = useUtilities({ pageIndex: 1, pageSize: 100, sortKey: "utilityName", sortOrder: "asc" });

  React.useEffect(() => {
    setPageIndex(1);
  }, [applied, sortValue]);

  const query = React.useMemo(
    () => queryFromDraft(applied, mode, pageIndex, pageSize, sortValue),
    [applied, mode, pageIndex, pageSize, sortValue],
  );

  const postsQ = usePublicPosts(query);

  const totalItems = postsQ.data?.totalItems ?? 0;
  const totalPages = postsQ.data?.totalPages ?? 1;
  const posts = postsQ.data?.data ?? [];
  const showingFrom = totalItems === 0 ? 0 : (pageIndex - 1) * pageSize + 1;
  const showingTo = totalItems === 0 ? 0 : (pageIndex - 1) * pageSize + Math.min(pageSize, posts.length);

  const setField = (key: keyof FilterDraft, value: string | number[]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const appendChipToSearch = (label: string) => {
    setDraft((current) => ({
      ...current,
      search: appendSearchChip(current.search, label),
    }));
  };

  const applyFilters = () => {
    if (toNumber(draft.priceFrom) !== undefined && Number(draft.priceFrom) < 0) {
      setFilterError("Giá không được nhập số âm.");
      return;
    }

    if (toNumber(draft.priceTo) !== undefined && Number(draft.priceTo) < 0) {
      setFilterError("Giá không được nhập số âm.");
      return;
    }

    setFilterError("");
    setApplied(draft);
    setShowMobileFilters(false);
  };

  const resetFilters = () => {
    setDraft(emptyDraft);
    setApplied(emptyDraft);
    setSortValue("newest");
    setShowMobileFilters(false);
    setFilterError("");
  };

  const activeLabels = React.useMemo(() => {
    const labels: { key: keyof FilterDraft | "sort"; label: string }[] = [];
    if (applied.search) labels.push({ key: "search", label: applied.search });
    if (applied.priceFrom || applied.priceTo) labels.push({ key: "priceFrom", label: `${moneyVnd(applied.priceFrom || 0)} - ${applied.priceTo ? moneyVnd(applied.priceTo) : "∞"}` });
    if (applied.areaFrom || applied.areaTo) labels.push({ key: "areaFrom", label: `${applied.areaFrom || 0} - ${applied.areaTo || "∞"} m2` });
    if (applied.bedroomNumber) labels.push({ key: "bedroomNumber", label: `${applied.bedroomNumber}+ ${text.bedrooms}` });
    if (applied.toiletNumber) labels.push({ key: "toiletNumber", label: `${applied.toiletNumber}+ ${text.bathrooms}` });

    const category = categoriesQ.data?.data.find((item) => String(item.id) === applied.categoryId);
    if (category) labels.push({ key: "categoryId", label: category.categoryName });

    const province = provincesQ.data?.find((item) => String(item.id) === applied.provinceId);
    const district = districtsQ.data?.find((item) => String(item.id) === applied.districtId);
    const ward = wardsQ.data?.find((item) => String(item.id) === applied.wardId);
    if (ward || district || province) labels.push({ key: "provinceId", label: [ward?.name, district?.name, province?.name].filter(Boolean).join(", ") });

    applied.amenityIds.forEach((id) => {
      const amenity = amenitiesQ.data?.data.find((item) => item.id === id);
      labels.push({ key: "amenityIds", label: amenity?.name ?? `Amenity #${id}` });
    });
    applied.utilityIds.forEach((id) => {
      const utility = utilitiesQ.data?.data.find((item) => item.id === id);
      labels.push({ key: "utilityIds", label: utility?.utilityName ?? `Utility #${id}` });
    });
    return labels;
  }, [amenitiesQ.data?.data, applied, categoriesQ.data?.data, districtsQ.data, provincesQ.data, text.bathrooms, text.bedrooms, utilitiesQ.data?.data, wardsQ.data]);

  const removeFilter = (key: keyof FilterDraft | "sort") => {
    if (key === "amenityIds" || key === "utilityIds") {
      setApplied((current) => ({ ...current, [key]: [] }));
      setDraft((current) => ({ ...current, [key]: [] }));
      return;
    }

    if (key === "provinceId") {
      setApplied((current) => ({ ...current, provinceId: "", districtId: "", wardId: "" }));
      setDraft((current) => ({ ...current, provinceId: "", districtId: "", wardId: "" }));
      return;
    }

    if (key === "priceFrom") {
      setApplied((current) => ({ ...current, priceFrom: "", priceTo: "" }));
      setDraft((current) => ({ ...current, priceFrom: "", priceTo: "" }));
      return;
    }

    if (key === "areaFrom") {
      setApplied((current) => ({ ...current, areaFrom: "", areaTo: "" }));
      setDraft((current) => ({ ...current, areaFrom: "", areaTo: "" }));
      return;
    }

    if (key !== "sort") {
      setApplied((current) => ({ ...current, [key]: "" }));
      setDraft((current) => ({ ...current, [key]: "" }));
    }
  };

  const quickFilters =
    mode === "SALE"
      ? [
        "2+ bedrooms",
        "2+ bathrooms",
        "2-5B VND",
        "80+ m2",
      ]
      : [
        "2+ bedrooms",
        "2+ bathrooms",
        "8-15M VND",
        "50+ m2",
      ];

  const filterPanel = (
    <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">{text.filters}</h2>
        <button className="text-white/60 hover:text-white text-sm" onClick={resetFilters}>
          {text.reset}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-white text-sm font-medium mb-3">{text.location}</h3>
          <div className="space-y-3">
            <select
              value={draft.provinceId}
              onChange={(event) => {
                setDraft((current) => ({ ...current, provinceId: event.target.value, districtId: "", wardId: "" }));
              }}
              className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-3 py-2.5"
            >
              <option value="">{text.province}</option>
              {provincesQ.data?.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>

            <select
              value={draft.districtId}
              onChange={(event) => {
                setDraft((current) => ({ ...current, districtId: event.target.value, wardId: "" }));
              }}
              disabled={!draft.provinceId}
              className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-3 py-2.5 disabled:opacity-50"
            >
              <option value="">{text.district}</option>
              {districtsQ.data?.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>

            <select
              value={draft.wardId}
              onChange={(event) => setField("wardId", event.target.value)}
              disabled={!draft.districtId}
              className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-3 py-2.5 disabled:opacity-50"
            >
              <option value="">{text.ward}</option>
              {wardsQ.data?.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-white text-sm font-medium mb-3">{text.propertyType}</h3>
          <select
            value={draft.categoryId}
            onChange={(event) => setField("categoryId", event.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-3 py-2.5"
          >
            <option value="">{text.all}</option>
            {categoriesQ.data?.data.map((item) => (
              <option key={item.id} value={item.id}>{item.categoryName}</option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-white text-sm font-medium mb-3">{mode === "RENT" ? text.rent : text.price} ({text.vnd})</h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              min="0"
              value={draft.priceFrom}
              onChange={(event) => {
                setField("priceFrom", event.target.value);
                setFilterError(Number(event.target.value) < 0 ? "Giá không được nhập số âm." : "");
              }}
              placeholder={text.min}
              className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg"
            />
            <Input
              type="number"
              min="0"
              value={draft.priceTo}
              onChange={(event) => {
                setField("priceTo", event.target.value);
                setFilterError(Number(event.target.value) < 0 ? "Giá không được nhập số âm." : "");
              }}
              placeholder={text.max}
              className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg"
            />
          </div>
          {filterError && <p className="mt-2 text-sm text-red-400">{filterError}</p>}
        </div>

        <div>
          <h3 className="text-white text-sm font-medium mb-3">{text.area} (m2)</h3>
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" min="0" value={draft.areaFrom} onChange={(event) => setField("areaFrom", event.target.value)} placeholder={text.min} className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg" />
            <Input type="number" min="0" value={draft.areaTo} onChange={(event) => setField("areaTo", event.target.value)} placeholder={text.max} className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h3 className="text-white text-sm font-medium mb-3">{text.bedrooms}</h3>
            <select value={draft.bedroomNumber} onChange={(event) => setField("bedroomNumber", event.target.value)} className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-3 py-2.5">
              <option value="">{text.any}</option>
              {[1, 2, 3, 4, 5].map((item) => <option key={item} value={item}>{item}+</option>)}
            </select>
          </div>
          <div>
            <h3 className="text-white text-sm font-medium mb-3">{text.bathrooms}</h3>
            <select value={draft.toiletNumber} onChange={(event) => setField("toiletNumber", event.target.value)} className="w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-3 py-2.5">
              <option value="">{text.any}</option>
              {[1, 2, 3, 4, 5].map((item) => <option key={item} value={item}>{item}+</option>)}
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-white text-sm font-medium mb-3">{text.amenities}</h3>
          <div className="flex flex-wrap gap-2">
            {amenitiesQ.data?.data.slice(0, 12).map((amenity) => {
              const active = draft.amenityIds.includes(amenity.id);
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => setField("amenityIds", toggleId(draft.amenityIds, amenity.id))}
                  className={`border px-3 py-1.5 rounded-lg text-sm transition-colors ${active ? "bg-purple-600 border-purple-500 text-white" : "bg-[#0a0a0a] border-[#262626] text-white/80 hover:border-purple-600"}`}
                >
                  {amenity.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-white text-sm font-medium mb-3">{text.nearby}</h3>
          <div className="flex flex-wrap gap-2">
            {utilitiesQ.data?.data.slice(0, 12).map((utility) => {
              const active = draft.utilityIds.includes(utility.id);
              return (
                <button
                  key={utility.id}
                  type="button"
                  onClick={() => setField("utilityIds", toggleId(draft.utilityIds, utility.id))}
                  className={`border px-3 py-1.5 rounded-lg text-sm transition-colors ${active ? "bg-purple-600 border-purple-500 text-white" : "bg-[#0a0a0a] border-[#262626] text-white/80 hover:border-purple-600"}`}
                >
                  {utility.utilityName}
                </button>
              );
            })}
          </div>
        </div>

        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-lg font-medium" onClick={applyFilters}>
          {text.apply}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10 space-y-6">
        <section className="bg-[#141414] border border-[#262626] rounded-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {mode === "SALE" ? text.saleTitle : text.rentTitle}
          </h1>
          <p className="mt-3 text-white/60 max-w-3xl">
            {mode === "SALE" ? text.saleIntro : text.rentIntro}
          </p>
        </section>

        <section className="bg-[#141414] border border-[#262626] rounded-xl p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <Input
              type="text"
              value={draft.search}
              onChange={(event) => setField("search", event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") applyFilters();
              }}
              placeholder={text.searchPlaceholder}
              className="bg-[#0a0a0a] border-[#262626] text-white h-12 rounded-lg w-full"
            />

            <div className="flex items-center gap-3">
              <Button variant="outline" className="lg:hidden border-[#262626] text-white hover:bg-white/5 bg-transparent h-12 px-4" onClick={() => setShowMobileFilters((value) => !value)}>
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {text.filters}
              </Button>

              <Button className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 rounded-lg" onClick={applyFilters}>
                <Search className="w-4 h-4 mr-2" />
                {text.search}
              </Button>
            </div>
          </div>

          <PropertySearchChips
            chips={quickFilters}
            onSelect={appendChipToSearch}
            className="mt-4"
            chipClassName="rounded-full border border-[#262626] bg-[#0a0a0a] px-4 py-2 text-sm text-white/85 transition-colors hover:border-purple-600 hover:text-white"
          />
        </section>

        {showMobileFilters && <div className="lg:hidden">{filterPanel}</div>}

        <section className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <aside className="hidden lg:block sticky top-6 self-start">{filterPanel}</aside>

          <div className="space-y-6">
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-white">
                  {text.showing} <span className="font-semibold">{showingFrom}-{showingTo}</span> {text.of}{" "}
                  <span className="font-semibold">{totalItems}</span> {text.properties}
                  {postsQ.isFetching && (
                    <span className="ml-3 text-white/50 text-sm inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {text.updating}
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">{text.sort}:</span>
                    <select value={sortValue} onChange={(event) => setSortValue(event.target.value as SortValue)} className="bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-3 py-2 text-sm">
                      <option value="newest">{text.newest}</option>
                      <option value="price_asc">{text.priceAsc}</option>
                      <option value="price_desc">{text.priceDesc}</option>
                      <option value="area_desc">{text.areaDesc}</option>
                    </select>
                  </div>

                  <div className="hidden md:flex items-center gap-2 border-l border-[#262626] pl-4">
                    <button className="p-2 bg-purple-600 text-white rounded-lg" aria-label="Grid view">
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 flex-wrap">
                {activeLabels.map((item) => (
                  <div key={`${item.key}-${item.label}`} className="bg-[#0a0a0a] border border-[#262626] rounded-full px-3 py-1.5 text-sm text-white flex items-center gap-2">
                    {item.label}
                    <button className="text-white/60 hover:text-white" onClick={() => removeFilter(item.key)} aria-label={`Remove ${item.label}`}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {postsQ.isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
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
                <div className="text-white/70">{text.loadError}</div>
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white" onClick={() => postsQ.refetch()}>
                  {text.retry}
                </Button>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-[#141414] border border-[#262626] rounded-xl p-10 md:p-12 min-h-[420px] flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-[#0a0a0a] border border-[#262626] rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white/70">{text.noResult}</p>
                  <p className="text-white/40 text-sm mt-2">{text.adjust}</p>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                  const img = primaryImageUrl(post);
                  return (
                    <article key={post.id} className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden hover:border-purple-600/30 transition-colors">
                      <div className="relative bg-[#0a0a0a] border-b border-[#262626] aspect-[4/3] overflow-hidden">
                        {img ? (
                          <Image src={img} alt={post.property?.title ?? post.postTitle} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white/40 text-sm">Thumbnail</span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-white font-semibold line-clamp-2">{post.property?.title ?? post.postTitle}</div>
                          <div className="text-purple-300 text-sm font-semibold whitespace-nowrap">
                            {moneyVnd(post.property?.price)}{mode === "RENT" ? text.month : ""}
                          </div>
                        </div>

                        <div className="text-white/60 text-sm line-clamp-2">{post.postTitle}</div>
                        <div className="flex items-center gap-1 text-white/50 text-sm">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="line-clamp-1">{locationText(post)}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-white/60 text-xs">
                          <span className="inline-flex items-center gap-1"><Ruler className="w-3.5 h-3.5" />{post.property?.area ?? "—"} m2</span>
                          <span className="inline-flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{post.property?.bedroomNumber ?? "—"}</span>
                          <span className="inline-flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{post.property?.toiletNumber ?? "—"}</span>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-white/50 text-sm">{text.by} {post.createdBy?.name ?? "—"}</span>
                          <Link href={withLocalePath(`/posts/${post.id}`, locale)} prefetch={false} className="text-purple-400 hover:text-purple-300 text-sm inline-flex items-center gap-1">
                            {text.view} <ChevronRight className="w-4 h-4" />
                          </Link>
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
              itemLabel={text.properties}
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
              isLoading={postsQ.isFetching}
              className="mt-8"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
