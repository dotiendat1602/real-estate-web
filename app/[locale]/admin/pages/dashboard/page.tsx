"use client";

import {
  Building2,
  CalendarClock,
  FileCheck2,
  Mail,
  Newspaper,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useLocale } from "next-intl";

import { DashboardHeader } from "@/components/admin/dashboard/header";
import { KPICards, type DashboardKpi } from "@/components/admin/dashboard/kpi-card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { useAllContacts } from "@/hooks/contacts/useContacts";
import { useNewsArticles } from "@/hooks/news/useNewsArticles";
import { useAppointments } from "@/hooks/appointment/useAppointment";
import { usePosts, useReports } from "@/hooks/post/usePost";
import { useProperties } from "@/hooks/property/useProperty";
import { useUsers } from "@/hooks/users/useUser";
import { withLocalePath } from "@/lib/utils/i18n";
import { ContactStatus } from "@/types/interfaces/api/contact.interface";
import { NewsStatus } from "@/types/interfaces/api/news";
import { PostStatus } from "@/types/enums/post";

function totalOf(query: { data?: { totalItems?: number } }) {
  return query.data?.totalItems ?? 0;
}

export default function DashboardPage() {
  const locale = useLocale();

  const pendingPostsQ = usePosts({
    pageIndex: 1,
    pageSize: 1,
    status: PostStatus.PENDING,
    sortKey: "createdAt",
    sortOrder: "desc",
  });
  const reportsQ = useReports({
    pageIndex: 1,
    pageSize: 1,
    sortKey: "createdAt",
    sortOrder: "desc",
  });
  const newContactsQ = useAllContacts({
    pageIndex: 1,
    pageSize: 1,
    status: ContactStatus.NEW,
    sortKey: "createdAt",
    sortOrder: "desc",
  });
  const appointmentsQ = useAppointments({
    pageIndex: 1,
    pageSize: 1,
    sortKey: "createdAt",
    sortOrder: "desc",
  });
  const propertiesQ = useProperties({
    pageIndex: 1,
    pageSize: 1,
  });
  const usersQ = useUsers({
    pageIndex: 1,
    pageSize: 1,
  });
  const publishedNewsQ = useNewsArticles({
    pageIndex: 1,
    pageSize: 1,
    status: NewsStatus.PUBLISHED,
  });

  const kpis: DashboardKpi[] = [
    {
      title: "Bài chờ duyệt",
      value: totalOf(pendingPostsQ),
      description: "Các bài đăng cần quản trị viên kiểm tra trước khi hiển thị công khai.",
      href: withLocalePath("/admin/pages/posts", locale),
      icon: FileCheck2,
      tone: "amber",
      isLoading: pendingPostsQ.isLoading,
    },
    {
      title: "Báo cáo bài đăng",
      value: totalOf(reportsQ),
      description: "Tổng số báo cáo từ người dùng cần được rà soát và xử lý.",
      href: withLocalePath("/admin/pages/posts", locale),
      icon: ShieldAlert,
      tone: "rose",
      isLoading: reportsQ.isLoading,
    },
    {
      title: "Liên hệ mới",
      value: totalOf(newContactsQ),
      description: "Yêu cầu liên hệ ở trạng thái mới, cần phản hồi hoặc phân công xử lý.",
      href: withLocalePath("/admin/pages/contacts", locale),
      icon: Mail,
      tone: "blue",
      isLoading: newContactsQ.isLoading,
    },
    {
      title: "Lịch hẹn",
      value: totalOf(appointmentsQ),
      description: "Tổng lịch hẹn đang được quản lý trong hệ thống.",
      href: withLocalePath("/admin/pages/deposits-appointments", locale),
      icon: CalendarClock,
      tone: "purple",
      isLoading: appointmentsQ.isLoading,
    },
    {
      title: "Bất động sản",
      value: totalOf(propertiesQ),
      description: "Tổng số bất động sản trong kho dữ liệu quản trị.",
      href: withLocalePath("/admin/pages/properties", locale),
      icon: Building2,
      tone: "emerald",
      isLoading: propertiesQ.isLoading,
    },
    {
      title: "Người dùng",
      value: totalOf(usersQ),
      description: "Tổng tài khoản người dùng, agent và nhân sự quản trị.",
      href: withLocalePath("/admin/pages/users", locale),
      icon: Users,
      tone: "slate",
      isLoading: usersQ.isLoading,
    },
    {
      title: "Tin đã xuất bản",
      value: totalOf(publishedNewsQ),
      description: "Số bài viết tin tức đang hiển thị trên trang công khai.",
      href: withLocalePath("/admin/pages/news", locale),
      icon: Newspaper,
      tone: "blue",
      isLoading: publishedNewsQ.isLoading,
    },
  ];

  return (
    <ProtectedLayout>
      <DashboardLayout>
        <div className="flex-1 overflow-auto">
          <DashboardHeader />

          <main className="space-y-8 p-8">
            <KPICards items={kpis} />
          </main>
        </div>
      </DashboardLayout>
    </ProtectedLayout>
  );
}
