"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronDown,
  FileText,
  Heart,
  Languages,
  LayoutDashboard,
  MessageSquare,
  UserCircle,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { switchLocalePath, withLocalePath } from "@/lib/utils/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/app/[locale]/(client)/auth/auth-provider";

import ThemeToggle from "./theme-toggle";

type Role = "ADMIN" | "MANAGER" | "AGENT" | "USER";

const LOCALES = new Set(["en", "vi"]); // thêm locale khác nếu có

export default function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Header");
  const { isAuthed, user, openAuthModal, signOut, isLoadingUser } = useAuth();

  const [showBanner, setShowBanner] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // lấy locale từ url: /en/sale => en
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
  const canManageProperties =
    role === "ADMIN" || role === "MANAGER" || role === "AGENT";
  const canManagePosts =
    role === "ADMIN" || role === "MANAGER" || role === "AGENT";
  const canManageInquiries =
    role === "ADMIN" || role === "MANAGER" || role === "AGENT";
  const canSaved = role === "USER";

  const withLocale = (href: string) => withLocalePath(href, locale);

  // check active theo normalizedPath
  const isActive = (href: string, exact = false) => {
    if (!normalizedPath) return false;
    if (exact) return normalizedPath === href;
    return normalizedPath === href || normalizedPath.startsWith(href + "/");
  };

  // Active rõ ràng hơn: đậm + underline tím
  const navItemClass = (href: string, exact = false) =>
    isActive(href, exact)
      ? "text-zinc-950 dark:text-white font-semibold relative after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-purple-600"
      : "text-zinc-600 hover:text-zinc-950 dark:text-white/70 dark:hover:text-white";

  const pillClass = (href: string) =>
    "h-10 px-3 inline-flex items-center gap-2 rounded-xl border transition " +
    (isActive(href)
      ? "border-purple-600/60 bg-purple-600/10 text-zinc-950 dark:text-white"
      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-[#1a1a1a] dark:bg-white/0 dark:text-white/80 dark:hover:bg-white/5 dark:hover:text-white");

  // Dropdown item styles (fix hover/focus losing text)
  const ddItemClass =
    "cursor-pointer text-zinc-700 focus:text-zinc-950 data-[highlighted]:text-zinc-950 " +
    "focus:bg-zinc-100 data-[highlighted]:bg-zinc-100 active:bg-zinc-200 dark:text-white/90 dark:focus:text-white dark:data-[highlighted]:text-white " +
    "dark:focus:bg-white/10 dark:data-[highlighted]:bg-white/10 dark:active:bg-white/15";
  const ddItemLinkClass = "flex w-full items-center gap-2";

  return (
    <>
      {showBanner && (
        <div className="border-b border-zinc-200 bg-white px-4 py-2.5 sm:px-8 lg:px-14 2xl:px-20 dark:border-[#1a1a1a] dark:bg-[#0f0f0f]">
          <div className="mx-auto flex max-w-[1680px] items-center justify-between text-sm">
            <div className="flex-1" />
            <div className="text-center text-zinc-700 dark:text-white/80">
              {t("banner")}{" "}
              <Link
                href={withLocale("/news")}
                className="ml-1 text-zinc-950 underline hover:no-underline dark:text-white"
              >
                {t("learnMore")}
              </Link>
            </div>
            <div className="flex flex-1 justify-end">
              <button
                type="button"
                className="text-zinc-500 hover:text-zinc-950 dark:text-white/60 dark:hover:text-white"
                onClick={() => setShowBanner(false)}
                aria-label="Close banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-8 lg:px-14 2xl:px-20 dark:border-[#1a1a1a] dark:bg-[#0a0a0a]">
        <div className="mx-auto grid max-w-[1680px] grid-cols-[auto_1fr_auto] items-center gap-6">
          {/* Logo */}
          <Link
            href={withLocale("/")}
            className="flex shrink-0 items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-purple-400">
              <div
                className="h-4 w-4 rounded-full bg-white"
                style={{
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
              />
            </div>
            <span className="text-xl font-bold text-zinc-950 dark:text-white">
              Estatein
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center justify-center gap-10 md:flex lg:gap-12">
            <Link
              href={withLocale("/home")}
              className={`${navItemClass("/home", true)} transition-colors`}
            >
              {t("nav.home")}
            </Link>
            <Link
              href={withLocale("/sale")}
              className={`${navItemClass("/sale")} transition-colors`}
            >
              {t("nav.sale")}
            </Link>
            <Link
              href={withLocale("/rent")}
              className={`${navItemClass("/rent")} transition-colors`}
            >
              {t("nav.rent")}
            </Link>
            <Link
              href={withLocale("/news")}
              className={`${navItemClass("/news")} transition-colors`}
            >
              {t("nav.news")}
            </Link>
            <Link
              href={withLocale("/contacts")}
              className={`${navItemClass("/contacts")} transition-colors`}
            >
              {t("nav.contacts")}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center justify-end gap-2 md:gap-3">
            {/* Saved for USER role only */}
            {canSaved && (
              <div className="mr-2 hidden items-center gap-2 lg:flex">
                <Link
                  href={withLocale("/saved")}
                  className={pillClass("/saved")}
                >
                  <Heart className="h-4 w-4" />
                  {t("menu.saved")}
                </Link>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-[#1a1a1a] dark:bg-[#0f0f0f] dark:text-white/80 dark:hover:bg-white/5 dark:hover:text-white"
                  aria-label="Change language"
                >
                  <Languages className="h-5 w-5" />
                  <span className="ml-2 text-xs font-semibold uppercase">
                    {locale}
                  </span>
                  <ChevronDown className="ml-1 h-3.5 w-3.5 text-zinc-500 dark:text-white/50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 border-zinc-200 bg-white text-zinc-950 dark:border-[#262626] dark:bg-[#141414] dark:text-white"
              >
                {Array.from(LOCALES).map((item) => (
                  <DropdownMenuItem asChild key={item} className={ddItemClass}>
                    <Link
                      href={switchLocalePath(pathname ?? "/", item)}
                      className="flex w-full items-center justify-between"
                      prefetch={false}
                    >
                      <span>{item === "vi" ? "Tiếng Việt" : "English"}</span>
                      <span className="text-xs text-zinc-400 uppercase dark:text-white/45">
                        {item}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            {/* Auth */}
            {!mounted || isLoadingUser ? (
              <div className="h-10 w-[180px] animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-[#1a1a1a] dark:bg-white/5" />
            ) : !isAuthed ? (
              <>
                <Button
                  variant="ghost"
                  className="text-zinc-950 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10"
                  onClick={() => openAuthModal("signin")}
                >
                  {t("auth.signIn")}
                </Button>
                <Button
                  className="bg-purple-600 text-white hover:bg-purple-700"
                  onClick={() => openAuthModal("signup")}
                >
                  {t("auth.signUp")}
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="group flex items-center gap-2 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <span className="hidden md:block">
                      <span className="text-zinc-500 transition-colors group-hover:text-zinc-800 dark:text-white/60 dark:group-hover:text-white/90">
                        {t("auth.greeting")}
                      </span>{" "}
                      <span className="font-medium text-zinc-950 transition-colors group-hover:text-purple-700 dark:text-white dark:group-hover:text-purple-200">
                        {user?.name ?? user?.email}
                      </span>
                    </span>
                    <span className="md:hidden">Menu</span>
                    <ChevronDown className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-zinc-950 dark:text-white/70 dark:group-hover:text-white" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 border-zinc-200 bg-white text-zinc-950 dark:border-[#262626] dark:bg-[#141414] dark:text-white"
                >
                  {/* Admin/Manager Dashboard */}
                  {canDashboard && (
                    <>
                      <DropdownMenuItem asChild className={ddItemClass}>
                        <Link
                          href={withLocale("/admin/pages/dashboard")}
                          className={ddItemLinkClass}
                        >
                          <LayoutDashboard className="h-4 w-4 text-zinc-500 dark:text-white/80" />
                          <span>{t("menu.dashboard")}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-200 dark:bg-[#262626]" />
                    </>
                  )}

                  <DropdownMenuItem asChild className={ddItemClass}>
                    <Link
                      href={withLocale("/account")}
                      className={ddItemLinkClass}
                    >
                      <UserCircle className="h-4 w-4 text-zinc-500 dark:text-white/80" />
                      <span>{t("menu.profile")}</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* Agent/Manager/Admin Management */}
                  {canManageProperties && (
                    <DropdownMenuItem asChild className={ddItemClass}>
                      <Link
                        href={withLocale("/my-properties")}
                        className={ddItemLinkClass}
                      >
                        <Building2 className="h-4 w-4 text-zinc-500 dark:text-white/80" />
                        <span>{t("menu.myProperties")}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {canManagePosts && (
                    <DropdownMenuItem asChild className={ddItemClass}>
                      <Link
                        href={withLocale("/my-posts")}
                        className={ddItemLinkClass}
                      >
                        <FileText className="h-4 w-4 text-zinc-500 dark:text-white/80" />
                        <span>{t("menu.myPosts")}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {canManageInquiries && (
                    <DropdownMenuItem asChild className={ddItemClass}>
                      <Link
                        href={withLocale("/my-inquiries")}
                        className={ddItemLinkClass}
                      >
                        <MessageSquare className="h-4 w-4 text-zinc-500 dark:text-white/80" />
                        <span>{t("menu.myInquiries")}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-zinc-200 dark:bg-[#262626]" />

                  <DropdownMenuItem
                    onClick={signOut}
                    className="cursor-pointer text-red-300 focus:bg-red-500/10 focus:text-red-200 data-[highlighted]:bg-red-500/10 data-[highlighted]:text-red-200"
                  >
                    {t("auth.signOut")}
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
