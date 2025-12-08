"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function ChatIndexPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-gray-500">
      <MessageCircle className="h-12 w-12 text-gray-300" />
      <div>
        <p className="font-medium text-gray-700">
          Chọn một đoạn chat để bắt đầu
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Hãy chọn một cuộc hội thoại từ danh sách bên trái để xem chi tiết
        </p>
      </div>
    </div>
  );
}
