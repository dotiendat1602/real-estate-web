"use client"

import { X } from "lucide-react"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AuthModalHeader({
  title,
  desc,
  onClose,
}: {
  title: string
  desc: string
  onClose: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#1a1a1a] px-6 py-4">
      <DialogHeader className="space-y-1">
        <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
        <div className="text-xs text-white/50">{desc}</div>
      </DialogHeader>

      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-2 text-white/60 hover:text-white hover:bg-white/5"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}
