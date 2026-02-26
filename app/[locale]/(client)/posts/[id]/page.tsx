"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  BadgeCheck,
  Bath,
  BedDouble,
  Building2,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  Flag,
  Home,
  Loader2,
  MapPin,
  Ruler,
  Share2,
  Tag,
  Heart,
  MessageSquare,
} from "lucide-react";

import { usePublicPostDetail, useReportPost, useToggleFavorite } from "@/hooks/post/usePost";
import { useCreateInquiry } from "@/hooks/inquiry/useInquiry";
import type { PostDetailResponse } from "@/types/interfaces/api/post";
import { useAuth } from "../../auth/auth-provider";
import { ToastContainer, useToast } from "@/components/ui/toast";
import { useChatContext } from "../../chat/chat-context";
import { ReportDialog } from "@/components/client/report-post-dialog";

// ---------------- helpers ----------------
function moneyVnd(n?: string | number) {
  if (typeof n !== "string" && typeof n !== "number") return "—";
  return new Intl.NumberFormat("vi-VN").format(Number(n)) + " ₫";
}

function fmtDate(d?: Date | string | null) {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("vi-VN");
}

function primaryImageUrl(images?: { imageUrl: string; isPrimary: boolean }[]) {
  const imgs = images ?? [];
  const primary = imgs.find((x) => x.isPrimary);
  return (primary ?? imgs[0])?.imageUrl ?? null;
}

function joinLocation(p?: PostDetailResponse["property"]) {
  if (!p) return "—";
  const parts = [p.ward?.name, p.district?.name, p.province?.name].filter(Boolean);
  return parts.length ? parts.join(", ") : p.location ?? "—";
}

function dedupeStrings(arr: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of arr) {
    const k = s.trim();
    if (!k) continue;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out;
}

function formatFurnitureStatus(status?: string | null) {
  if (!status) return "—";
  const map: Record<string, string> = {
    UNFURNISHED: "Unfurnished",
    PARTLY_FURNISHED: "Partly Furnished",
    FULLY_FURNISHED: "Fully Furnished",
  };
  return map[status] ?? status;
}

function formatLegalStatus(status?: string | null) {
  if (!status) return "—";
  const map: Record<string, string> = {
    FREEHOLD: "Freehold",
    LEASEHOLD: "Leasehold",
    RED_BOOK: "Red Book",
    PINK_BOOK: "Pink Book",
    OTHER: "Other",
  };
  return map[status] ?? status;
}

function parseContact(input: string): { email?: string; phone?: string } {
  const v = input.trim();
  if (!v) return {};
  if (v.includes("@")) return { email: v };
  return { phone: v };
}

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthed, openAuthModal } = useAuth();
  const chatContext = useChatContext();

  const [reportDialogOpen, setReportDialogOpen] = React.useState(false);

  const toast = useToast();
  const createInquiryMut = useCreateInquiry();

  const postId = React.useMemo(() => {
    const n = Number(params?.id);
    return Number.isFinite(n) ? n : 0;
  }, [params]);

  const postQ = usePublicPostDetail(postId, user?.id) as {
    data?: PostDetailResponse;
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
    refetch: () => any;
  };

  const reportMut = useReportPost();
  const toggleFavoriteMut = useToggleFavorite();
  const post = postQ.data;

  // Check if post is favorited
  const isFavorited = React.useMemo(() => {
    if (!post?.favorites || !user?.id) return false;
    return post.favorites.length > 0;
  }, [post?.favorites, user?.id]);

  // gallery
  const images = post?.property?.images ?? [];
  const [imgIndex, setImgIndex] = React.useState(0);
  React.useEffect(() => setImgIndex(0), [postId]);

  const heroImg = images[imgIndex]?.imageUrl ?? primaryImageUrl(images);

  // derived chips
  const amenities = React.useMemo(() => {
    const names =
      post?.property?.propertyAmenities?.map((x) => x.amenity?.name).filter(Boolean) as
      | string[]
      | undefined;
    return dedupeStrings(names ?? []);
  }, [post]);

  const utilities = React.useMemo(() => {
    const names =
      post?.property?.propertyUtilities?.map((x) => x.utility?.name).filter(Boolean) as
      | string[]
      | undefined;
    return dedupeStrings(names ?? []);
  }, [post]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Copied", "Link đã được copy.");
    } catch {
      toast.error("Copy failed", "Không thể copy link.");
    }
  };

  const handleReport = (reason: string) => {
    if (!postId) return;

    // Prepare report data with userId if user is authenticated
    const reportData: any = { reason };
    if (isAuthed && user?.id) {
      reportData.reporterId = user.id;
    }

    reportMut.mutate(
      {
        postId,
        data: reportData,
      },
      {
        onSuccess: () => {
          toast.success("Đã gửi báo cáo", "Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét sớm nhất.");
          setReportDialogOpen(false);
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message || error?.message || "Gửi báo cáo thất bại";
          toast.error("Lỗi", msg);
        },
      }
    );
  };

  const handleToggleFavorite = () => {
    if (!isAuthed) {
      openAuthModal("signin");
      return;
    }
    if (!postId) return;
    toggleFavoriteMut.mutate(postId);
  };

  const showPrev = images.length > 1;
  const showNext = images.length > 1;

  // ============= Quick inquiry UI state =============
  const quickInquiryRef = React.useRef<HTMLDivElement | null>(null);
  const [contactValue, setContactValue] = React.useState("");
  const [questionValue, setQuestionValue] = React.useState("");

  // prefill contact nếu user đã login
  React.useEffect(() => {
    if (!isAuthed) return;
    const u: any = user as any;
    const preferred = (u?.email || u?.phone || "").toString().trim();
    if (preferred && !contactValue) setContactValue(preferred);
  }, [isAuthed, user, contactValue]);

  const sendInquiry = async (opts?: { presetMessage?: string }) => {
    if (!postId) return;

    const contact = contactValue.trim();
    const message = (opts?.presetMessage ?? questionValue).trim();

    if (!contact) {
      toast.warning("Thiếu thông tin", "Vui lòng nhập phone hoặc email để chúng tôi liên hệ.");
      return;
    }

    const { email, phone } = parseContact(contact);

    try {
      await createInquiryMut.mutateAsync({
        postId,
        name: (user as any)?.name ?? undefined,
        email,
        phone,
        message: message || undefined,
      });

      toast.success("Đã gửi inquiry", "Cảm ơn bạn! Agent sẽ liên hệ sớm.");
      setQuestionValue("");
      // giữ lại contact cho tiện
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gửi inquiry thất bại. Vui lòng thử lại.";
      toast.error("Lỗi", msg);
    }
  };

  const requestViewing = () => {
    if (!isAuthed) {
      openAuthModal("signin");
      return;
    }

    if (!post || !postId) return;

    // Get agent ID from post
    const agentId = post.createdById;
    if (!agentId) {
      toast.error("Error", "Agent information not available");
      return;
    }

    // Prepare message with post link
    const postUrl = typeof window !== "undefined" ? window.location.href : "";
    const viewingMessage =
      post.postType === "RENT"
        ? `Tôi muốn đặt lịch xem căn nhà này. Cuối tuần này có thể xem được không?\n\nLink: ${postUrl}`
        : `Tôi muốn xem căn nhà này. Khi nào tiện để mình qua xem?\n\nLink: ${postUrl}`;

    // Open chat with this message
    chatContext.openChatWithMessage(agentId, postId, viewingMessage);
  };

  const isSendingInquiry = createInquiryMut.isPending;

  return (
    <div className="bg-[#0a0a0a] text-white">
      {/* Toast UI */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-8 space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="text-white/60 text-sm">
              <Link href="/" className="hover:text-white">
                Home
              </Link>{" "}
              <span className="text-white/30">/</span>{" "}
              <Link href="/properties/rent" className="hover:text-white">
                Properties
              </Link>{" "}
              <span className="text-white/30">/</span>{" "}
              <span className="text-white/80">Post #{postId || "—"}</span>
            </div>

            {postQ.isFetching ? (
              <span className="ml-2 inline-flex items-center gap-2 text-white/40 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                refreshing
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className={`border-[#262626] text-white hover:bg-white/5 bg-transparent transition-colors ${isFavorited ? "bg-purple-600/10 border-purple-600/50" : ""
                }`}
              onClick={handleToggleFavorite}
              disabled={toggleFavoriteMut.isPending}
            >
              {toggleFavoriteMut.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Heart
                  className={`w-4 h-4 mr-2 transition-all ${isFavorited ? "fill-purple-400 text-purple-400" : "text-white/60"
                    }`}
                />
              )}
              {isFavorited ? "Saved" : "Save"}
            </Button>

            <Button
              variant="outline"
              className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
              onClick={copyLink}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy link
            </Button>

            <Button
              variant="outline"
              className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
              onClick={() => setReportDialogOpen(true)}
              disabled={reportMut.isPending}
            >
              {reportMut.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Flag className="w-4 h-4 mr-2" />
              )}
              Report
            </Button>
          </div>
        </div>

        {/* Loading / Error */}
        {postQ.isLoading ? (
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8">
            <div className="flex items-center gap-3 text-white/70">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading post detail...
            </div>
          </div>
        ) : postQ.isError || !post ? (
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8">
            <div className="text-white/70">Failed to load post detail.</div>
            <Button
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => postQ.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            {/* HERO */}
            <section className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-[1.4fr_1fr]">
                {/* Gallery */}
                <div className="relative bg-[#0a0a0a] border-b lg:border-b-0 lg:border-r border-[#262626]">
                  <div className="aspect-[16/10] w-full overflow-hidden flex items-center justify-center">
                    {heroImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={heroImg}
                        alt={post.property?.title ?? post.postTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white/40 text-sm">No image</div>
                    )}
                  </div>

                  {/* arrows */}
                  <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between">
                    <button
                      className="w-10 h-10 rounded-lg border border-[#262626] bg-[#0a0a0a]/70 hover:bg-[#0a0a0a] text-white/80 disabled:opacity-40"
                      disabled={!showPrev}
                      onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                    >
                      <ChevronLeft className="w-5 h-5 mx-auto" />
                    </button>

                    <div className="text-white/60 text-sm px-3 py-2 rounded-full border border-[#262626] bg-[#0a0a0a]/70">
                      {images.length ? `${imgIndex + 1} / ${images.length}` : "—"}
                    </div>

                    <button
                      className="w-10 h-10 rounded-lg border border-[#262626] bg-[#0a0a0a]/70 hover:bg-[#0a0a0a] text-white/80 disabled:opacity-40"
                      disabled={!showNext}
                      onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                    >
                      <ChevronRight className="w-5 h-5 mx-auto" />
                    </button>
                  </div>

                  {/* thumbnails */}
                  {images.length > 1 ? (
                    <div className="p-4 pt-0 grid grid-cols-6 gap-2">
                      {images.slice(0, 6).map((img, idx) => {
                        const active = idx === imgIndex;
                        return (
                          <button
                            key={(img as any).id ?? idx}
                            className={
                              "aspect-[4/3] rounded-lg overflow-hidden border " +
                              (active
                                ? "border-purple-600"
                                : "border-[#262626] hover:border-purple-600/40")
                            }
                            onClick={() => setImgIndex(idx)}
                            title={`Image ${idx + 1}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                {/* Summary */}
                <div className="p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-purple-600/15 border border-purple-600/40 text-purple-200 text-xs font-semibold">
                      {post.postType}
                    </span>

                    {post.property?.category?.name ? (
                      <span className="px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#262626] text-white/70 text-xs font-semibold inline-flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5" />
                        {post.property.category.name}
                      </span>
                    ) : null}

                    <span className="px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#262626] text-white/70 text-xs font-semibold">
                      {post.postStatus}
                    </span>

                    {post.publishedAt ? (
                      <span className="inline-flex items-center gap-2 text-white/60 text-xs">
                        <Calendar className="w-4 h-4" />
                        Published {fmtDate(post.publishedAt as any)}
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white text-balance">
                      {post.property?.title ?? post.postTitle}
                    </h1>
                    <p className="text-white/60">{post.postTitle}</p>
                  </div>

                  <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-5">
                    <div className="text-white/60 text-sm mb-1">Price</div>
                    <div className="text-2xl font-bold text-white">
                      {moneyVnd(post.property?.price)}
                      {post.postType === "RENT" ? (
                        <span className="text-white/50 text-base font-medium"> / month</span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-white/60 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{joinLocation(post.property)}</span>
                    </div>
                  </div>

                  {/* quick stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4">
                      <div className="text-white/50 text-xs">Area</div>
                      <div className="text-white font-semibold mt-1 inline-flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-white/60" />
                        {post.property?.area ? `${post.property.area} m²` : "—"}
                      </div>
                    </div>

                    <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4">
                      <div className="text-white/50 text-xs">Property status</div>
                      <div className="text-white font-semibold mt-1 inline-flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-purple-300" />
                        {post.property?.status ?? "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Button
                      className={`transition-colors ${isFavorited
                        ? "bg-purple-700 hover:bg-purple-800 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                      onClick={handleToggleFavorite}
                      disabled={toggleFavoriteMut.isPending}
                    >
                      {toggleFavoriteMut.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Heart
                          className={`w-4 h-4 mr-2 transition-all ${isFavorited ? "fill-white" : ""
                            }`}
                        />
                      )}
                      {isFavorited ? "Saved" : "Save to favorites"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                      onClick={copyLink}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <div className="text-white/50 text-sm">
                    Posted by{" "}
                    <span className="text-white/70 font-medium">{post.createdBy?.name ?? "—"}</span>{" "}
                    • Updated {fmtDate(post.updatedAt as any)}
                  </div>
                </div>
              </div>
            </section>

            {/* MAIN */}
            <section className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
              {/* Left */}
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                  <div className="text-white/70 leading-relaxed whitespace-pre-line">
                    {post.property?.description || post.postContent || "—"}
                  </div>
                </div>

                {/* Key facts */}
                <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-4">Key facts</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Fact
                      icon={<BedDouble className="w-5 h-5 text-white/70" />}
                      label="Bedrooms"
                      value={post.property?.bedroomNumber ?? "—"}
                    />
                    <Fact
                      icon={<Bath className="w-5 h-5 text-white/70" />}
                      label="Bathrooms"
                      value={post.property?.toiletNumber ?? "—"}
                    />
                    <Fact
                      icon={<Building2 className="w-5 h-5 text-white/70" />}
                      label="Floors"
                      value={post.property?.floorNumber ?? "—"}
                    />
                    <Fact
                      icon={<Car className="w-5 h-5 text-white/70" />}
                      label="Parking"
                      value={
                        typeof post.property?.parking === "boolean"
                          ? post.property.parking
                            ? "Yes"
                            : "No"
                          : "—"
                      }
                    />
                    <Fact
                      icon={<Compass className="w-5 h-5 text-white/70" />}
                      label="Orientation"
                      value={post.property?.orientation ?? "—"}
                    />
                    <Fact
                      icon={<Home className="w-5 h-5 text-white/70" />}
                      label="Furniture"
                      value={formatFurnitureStatus(post.property?.furnitureStatus)}
                    />
                    <Fact
                      icon={<BadgeCheck className="w-5 h-5 text-white/70" />}
                      label="Legal status"
                      value={formatLegalStatus(post.property?.legalStatus)}
                    />
                    <Fact
                      icon={<Calendar className="w-5 h-5 text-white/70" />}
                      label="Year built"
                      value={post.property?.yearBuilt ?? "—"}
                    />
                    <Fact label="Frontage" value={post.property?.frontage ? `${post.property.frontage} m` : "—"} />
                    <Fact label="Road width" value={post.property?.roadWidth ? `${post.property.roadWidth} m` : "—"} />
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-4">Amenities</h2>
                  {amenities.length ? (
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((name) => (
                        <span
                          key={name}
                          className="px-3 py-1.5 rounded-full bg-[#0a0a0a] border border-[#262626] text-sm text-white/75 hover:border-purple-600/40"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white/50 text-sm">No amenities provided.</div>
                  )}
                </div>

                {/* Nearby utilities */}
                <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-4">Nearby utilities</h2>
                  {utilities.length ? (
                    <div className="flex flex-wrap gap-2">
                      {utilities.map((name) => (
                        <span
                          key={name}
                          className="px-3 py-1.5 rounded-full bg-[#0a0a0a] border border-[#262626] text-sm text-white/75 hover:border-purple-600/40"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white/50 text-sm">No utilities provided.</div>
                  )}
                </div>

                {/* Location */}
                <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-[#262626] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-white/70" />
                      <h2 className="text-xl font-bold text-white">Location</h2>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                    >
                      <a
                        href={
                          post.property?.lat && post.property?.lon
                            ? `https://www.google.com/maps/search/?api=1&query=${post.property.lat},${post.property.lon}`
                            : undefined
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!post.property?.lat || !post.property?.lon) e.preventDefault();
                        }}
                      >
                        Open Map
                      </a>
                    </Button>
                  </div>

                  {post.property?.lat && post.property?.lon ? (
                    <div className="aspect-[16/9] relative">
                      <iframe
                        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.473663107358!2d${post.property.lon}!3d${post.property.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${post.property.lat}!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0"
                        title="Property Location Map"
                      />
                    </div>
                  ) : (
                    <div className="bg-[#0a0a0a] aspect-[16/9] flex items-center justify-center px-6">
                      <div className="text-center">
                        <div className="text-white/70 font-medium">{joinLocation(post.property)}</div>
                        <div className="text-white/40 text-sm mt-1">
                          Location coordinates not available
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right */}
              <aside className="space-y-6">
                {/* Contact card */}
                <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white">Contact</h3>
                  <p className="text-white/60 text-sm mt-1">
                    Contact the agent to view the house / negotiate the price.
                  </p>

                  <div className="mt-4 bg-[#0a0a0a] border border-[#262626] rounded-xl p-4">
                    <div className="text-white/50 text-xs">Posted by</div>
                    <div className="text-white font-semibold mt-1">
                      {post.createdBy?.name ?? "—"}
                    </div>
                    <div className="text-white/50 text-sm mt-1">
                      Created {fmtDate(post.createdAt as any)}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <Button
                      onClick={requestViewing}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Request viewing
                    </Button>

                    <Button
                      variant="outline"
                      className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                      onClick={copyLink}
                    >
                      Copy link
                    </Button>
                  </div>
                </div>

                {/* Quick inquiry (wired) */}
                <div
                  ref={quickInquiryRef}
                  className="bg-[#141414] border border-[#262626] rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white">Quick inquiry</h3>
                  <p className="text-white/60 text-sm mt-1">Gửi câu hỏi nhanh về căn này.</p>

                  <div className="mt-4 space-y-3">
                    <Input
                      value={contactValue}
                      onChange={(e) => setContactValue(e.target.value)}
                      placeholder="Your phone / email"
                      className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg h-11"
                      disabled={isSendingInquiry}
                    />

                    <Input
                      value={questionValue}
                      onChange={(e) => setQuestionValue(e.target.value)}
                      placeholder="Question (e.g., can I visit this weekend?)"
                      className="bg-[#0a0a0a] border-[#262626] text-white rounded-lg h-11"
                      disabled={isSendingInquiry}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void sendInquiry();
                      }}
                    />

                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => void sendInquiry()}
                      disabled={isSendingInquiry}
                    >
                      {isSendingInquiry ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send inquiry"
                      )}
                    </Button>

                    {!isAuthed ? (
                      <button
                        className="text-xs text-white/50 hover:text-white/70 underline underline-offset-4"
                        onClick={() => openAuthModal("signin")}
                        type="button"
                      >
                        Đăng nhập để tự điền thông tin nhanh hơn
                      </button>
                    ) : null}
                  </div>
                </div>
              </aside>
            </section>
          </>
        )}
      </div>
      <ReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        onSubmit={handleReport}
        isLoading={reportMut.isPending}
      />
    </div>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 flex items-center gap-3">
      {icon ? <div className="shrink-0">{icon}</div> : null}
      <div className="min-w-0">
        <div className="text-white/50 text-xs">{label}</div>
        <div className="text-white font-semibold mt-1 truncate">{value}</div>
      </div>
    </div>
  );
}
