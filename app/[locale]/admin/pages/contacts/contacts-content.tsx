"use client";

import React from "react";
import { Bell, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactFilters } from "@/components/admin/contacts/contact-filters";
import { ContactTable } from "@/components/admin/contacts/contact-table";
import { useAllContacts } from "@/hooks/contacts/useContacts";
import { GetAllContactsQuery } from "@/types/interfaces/api/contact.interface";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

export default function ContactsPageContent() {
  const [filters, setFilters] = React.useState({
    search: "",
    status: "ALL",
  });

  const [appliedFilters, setAppliedFilters] = React.useState(filters);
  const [pageIndex, setPageIndex] = React.useState(1);
  const pageSize = 10;

  const query: GetAllContactsQuery = {
    pageIndex,
    pageSize,
    search: appliedFilters.search || undefined,
    status: appliedFilters.status !== "ALL" ? appliedFilters.status : undefined,
    sortKey: "createdAt",
    sortOrder: "desc",
  };

  const contactsQuery = useAllContacts(query);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPageIndex(1);
  };

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  const totalItems = contactsQuery.data?.totalItems ?? 0;
  const contacts = contactsQuery.data?.data ?? [];

  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Quản lý liên hệ
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý các yêu cầu liên hệ và hỗ trợ từ khách hàng
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Danh sách liên hệ
              </h2>
              {contactsQuery.isFetching && (
                <span className="text-xs text-gray-400">
                  Đang đồng bộ dữ liệu...
                </span>
              )}
            </div>

            <ContactFilters
              filters={filters}
              onFiltersChange={setFilters}
              onApply={handleApplyFilters}
            />

            <ContactTable
              data={contacts}
              isLoading={contactsQuery.isLoading}
              pagination={{
                pageIndex,
                pageSize,
                total: totalItems,
              }}
              onPaginationChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </ProtectedLayout>
  );
}
