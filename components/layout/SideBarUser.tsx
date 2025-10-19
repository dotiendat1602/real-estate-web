"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserCog, KeyRound, LogOut, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearTokens } from "@/lib/utils/cookies";
import { useSidebarPaths } from "@/hooks/sidebar/useSidebarPaths";
import type { UserInfoResponse } from "@/types/interfaces/api/user";
import { UsersApi } from "@/lib/api/user";

interface SidebarUserProps {
  collapsed: boolean;
}

function getInitials(name?: string | null, email?: string | null) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    const raw = (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
    const result = raw.toUpperCase();
    return result || "U";
  }
  if (email && email[0]) return email[0].toUpperCase();
  return "U";
}

export function SidebarUser({ collapsed }: SidebarUserProps) {
  const router = useRouter();
  const { buildAccountPath, locale } = useSidebarPaths();
  const [user, setUser] = useState<UserInfoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogout = async () => {
    try {
      clearTokens();
    } finally {
      router.push(`/${locale}/auth/login`);
    }
  };

  useEffect(() => {
    let aborted = false;
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const me = await UsersApi.me();
        if (!aborted) setUser(me ?? null);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          handleLogout();
          return;
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
      controller.abort();
    };
  }, []);

  const userName = user?.name || "";
  const userEmail = user?.email || "";
  const initials = useMemo(() => getInitials(userName, userEmail), [userName, userEmail]);

  const UserMenuDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-gray-900 cursor-pointer"
          aria-label="Mở menu người dùng"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={12}
        alignOffset={-40}
        avoidCollisions
        className="w-56 mb-2"
      >
        <DropdownMenuLabel className="text-xs text-gray-500">
          Tài khoản
        </DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(buildAccountPath("profile"))}
        >
          <UserCog className="mr-2 h-4 w-4" />
          <span>Hồ sơ người dùng</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(buildAccountPath("change-password"))}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          <span>Đổi mật khẩu</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="p-3 border-t border-gray-200">
      <div
        className={cn(
          "flex items-center min-w-0",
          collapsed ? "justify-center" : "gap-3"
        )}
      >
        {collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shrink-0 cursor-pointer",
                  loading
                    ? "bg-zinc-300 animate-pulse"
                    : "bg-gradient-to-br from-blue-400 to-purple-500"
                )}
                title="Mở menu người dùng"
              >
                {loading ? "" : initials}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              align="center"
              sideOffset={16}
              avoidCollisions
              className="w-56 mb-2"
            >
              <DropdownMenuLabel className="text-xs text-gray-500">
                Tài khoản
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(buildAccountPath("profile"))}
              >
                <UserCog className="mr-2 h-4 w-4" />
                <span>Hồ sơ người dùng</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(buildAccountPath("change-password"))}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                <span>Đổi mật khẩu</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shrink-0",
                loading
                  ? "bg-zinc-300 animate-pulse"
                  : "bg-gradient-to-br from-blue-400 to-purple-500"
              )}
              title={userName || "User"}
            >
              {loading ? "" : initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {loading ? "Đang tải..." : userName || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {loading ? "..." : userEmail || ""}
              </p>
            </div>
            {UserMenuDropdown}
          </>
        )}
      </div>
    </div>
  );
}
