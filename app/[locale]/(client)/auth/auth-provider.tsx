"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useLocale } from "next-intl";

import { AuthApi } from "@/lib/api/auth";
import { UsersApi } from "@/lib/api/user";

type User = {
  id?: number;
  email?: string;
  name?: string;
  phone?: string;
  role?: string;
};

type AuthModalMode = "signin" | "signup";

type AuthContextValue = {
  user: User | null;
  role: string | null;
  isAuthed: boolean;
  isLoadingUser: boolean;
  refreshUser: () => Promise<void>;

  authModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;

  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signUp: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: "USER" | "AGENT";
  }) => Promise<void>;

  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function redirectByRole(
  role: string,
  locale: string,
  router: ReturnType<typeof useRouter>
) {
  if (role === "ADMIN" || role === "MANAGER") {
    router.push(`/${locale}/admin/pages/dashboard`);
    router.refresh();
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = useLocale();

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("signin");

  const refreshUser = useCallback(async () => {
    const userInfo = await UsersApi.me();
    const storedRole = Cookies.get("role");

    setRole(storedRole ?? userInfo.role?.name ?? null);
    setUser({
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      phone: userInfo.phone,
      role: userInfo.role?.name,
    });
  }, []);

  /**
   * Fetch user info from API when component mounts
   */
  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        setIsLoadingUser(false);
        return;
      }

      try {
        await refreshUser();
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        // Nếu API fail (token hết hạn, etc.), clear cookies
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("role");
        setUser(null);
        setRole(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserInfo();
  }, [refreshUser]);

  const openAuthModal = (mode: AuthModalMode = "signin") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => setAuthModalOpen(false);

  const signIn = useCallback(
    async (payload: { email: string; password: string }) => {
      const res = await AuthApi.login(payload);

      Cookies.set("access_token", res.accessToken);
      Cookies.set("refresh_token", res.refreshToken);
      Cookies.set("role", res.role);

      // Fetch user info sau khi login
      try {
        await refreshUser();
      } catch (error) {
        // Fallback nếu API fail
        setRole(res.role);
        setUser({ email: payload.email, role: res.role });
      }

      closeAuthModal();
      redirectByRole(res.role, locale, router);
    },
    [locale, refreshUser, router]
  );

  const signUp = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      role: "USER" | "AGENT";
    }) => {
      const res = await AuthApi.register(payload);

      Cookies.set("access_token", res.accessToken);
      Cookies.set("refresh_token", res.refreshToken);
      Cookies.set("role", res.role);

      // Fetch user info sau khi register
      try {
        await refreshUser();
      } catch (error) {
        // Fallback nếu API fail
        setRole(res.role);
        setUser({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          role: res.role,
        });
      }

      closeAuthModal();
      redirectByRole(res.role, locale, router);
    },
    [locale, refreshUser, router]
  );

  const signOut = useCallback(() => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("role");
    setUser(null);
    setRole(null);
    router.push(`/${locale}/home`);
  }, [locale, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      isAuthed: !!Cookies.get("access_token"),
      isLoadingUser,
      refreshUser,

      authModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,

      signIn,
      signUp,
      signOut,
    }),
    [
      user,
      role,
      authModalOpen,
      authModalMode,
      isLoadingUser,
      refreshUser,
      signIn,
      signUp,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
