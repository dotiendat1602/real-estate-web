"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  MapPin,
  Building2,
  FileCheck,
  Calendar,
  Users,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Bảng điều khiển", active: true },
  { icon: MapPin, label: "Danh mục và vùng địa lý", active: false },
  { icon: Building2, label: "Bất động sản", active: false },
  { icon: FileCheck, label: "Duyệt bài", active: false },
  { icon: Calendar, label: "Đặt cọc và lịch hẹn", active: false },
  { icon: Users, label: "Người dùng và phân quyền", active: false },
];

type SidebarProps = {
  collapsed?: boolean;
  toggleCollapsed?: () => void;
};

export function Sidebar({ collapsed = false, toggleCollapsed }: SidebarProps) {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <aside
      className={cn(
        // chiều cao full + dính đầu trang
        "sticky top-0 h-svh md:h-screen",
        // layout
        "bg-[#F5F5F5] border-r border-gray-200 flex flex-col transition-[width] duration-200 ease-in-out",
        // NGĂN cuộn ngang khi thu gọn
        "overflow-y-auto overflow-x-hidden",
        // safe-area (tuỳ chọn)
        "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
        // width theo trạng thái
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo + Toggle */}
      <div
        className={cn(
          "border-b border-gray-200 relative",       // để toggle absolute nằm trong
          collapsed ? "px-2 py-3 pr-9" : "p-3"       // ✅ chừa chỗ phải khi collapsed
        )}
      >
        <div
          className={cn(
            "flex items-center min-w-0",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {/* Logo + tên */}
          <div className={cn("flex items-center gap-3 min-w-0")}>
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-gray-900 truncate">Real Estate</span>
            )}
          </div>

          {/* Nút toggle khi EXPANDED: đặt bên phải bằng flex, không absolute */}
          {!collapsed && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-600 hover:text-gray-900 shrink-0"
              onClick={toggleCollapsed}
              aria-label="Thu gọn sidebar"
              title="Thu gọn"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Nút toggle khi COLLAPSED: absolute bên phải, không chồng logo nhờ pr-9 */}
        {collapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-600 hover:text-gray-900"
            onClick={toggleCollapsed}
            aria-label="Mở rộng sidebar"
            title="Mở rộng"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>


      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = activeItem === index;

            return (
              <li key={index} className="min-w-0">
                <button
                  onClick={() => setActiveItem(index)}
                  className={cn(
                    "w-full flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors min-w-0",
                    collapsed ? "justify-center" : "gap-3",
                    active
                      ? "bg-white text-gray-900 font-medium shadow-sm"
                      : "text-gray-600 hover:bg-gray-200/50"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-gray-200">
        <div className={cn("flex items-center min-w-0", collapsed ? "justify-center" : "gap-3")}>
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium shrink-0"
            title={collapsed ? "Michael Robinson" : undefined}
          >
            MR
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Michael Robinson</p>
                <p className="text-xs text-gray-500 truncate">michael.robinson@gmail.com</p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
