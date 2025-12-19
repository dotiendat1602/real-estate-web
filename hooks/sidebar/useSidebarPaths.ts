"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

/**
 * Hook quản lý đường dẫn & logic active cho Sidebar
 */
export function useSidebarPaths(baseSegment = "pages") {
  const pathname = usePathname();
  const locale = useLocale();

  const buildPath = (slug?: string) => {
    if (!slug) return `/${locale}/admin/${baseSegment}`;
    return `/${locale}/admin/${baseSegment}/${slug}`;
  };

  const buildAccountPath = (slug: string) =>
    `/${locale}/admin/pages/account/${slug}`;

  const isActive = (href: string) => {
    if (pathname === href) return true;
    return pathname.startsWith(href + "/");
  };

  return {
    pathname,
    locale,
    buildPath,
    buildAccountPath,
    isActive,
  };
}
