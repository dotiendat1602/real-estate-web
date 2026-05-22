"use client";

import React, { ReactNode, useEffect, useCallback, useState, useMemo } from "react";
import ContentWrapper from "../ContentWrapper";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Sidebar } from "../layout/SideBar";
import Cookies from "js-cookie";
import { AuthApi } from "@/lib/api/auth";
import { isTokenExpired } from "@/lib/utils/jwt";
import { useTheme } from "next-themes";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const locale = useLocale();
  const { setTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);

  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  const loginPath = useMemo(() => `/${locale}/home`, [locale]);

  useEffect(() => {
    document.body.classList.add("admin-theme-active");
    document.documentElement.classList.remove("dark");
    setTheme("light");

    return () => {
      document.body.classList.remove("admin-theme-active");
    };
  }, [setTheme]);

  useEffect(() => {
    let cancelled = false;

    const ensureAuth = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        const refreshToken = Cookies.get("refresh_token");

        if (!accessToken) {
          router.replace(loginPath);
          return;
        }

        if (!isTokenExpired(accessToken)) {
          if (!cancelled) {
            setAuthed(true);
          }
          return;
        }

        if (refreshToken) {
          try {
            const res = await AuthApi.refreshToken({ refreshToken });
            const newAccessToken = res.accessToken;
            const newRefreshToken = res.refreshToken;

            if (!newAccessToken) {
              router.replace(loginPath);
              return;
            }

            Cookies.set("access_token", newAccessToken, {
              expires: 7,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            });

            if (newRefreshToken) {
              Cookies.set("refresh_token", newRefreshToken, {
                expires: 30,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              });
            }

            if (!cancelled) setAuthed(true);
            return;
          } catch {
            router.replace(loginPath);
            return;
          }
        }

        router.replace(loginPath);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    ensureAuth();
    return () => {
      cancelled = true;
    };
  }, [router, loginPath]);

  if (checking || !authed) {
    return (
      <div className="admin-theme flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  return (
    <div className="admin-theme flex min-h-screen bg-zinc-50 text-zinc-900">
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${collapsed ? "w-16" : "w-64"
          }`}
      >
        <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      </aside>

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"
          }`}
      >
        <main className="min-h-screen bg-zinc-50 p-4">
          <ContentWrapper>{children}</ContentWrapper>
        </main>
      </div>
    </div>
  );
}
