"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

import { withLocalePath } from "@/lib/utils/i18n";
import { Card } from "@/components/ui/card";

const copy = {
  en: {
    title: "Frequently asked questions",
    intro: "Short answers for the flows currently supported by the platform.",
    contact: "Contact us",
    faqs: [
      {
        question: "How do I search for a property?",
        answer:
          "Use the sale or rent page filters for location, price, area, rooms, amenities, and nearby utilities.",
      },
      {
        question: "Can I save favorite listings?",
        answer:
          "Yes. Sign in and use the favorite action on public listing detail pages, then review them from Saved.",
      },
      {
        question: "How do I contact an agent?",
        answer:
          "Open a listing detail page and use the available contact or chat actions, or send a request from the contact page.",
      },
    ],
  },
  vi: {
    title: "Câu hỏi thường gặp",
    intro: "Các câu trả lời ngắn cho những luồng đang được hệ thống hỗ trợ.",
    contact: "Liên hệ",
    faqs: [
      {
        question: "Làm sao để tìm bất động sản?",
        answer:
          "Dùng bộ lọc ở trang bán hoặc thuê theo vị trí, giá, diện tích, số phòng, tiện nghi và tiện ích xung quanh.",
      },
      {
        question: "Tôi có lưu tin yêu thích được không?",
        answer:
          "Có. Đăng nhập rồi dùng thao tác yêu thích ở trang chi tiết tin, sau đó xem lại trong mục Đã lưu.",
      },
      {
        question: "Làm sao để liên hệ môi giới?",
        answer:
          "Mở trang chi tiết tin và dùng các thao tác liên hệ hoặc chat, hoặc gửi yêu cầu từ trang liên hệ.",
      },
    ],
  },
};

export default function FAQ() {
  const locale = useLocale();
  const text = locale === "vi" ? copy.vi : copy.en;

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-start justify-between gap-4">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-zinc-950 dark:text-white">
              {text.title}
            </h2>
            <p className="max-w-2xl text-zinc-600 dark:text-white/60">
              {text.intro}
            </p>
          </div>

          <Link
            href={withLocalePath("/contacts", locale)}
            prefetch={false}
            className="hidden items-center gap-2 rounded-lg border border-zinc-200 px-6 py-3 text-zinc-800 transition-colors hover:bg-zinc-100 md:flex dark:border-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
          >
            {text.contact}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {text.faqs.map((faq) => (
            <Card
              key={faq.question}
              className="space-y-4 border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-[#1a1a1a] dark:bg-[#141414] dark:shadow-none"
            >
              <h3 className="text-xl font-bold text-zinc-950 dark:text-white">
                {faq.question}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-white/60">
                {faq.answer}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
