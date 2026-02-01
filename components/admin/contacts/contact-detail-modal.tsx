"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useContactDetail, useUpdateContactStatus } from "@/hooks/contacts/useContacts";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";
import { ToastContainer, useToast } from "@/components/ui/toast";

interface ContactDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: number;
}

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

function formatDate(d?: string | Date | null) {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "-";
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dt);
}

export function ContactDetailModal({ open, onOpenChange, contactId }: ContactDetailModalProps) {
  const toast = useToast();
  const { data: contact, isLoading } = useContactDetail(contactId, { enabled: open });
  const [status, setStatus] = useState<string>("");

  const updateMutation = useUpdateContactStatus();

  useEffect(() => {
    if (!open) {
      setStatus("");
      return;
    }
    if (contact) setStatus(contact.status);
  }, [open, contact]);

  const handleUpdateStatus = async () => {
    if (!contact) return;
    if (!status) {
      toast.warning("Missing status", "Please select a status.");
      return;
    }
    if (status === contact.status) return;

    try {
      await updateMutation.mutateAsync({
        contactId: contact.id,
        data: { status },
      });

      toast.success("Success", "Contact status updated successfully");
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast.error("Error", error?.response?.data?.message || "Failed to update contact status");
    }
  };

  return (
    <>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Contact Details</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-8 w-full bg-gray-100" />
              <Skeleton className="h-20 w-full bg-gray-100" />
              <Skeleton className="h-20 w-full bg-gray-100" />
            </div>
          ) : contact ? (
            <div className="space-y-6 py-4">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-purple-700">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-gray-600 text-sm">Name:</span>
                    <span className="text-gray-900 font-medium text-right flex-1 ml-4">
                      {contact.name}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-600 text-sm">Email:</span>
                    <span className="text-gray-900 text-right flex-1 ml-4">
                      {contact.email}
                    </span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-start justify-between">
                      <span className="text-gray-600 text-sm">Phone:</span>
                      <span className="text-gray-900 text-right flex-1 ml-4">
                        {contact.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Topic & Subject */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-purple-700">
                  Topic & Subject
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-gray-600 text-sm">Topic:</span>
                    <span className="text-gray-900 text-right flex-1 ml-4">
                      {contact.topic}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-600 text-sm">Subject:</span>
                    <span className="text-gray-900 text-right flex-1 ml-4">
                      {contact.subject}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-purple-700">Message</h3>
                <p className="text-gray-800 whitespace-pre-wrap">{contact.message}</p>
              </div>

              {/* Status Update */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-purple-700">
                  Status Management
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700">
                      Current Status
                    </Label>

                    <NativeSelect
                      value={status}
                      onChange={(v) => setStatus(v)}
                      className="w-full"
                      selectClassName="bg-white border-gray-300 text-gray-900 h-10"
                      id="status"
                      aria-label="Status"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </NativeSelect>
                  </div>

                  {status && status !== contact.status ? (
                    <Button
                      onClick={handleUpdateStatus}
                      disabled={updateMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                    >
                      {updateMutation.isPending ? "Updating..." : "Update Status"}
                    </Button>
                  ) : null}
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 text-sm">Created:</span>
                    <div className="text-gray-900 mt-1">{formatDate(contact.createdAt)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Last Updated:</span>
                    <div className="text-gray-900 mt-1">{formatDate(contact.updatedAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-600">
              Failed to load contact details
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
