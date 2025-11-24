"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  DepositDataListItem,
  DepositListQuery,
} from "@/types/interfaces/api/deposit";
import { useDeposits } from "@/hooks/deposit/useDeposit";
import { useState } from "react";
import { PencilLine } from "lucide-react";
import { UpdateDepositModal } from "./update-deposit-modal";

interface DepositTableProps {
  query: DepositListQuery;
  onChangeQuery: (partial: Partial<DepositListQuery>) => void;
}

export function DepositTable({ query, onChangeQuery }: DepositTableProps) {
  const { data, isLoading, isError } = useDeposits(query);
  const [editingId, setEditingId] = useState<number>(0);

  const deposits: DepositDataListItem[] = data?.data ?? [];

  const pageIndex = data?.pageIndex ?? query.pageIndex ?? 1;
  const totalPage = data?.totalPages ?? 1;

  const handleOpenEdit = (id: number) => {
    setEditingId(id);
  };

  const handleSort = (key: string) => {
    const currentKey = query.sortKey;
    const currentOrder = query.sortOrder;

    let nextOrder: "asc" | "desc" = "asc";
    if (currentKey === key) {
      nextOrder = currentOrder === "asc" ? "desc" : "asc";
    }

    onChangeQuery({
      sortKey: key,
      sortOrder: nextOrder,
      pageIndex: 1,
    });
  };

  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPage) return;
    onChangeQuery({ pageIndex: page });
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 text-center text-sm text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        Có lỗi khi tải danh sách đặt cọc. Vui lòng thử lại.
      </p>
    );
  }

  if (!deposits.length) {
    return (
      <p className="text-sm text-gray-500">
        Chưa có giao dịch đặt cọc nào.
      </p>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              Ngày tạo
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
              Tên bất động sản
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
              Người mua
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
              Người bán
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer"
              onClick={() => handleSort("amount")}
            >
              Số tiền cọc
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Trạng thái
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
              Mã giao dịch
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
              Hết hạn đặt cọc
            </th>
            <th className="px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {deposits.map((deposit) => (
            <tr key={deposit.deposit_id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm text-gray-600">
                {deposit.createdAt
                  ? new Date(deposit.createdAt).toLocaleString("vi-VN")
                  : "-"}
              </td>
              <td className="px-4 py-4">
                <div>
                  <div className="font-medium text-gray-900">
                    {deposit.post?.property?.title ?? "-"}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>
                  <div className="text-sm text-gray-900">
                    {deposit.buyer?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {deposit.buyer?.phone}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>
                  <div className="text-sm text-gray-900">
                    {deposit.seller?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {deposit.seller?.phone}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm font-medium text-blue-600">
                  {deposit.amount.toLocaleString("vi-VN")} VND
                </span>
              </td>
              <td className="px-4 py-4">
                <Badge
                  variant="outline"
                  className={
                    deposit.status === "CONFIRMED"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : deposit.status === "REFUNDED"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : deposit.status === "CANCELLED"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : ""
                  }
                >
                  {deposit.status}
                </Badge>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-gray-600">
                  {deposit.transactionRef || "-"}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="text-sm text-gray-600">
                  {deposit.holdExpiresAt
                    ? new Date(deposit.holdExpiresAt).toLocaleDateString(
                      "vi-VN",
                    )
                    : "-"}
                </span>
              </td>
              <td className="px-4 py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleOpenEdit(deposit.deposit_id)}
                >
                  <PencilLine className="h-4 w-4 text-gray-400" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UpdateDepositModal
        depositId={editingId}
        open={!!editingId}
        onOpenChange={(open) => {
          // khi modal tự close (ESC, click overlay, nút close) → clear id
          if (!open) {
            setEditingId(0);
          }
        }}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 text-sm text-gray-600">
        <span>
          Trang {pageIndex} / {totalPage}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pageIndex <= 1}
            onClick={() => handleChangePage(pageIndex - 1)}
          >
            Trang trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pageIndex >= totalPage}
            onClick={() => handleChangePage(pageIndex + 1)}
          >
            Trang sau
          </Button>
        </div>
      </div>
    </div>
  );
}
