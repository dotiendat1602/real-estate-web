"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/[locale]/(client)/auth/auth-provider"

export default function Header() {
  const { isAuthed, user, openAuthModal, signOut } = useAuth()

  const [showBanner, setShowBanner] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {showBanner && (
        <div className="bg-[#0f0f0f] border-b border-[#1a1a1a] py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
            <div className="flex-1" />
            <div className="text-white/80 text-center">
              ✨ Discover Your Dream Property with Estatein{" "}
              <a href="#" className="text-white underline hover:no-underline ml-1">
                Learn More
              </a>
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

      <header className="bg-[#0a0a0a] border-b border-[#1a1a1a] py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
              <div
                className="w-4 h-4 bg-white rounded-full"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              />
            </div>
            <span className="text-xl font-bold text-white">Estatein</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white font-medium hover:text-purple-400 transition-colors">
              Home
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Rent Property
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Sale Property
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              News
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Contacts
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {!mounted ? (
              // ✅ SSR + first client render luôn giống nhau → hết hydration mismatch
              <div className="h-10 w-[180px] rounded-xl bg-white/5 border border-[#1a1a1a]" />
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
