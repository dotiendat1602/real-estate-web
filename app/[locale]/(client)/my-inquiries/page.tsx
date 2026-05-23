"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { MyInquiriesFilters, InquiryFilters } from "@/components/client/my-inquiries/my-inquiries-filters";
import { MyInquiriesTable } from "@/components/client/my-inquiries/my-inquiries-table";
import { useAllLeads } from "@/hooks/inquiry/useInquiry";
import { GetAllLeadsQuery, LeadStatus } from "@/types/interfaces/api/inquiry.interface";

export default function MyInquiriesPage() {
  const [filters, setFilters] = React.useState<InquiryFilters>({
    search: "",
    status: "ALL",
  });

  const [appliedFilters, setAppliedFilters] = React.useState<InquiryFilters>(filters);
  const [pageIndex, setPageIndex] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const query: GetAllLeadsQuery = {
    pageIndex,
    pageSize,
    search: appliedFilters.search || undefined,
    status: appliedFilters.status !== "ALL" ? (appliedFilters.status as LeadStatus) : undefined,
    sortKey: "createdAt",
    sortOrder: "desc",
  };

  const leadsQuery = useAllLeads(query);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPageIndex(1); // Reset to first page
  };

  const handlePageChange = (newPage: number, nextPageSize?: number) => {
    setPageIndex(newPage);
    if (nextPageSize) setPageSize(nextPageSize);
  };

  const totalItems = leadsQuery.data?.totalItems ?? 0;
  const leads = leadsQuery.data?.data ?? [];

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10 space-y-6">
        {/* Header */}
        <section className="bg-[#141414] border border-[#262626] rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600/10 border border-purple-600/25 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                My Inquiries
              </h1>
              <p className="text-white/60 mt-2">
                Manage and respond to property inquiries from potential customers
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <MyInquiriesFilters
          filters={filters}
          onFiltersChange={setFilters}
          onApply={handleApplyFilters}
        />

        {/* Table */}
        <MyInquiriesTable
          data={leads}
          isLoading={leadsQuery.isLoading}
          pagination={{
            pageIndex,
            pageSize,
            total: totalItems,
          }}
          onPaginationChange={handlePageChange}
        />
      </div>
    </div>
  );
}
