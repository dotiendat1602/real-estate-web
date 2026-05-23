"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { ContactListItem } from "@/types/interfaces/api/contact.interface";
import { ContactDetailModal } from "./contact-detail-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteContact } from "@/hooks/contacts/useContacts";
import { ToastContainer, useToast } from "@/components/ui/toast";
import Pagination from "@/components/ui/pagination";

interface ContactTableProps {
  data: ContactListItem[];
  isLoading: boolean;
  pagination: { pageIndex: number; pageSize: number; total: number };
  onPaginationChange: (page: number, pageSize?: number) => void;
}

function formatDate(d?: string | Date | null) {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "-";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const HH = String(dt.getHours()).padStart(2, "0");
  const MM = String(dt.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${HH}:${MM}`;
}

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

function statusPillClass(status: string) {
  switch (status) {
    case "NEW":
      return "bg-blue-50 border-blue-200 text-blue-700";
    case "IN_PROGRESS":
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    case "RESOLVED":
      return "bg-green-50 border-green-200 text-green-700";
    case "CLOSED":
      return "bg-gray-50 border-gray-200 text-gray-700";
    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
}

export function ContactTable({ data, isLoading, pagination, onPaginationChange }: ContactTableProps) {
  const toast = useToast();

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactListItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);

  const deleteMutation = useDeleteContact();

  const handleViewDetail = (contact: ContactListItem) => {
    setSelectedContact(contact);
    setDetailModalOpen(true);
  };

  const handleDeleteClick = (contactId: number) => {
    setContactToDelete(contactId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      await deleteMutation.mutateAsync({ contactId: contactToDelete });
      toast.success("Success", "Contact deleted successfully");
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    } catch (error: any) {
      console.error("Failed to delete contact:", error);
      toast.error("Error", error?.response?.data?.message || "Failed to delete contact");
    }
  };

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center py-12">
          <p className="text-gray-700 text-lg">No contacts found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast UI (custom) */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3.5 px-5 text-sm font-semibold text-gray-900">Name</th>
                <th className="text-left py-3.5 px-5 text-sm font-semibold text-gray-900">
                  Contact Info
                </th>
                <th className="text-left py-3.5 px-5 text-sm font-semibold text-gray-900">Topic</th>
                <th className="text-left py-3.5 px-5 text-sm font-semibold text-gray-900">
                  Subject
                </th>
                <th className="text-left py-3.5 px-5 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left py-3.5 px-5 text-sm font-semibold text-gray-900">
                  Created At
                </th>
                <th className="text-right py-3.5 px-5 text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition"
                >
                  <td className="py-3.5 px-5">
                    <div className="text-gray-900 font-medium">{contact.name}</div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="text-sm">
                      <div className="text-gray-900">{contact.email}</div>
                      {contact.phone && <div className="text-gray-500">{contact.phone}</div>}
                    </div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="text-gray-700 text-sm">{contact.topic}</div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="max-w-[220px] text-gray-700 text-sm truncate">
                      {contact.subject}
                    </div>
                  </td>

                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusPillClass(
                        contact.status
                      )}`}
                    >
                      {STATUS_LABELS[contact.status] || contact.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-5 text-sm text-gray-500">
                    {formatDate(contact.createdAt)}
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(contact)}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(contact.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4">
          <Pagination
            currentPage={pagination.pageIndex}
            totalPages={totalPages}
            totalItems={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={(page) => onPaginationChange(page)}
            onPageSizeChange={(pageSize) => onPaginationChange(1, pageSize)}
            itemLabel="liên hệ"
          />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <ContactDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          contactId={selectedContact.id}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-gray-200 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the contact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
