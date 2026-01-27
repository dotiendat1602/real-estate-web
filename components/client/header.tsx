// components/client/header.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { X, Heart, PlusCircle, LayoutDashboard, Building2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/[locale]/(client)/auth/auth-provider"

type Role = "ADMIN" | "MANAGER" | "AGENT" | "USER"

const LOCALES = new Set(["en", "vi"]) // thêm locale khác nếu có

export default function Header() {
  const pathname = usePathname()
  const { isAuthed, user, openAuthModal, signOut, isLoadingUser } = useAuth()

  const [showBanner, setShowBanner] = useState(true)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // lấy locale từ url: /en/sale => en
  const locale = useMemo(() => {
    const seg = (pathname ?? "").split("/").filter(Boolean)
    const first = seg[0]
    return first && LOCALES.has(first) ? first : null
  }, [pathname])

  // normalize path: /en/sale -> /sale
  const normalizedPath = useMemo(() => {
    if (!pathname) return ""
    const seg = pathname.split("/").filter(Boolean)
    if (seg[0] && LOCALES.has(seg[0])) seg.shift()
    return "/" + seg.join("/")
  }, [pathname])

  const role: Role | undefined = useMemo(() => {
    const r1 = (user as any)?.role as Role | undefined
    if (r1) return r1
    const r2 = (user as any)?.roles?.[0] as Role | undefined
    return r2
  }, [user])

  const canDashboard = role === "ADMIN" || role === "MANAGER"
  const canManageProperties = role === "ADMIN" || role === "MANAGER" || role === "AGENT"
  const canManagePosts = role === "ADMIN" || role === "MANAGER" || role === "AGENT"
  const canSaved = role === "USER"

  const withLocale = (href: string) => (locale ? `/${locale}${href}` : href)

  // check active theo normalizedPath
  const isActive = (href: string, exact = false) => {
    if (!normalizedPath) return false
    if (exact) return normalizedPath === href
    return normalizedPath === href || normalizedPath.startsWith(href + "/")
  }

  // Active rõ ràng hơn: đậm + underline tím
  const navItemClass = (href: string, exact = false) =>
    isActive(href, exact)
      ? "text-white font-semibold relative after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-purple-600"
      : "text-white/70 hover:text-white"

  const pillClass = (href: string) =>
    "h-10 px-3 inline-flex items-center gap-2 rounded-xl border transition " +
    (isActive(href)
      ? "border-purple-600/60 bg-purple-600/10 text-white"
      : "border-[#1a1a1a] bg-white/0 text-white/80 hover:bg-white/5 hover:text-white")

  return (
    <>
      {showBanner && (
        <div className="bg-[#0f0f0f] border-b border-[#1a1a1a] py-2.5 px-4 sm:px-8 lg:px-14 2xl:px-20">
          <div className="max-w-[1680px] mx-auto flex items-center justify-between text-sm">
            <div className="flex-1" />
            <div className="text-white/80 text-center">
              ✨ Discover Your Dream Property with Estatein{" "}
              <Link href={withLocale("/learn-more")} className="text-white underline hover:no-underline ml-1">
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

      {/* bỏ px-4n */}
      <header className="bg-[#0a0a0a] border-b border-[#1a1a1a] py-4 px-4 sm:px-8 lg:px-14 2xl:px-20">
        <div className="max-w-[1680px] mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-6">
          {/* Logo */}
          <Link href={withLocale("/")} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
              <div
                className="w-4 h-4 bg-white rounded-full"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              />
            </div>
            <span className="text-xl font-bold text-white">Estatein</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-10 lg:gap-12">
            <Link href={withLocale("/home")} className={`${navItemClass("/home", true)} transition-colors`}>
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
            <Link href={withLocale("/contacts")} className={`${navItemClass("/contacts")} transition-colors`}>
              Contacts
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 md:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2 mr-2">
              {canSaved && (
                <Link href={withLocale("/saved")} className={pillClass("/saved")}>
                  <Heart className="w-4 h-4" />
                  Saved
                </Link>
              )}

              {canManageProperties && (
                <Link href={withLocale("/my-properties")} className={pillClass("/my-properties")}>
                  <Building2 className="w-4 h-4" />
                  My Properties
                </Link>
              )}

              {canManagePosts && (
                <Link href={withLocale("/my-posts")} className={pillClass("/my-posts")}>
                  <FileText className="w-4 h-4" />
                  My Posts
                </Link>
              )}

              {canDashboard && (
                <Link href={withLocale("/admin/pages/dashboard")} className={pillClass("/dashboard")}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
            </div>

            {/* Auth */}
            {!mounted || isLoadingUser ? (
              <div className="h-10 w-[180px] rounded-xl bg-white/5 border border-[#1a1a1a] animate-pulse" />
            ) : !isAuthed ? (
              <>
                <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => openAuthModal("signin")}>
                  Sign In
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => openAuthModal("signup")}>
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <div className="hidden md:block text-sm text-white/60">
                  Xin chào, <span className="text-white/85 font-medium">{user?.name ?? user?.email}</span>
                </div>
                <Button variant="ghost" className="text-white hover:bg-white/10" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
