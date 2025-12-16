"use client"

import React, { createContext, useContext, useMemo, useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { AuthApi } from "@/lib/api/auth" // chỉnh path đúng
import { useLocale } from "next-intl"

type User = {
  email?: string
  name?: string
  role?: string
}

type AuthModalMode = "signin" | "signup"

type AuthContextValue = {
  user: User | null
  role: string | null
  isAuthed: boolean

  authModalOpen: boolean
  authModalMode: AuthModalMode
  openAuthModal: (mode?: AuthModalMode) => void
  closeAuthModal: () => void

  signIn: (payload: { email: string; password: string }) => Promise<void>
  signUp: (payload: {
    name: string
    email: string
    password: string
    role: "USER" | "AGENT"
  }) => Promise<void>

  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function redirectByRole(role: string, locale: string, router: ReturnType<typeof useRouter>) {
  if (role === "ADMIN" || role === "MANAGER") {
    router.replace(`/${locale}/admin/pages/dashboard`)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const locale = useLocale()

  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)

  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("signin")

  /**
   * Detect logged-in state from cookies
   */
  useEffect(() => {
    const accessToken = Cookies.get("access_token")
    const storedRole = Cookies.get("role")
    if (accessToken) {
      setRole(storedRole ?? null)
      setUser({ role: storedRole ?? undefined })
    }
  }, [])

  const openAuthModal = (mode: AuthModalMode = "signin") => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }
  const closeAuthModal = () => setAuthModalOpen(false)

  const signIn = async (payload: { email: string; password: string }) => {
    const res = await AuthApi.login(payload)

    Cookies.set("access_token", res.accessToken)
    Cookies.set("refresh_token", res.refreshToken)
    Cookies.set("role", res.role)

    setRole(res.role)
    setUser({ email: payload.email, role: res.role })

    closeAuthModal()
    redirectByRole(res.role, locale, router)
  }

  const signUp = async (payload: {
    name: string
    email: string
    password: string
    role: "USER" | "AGENT"
  }) => {
    const res = await AuthApi.register(payload)

    Cookies.set("access_token", res.accessToken)
    Cookies.set("refresh_token", res.refreshToken)
    Cookies.set("role", res.role)

    setRole(res.role)
    setUser({ name: payload.name, email: payload.email, role: res.role })

    closeAuthModal()
    redirectByRole(res.role, locale, router)
  }

  const signOut = () => {
    Cookies.remove("access_token")
    Cookies.remove("refresh_token")
    Cookies.remove("role")
    setUser(null)
    setRole(null)
    window.location.href = `/${locale}/home`
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      isAuthed: !!Cookies.get("access_token"),

      authModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,

      signIn,
      signUp,
      signOut,
    }),
    [user, role, authModalOpen, authModalMode],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
