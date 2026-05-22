"use client";

import Link from "next/link";
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  LayoutDashboard,
  Mail,
  Map,
  MessagesSquare,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebarPaths } from "@/hooks/sidebar/useSidebarPaths";
import { SidebarUser } from "./SideBarUser";

type MenuItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  slug?: string;
};

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Bảng điều khiển", slug: "dashboard" },
  { icon: MessagesSquare, label: "Quản lý chat", slug: "chat" },
  { icon: Mail, label: "Liên hệ", slug: "contacts" },
  { icon: Map, label: "Quản lý tin tức", slug: "news" },
  { icon: Building2, label: "Bất động sản", slug: "properties" },
  { icon: FileCheck, label: "Duyệt bài", slug: "posts" },
  { icon: Calendar, label: "Lịch hẹn", slug: "deposits-appointments" },
  { icon: Users, label: "Người dùng và phân quyền", slug: "users" },
];

export function Sidebar({
  collapsed = false,
  toggleCollapsed,
  baseSegment = "pages",
}: {
  collapsed?: boolean;
  toggleCollapsed?: () => void;
  baseSegment?: string;
}) {
  const { buildPath, isActive } = useSidebarPaths(baseSegment);

  return (
    <aside
      className={cn(
        "sticky top-0 h-svh md:h-screen",
        "bg-[#F5F5F5] border-r border-gray-200 flex flex-col transition-[width] duration-200 ease-in-out",
        "overflow-y-auto overflow-x-hidden",
        "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "relative border-b border-gray-200",
          collapsed ? "px-2 py-3 pr-9" : "p-3",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 items-center",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <span className="truncate font-semibold text-gray-900">
                Estatein
              </span>
            )}
          </div>

          {!collapsed && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 cursor-pointer text-gray-600 hover:text-gray-900"
              onClick={toggleCollapsed}
              aria-label="Thu gọn sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {collapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={toggleCollapsed}
            aria-label="Mở rộng sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const href = buildPath(item.slug);
            const active = isActive(href);

            return (
              <li key={href} className="min-w-0">
                <Link
                  href={href}
                  className={cn(
                    "flex w-full min-w-0 cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm transition-colors",
                    collapsed ? "justify-center" : "gap-3",
                    active
                      ? "bg-white font-medium text-gray-900 shadow-sm"
                      : "text-gray-600 hover:bg-gray-200/50",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <SidebarUser collapsed={collapsed} />
    </aside>
  );
}
