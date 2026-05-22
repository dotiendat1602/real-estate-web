"use client";

import React from "react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContactFilters } from "@/components/admin/contacts/contact-filters";
import { ContactTable } from "@/components/admin/contacts/contact-table";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { useAllContacts } from "@/hooks/contacts/useContacts";
import { GetAllContactsQuery } from "@/types/interfaces/api/contact.interface";

export default function ContactsPageContent() {
  const [filters, setFilters] = React.useState({
    search: "",
    status: "ALL",
  });

  const [appliedFilters, setAppliedFilters] = React.useState(filters);
  const [pageIndex, setPageIndex] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

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

  const totalItems = contactsQuery.data?.totalItems ?? 0;
  const contacts = contactsQuery.data?.data ?? [];
  const handlePaginationChange = (nextPage: number, nextPageSize?: number) => {
    setPageIndex(nextPage);
    if (nextPageSize) setPageSize(nextPageSize);
  };

  return (
    <ProtectedLayout>
      <main className="flex-1 overflow-auto">
        <AdminPageHeader
          title="Quản lý liên hệ"
          description="Quản lý các yêu cầu liên hệ và hỗ trợ từ khách hàng"
        />

        <div className="p-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Danh sách liên hệ</h2>
              {contactsQuery.isFetching && (
                <span className="text-xs text-gray-400">Đang đồng bộ dữ liệu...</span>
              )}
            </div>

            <ContactFilters
              filters={filters}
              onFiltersChange={setFilters}
              onApply={handleApplyFilters}
            />

            <div className="m-4" />

            <ContactTable
              data={contacts}
              isLoading={contactsQuery.isLoading}
              pagination={{
                pageIndex,
                pageSize,
                total: totalItems,
              }}
              onPaginationChange={handlePaginationChange}
            />
          </div>
        </div>
      </main>
    </ProtectedLayout>
  );
}
