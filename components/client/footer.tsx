"use client";

import Link from "next/link";
import { Building2, Mail } from "lucide-react";
import { useLocale } from "next-intl";

import { withLocalePath } from "@/lib/utils/i18n";

const copy = {
  en: {
    intro:
      "Browse approved sale and rental listings, review property details, and contact the team when you need support.",
    browse: "Browse",
    account: "Account",
    support: "Support",
    sale: "Sale properties",
    rent: "Rental properties",
    news: "News",
    saved: "Saved listings",
    myProperties: "My properties",
    contacts: "Contact",
    rights: "All rights reserved.",
  },
  vi: {
    intro:
      "Xem tin bán và cho thuê đã duyệt, kiểm tra chi tiết bất động sản và liên hệ đội ngũ hỗ trợ khi cần.",
    browse: "Khám phá",
    account: "Tài khoản",
    support: "Hỗ trợ",
    sale: "Bất động sản bán",
    rent: "Bất động sản thuê",
    news: "Tin tức",
    saved: "Tin đã lưu",
    myProperties: "Bất động sản của tôi",
    contacts: "Liên hệ",
    rights: "Đã đăng ký bản quyền.",
  },
};

export default function Footer() {
  const locale = useLocale();
  const text = locale === "vi" ? copy.vi : copy.en;
  const year = new Date().getFullYear();

  const columns = [
    {
      title: text.browse,
      links: [
        { label: text.sale, href: "/sale" },
        { label: text.rent, href: "/rent" },
        { label: text.news, href: "/news" },
      ],
    },
    {
      title: text.account,
      links: [
        { label: text.saved, href: "/saved" },
        { label: text.myProperties, href: "/my-properties" },
      ],
    },
    {
      title: text.support,
      links: [{ label: text.contacts, href: "/contacts" }],
    },
  ];

  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-16 dark:border-[#1a1a1a] dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <Link
              href={withLocalePath("/home", locale)}
              prefetch={false}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-purple-400">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-zinc-950 dark:text-white">
                Estatein
              </span>
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-zinc-600 dark:text-white/60">
              {text.intro}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={withLocalePath("/contacts", locale)}
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 hover:bg-zinc-100 dark:border-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
              >
                <Mail className="h-4 w-4" />
                {text.contacts}
              </Link>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h4 className="font-bold text-zinc-950 dark:text-white">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={withLocalePath(link.href, locale)}
                      prefetch={false}
                      className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-white/60 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 md:flex-row dark:border-[#1a1a1a]">
          <div className="text-sm text-zinc-500 dark:text-white/60">
            © {year} Estatein. {text.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}
