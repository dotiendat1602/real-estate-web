"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  X,
  Heart,
  ChevronDown,
  LayoutDashboard,
  Building2,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/app/[locale]/(client)/auth/auth-provider";

type Role = "ADMIN" | "MANAGER" | "AGENT" | "USER";

const LOCALES = new Set(["en", "vi"]); // thêm locale khác nếu có

export default function Header() {
  const pathname = usePathname();
  const { isAuthed, user, openAuthModal, signOut, isLoadingUser } = useAuth();

  const [showBanner, setShowBanner] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // lấy locale từ url: /en/sale => en
  const locale = useMemo(() => {
    const seg = (pathname ?? "").split("/").filter(Boolean);
    const first = seg[0];
    return first && LOCALES.has(first) ? first : null;
  }, [pathname]);

  // normalize path: /en/sale -> /sale
  const normalizedPath = useMemo(() => {
    if (!pathname) return "";
    const seg = pathname.split("/").filter(Boolean);
    if (seg[0] && LOCALES.has(seg[0])) seg.shift();
    return "/" + seg.join("/");
  }, [pathname]);

  const role: Role | undefined = useMemo(() => {
    const r1 = (user as any)?.role as Role | undefined;
    if (r1) return r1;
    const r2 = (user as any)?.roles?.[0] as Role | undefined;
    return r2;
  }, [user]);

  const canDashboard = role === "ADMIN" || role === "MANAGER";
  const canManageProperties = role === "ADMIN" || role === "MANAGER" || role === "AGENT";
  const canManagePosts = role === "ADMIN" || role === "MANAGER" || role === "AGENT";
  const canManageInquiries = role === "ADMIN" || role === "MANAGER" || role === "AGENT";
  const canSaved = role === "USER";

  const withLocale = (href: string) => (locale ? `/${locale}${href}` : href);

  // check active theo normalizedPath
  const isActive = (href: string, exact = false) => {
    if (!normalizedPath) return false;
    if (exact) return normalizedPath === href;
    return normalizedPath === href || normalizedPath.startsWith(href + "/");
  };

  // Active rõ ràng hơn: đậm + underline tím
  const navItemClass = (href: string, exact = false) =>
    isActive(href, exact)
      ? "text-white font-semibold relative after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-purple-600"
      : "text-white/70 hover:text-white";

  const pillClass = (href: string) =>
    "h-10 px-3 inline-flex items-center gap-2 rounded-xl border transition " +
    (isActive(href)
      ? "border-purple-600/60 bg-purple-600/10 text-white"
      : "border-[#1a1a1a] bg-white/0 text-white/80 hover:bg-white/5 hover:text-white");

  // Dropdown item styles (fix hover/focus losing text)
  const ddItemClass =
    "cursor-pointer text-white/90 focus:text-white data-[highlighted]:text-white " +
    "focus:bg-white/10 data-[highlighted]:bg-white/10 active:bg-white/15";
  const ddItemLinkClass = "flex w-full items-center gap-2";

  return (
    <>
      {showBanner && (
        <div className="bg-[#0f0f0f] border-b border-[#1a1a1a] py-2.5 px-4 sm:px-8 lg:px-14 2xl:px-20">
          <div className="max-w-[1680px] mx-auto flex items-center justify-between text-sm">
            <div className="flex-1" />
            <div className="text-white/80 text-center">
              ✨ Discover Your Dream Property with Estatein{" "}
              <Link
                href={withLocale("/learn-more")}
                className="text-white underline hover:no-underline ml-1"
              >
                Learn More
              </Link>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                type="button"
                className="text-white/60 hover:text-white"
                onClick={() => setShowBanner(false)}
                aria-label="Close banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-[#0a0a0a] border-b border-[#1a1a1a] py-4 px-4 sm:px-8 lg:px-14 2xl:px-20">
        <div className="max-w-[1680px] mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-6">
          {/* Logo */}
          <Link href={withLocale("/")} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
              <div
                className="w-4 h-4 bg-white rounded-full"
                style={{
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
              />
            </div>
            <span className="text-xl font-bold text-white">Estatein</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-10 lg:gap-12">
            <Link
              href={withLocale("/home")}
              className={`${navItemClass("/home", true)} transition-colors`}
            >
              Home
            </Link>
            <Link href={withLocale("/rent")} className={`${navItemClass("/rent")} transition-colors`}>
              Rent Property
            </Link>
            <Link href={withLocale("/sale")} className={`${navItemClass("/sale")} transition-colors`}>
              Sale Property
            </Link>
            <Link href={withLocale("/news")} className={`${navItemClass("/news")} transition-colors`}>
              News
            </Link>
            <Link
              href={withLocale("/contacts")}
              className={`${navItemClass("/contacts")} transition-colors`}
            >
              Contacts
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 md:gap-3 shrink-0">
            {/* Saved for USER role only */}
            {canSaved && (
              <div className="hidden lg:flex items-center gap-2 mr-2">
                <Link href={withLocale("/saved")} className={pillClass("/saved")}>
                  <Heart className="w-4 h-4" />
                  Saved
                </Link>
              </div>
            )}

            {/* Auth */}
            {!mounted || isLoadingUser ? (
              <div className="h-10 w-[180px] rounded-xl bg-white/5 border border-[#1a1a1a] animate-pulse" />
            ) : !isAuthed ? (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={() => openAuthModal("signin")}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => openAuthModal("signup")}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="group text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
                  >
                    <span className="hidden md:block">
                      <span className="text-white/60 group-hover:text-white/90 transition-colors">
                        Xin chào,
                      </span>{" "}
                      <span className="font-medium text-white group-hover:text-purple-200 transition-colors">
                        {user?.name ?? user?.email}
                      </span>
                    </span>
                    <span className="md:hidden">Menu</span>
                    <ChevronDown className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-[#141414] border-[#262626] text-white"
                >
                  {/* Admin/Manager Dashboard */}
                  {canDashboard && (
                    <>
                      <DropdownMenuItem asChild className={ddItemClass}>
                        <Link
                          href={withLocale("/admin/pages/dashboard")}
                          className={ddItemLinkClass}
                        >
                          <LayoutDashboard className="w-4 h-4 text-white/80" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#262626]" />
                    </>
                  )}

                  {/* Agent/Manager/Admin Management */}
                  {canManageProperties && (
                    <DropdownMenuItem asChild className={ddItemClass}>
                      <Link href={withLocale("/my-properties")} className={ddItemLinkClass}>
                        <Building2 className="w-4 h-4 text-white/80" />
                        <span>My Properties</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {canManagePosts && (
                    <DropdownMenuItem asChild className={ddItemClass}>
                      <Link href={withLocale("/my-posts")} className={ddItemLinkClass}>
                        <FileText className="w-4 h-4 text-white/80" />
                        <span>My Posts</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {canManageInquiries && (
                    <DropdownMenuItem asChild className={ddItemClass}>
                      <Link href={withLocale("/my-inquiries")} className={ddItemLinkClass}>
                        <MessageSquare className="w-4 h-4 text-white/80" />
                        <span>My Inquiries</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-[#262626]" />

                  <DropdownMenuItem
                    onClick={signOut}
                    className="
                      cursor-pointer
                      text-red-300
                      focus:text-red-200 data-[highlighted]:text-red-200
                      focus:bg-red-500/10 data-[highlighted]:bg-red-500/10
                    "
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
