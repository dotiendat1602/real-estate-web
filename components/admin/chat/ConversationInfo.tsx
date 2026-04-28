// components/chat/ConversationInfo.tsx - Update để có scroll riêng
"use client";

import React from "react";
import { ConversationDataListItem } from "@/types/interfaces/api/chat";
import { format } from "date-fns";
import { User, Phone, Mail, Building2, Calendar } from "lucide-react";

interface ConversationInfoProps {
  conversation: ConversationDataListItem | null;
}

export const ConversationInfo: React.FC<ConversationInfoProps> = ({
  conversation,
}) => {
  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-sm text-gray-500">
        <p>
          Chưa có khách hàng nào được chọn. Hãy chọn một đoạn chat để xem thông tin chi
          tiết.
        </p>
      </div>
    );
  }

  const buyer = conversation.buyer;
  const post = conversation.post;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Thông tin khách hàng</h3>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Buyer Info */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600">
                {buyer?.name?.charAt(0) || "B"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {buyer?.name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">{buyer?.email || "—"}</p>
              </div>
            </div>

            <div className="space-y-2">
              {buyer?.phone && (
                <div className="flex items-start gap-2 text-xs">
                  <Phone className="mt-0.5 h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600">{buyer.phone}</span>
                </div>
              )}

              {buyer?.email && (
                <div className="flex items-start gap-2 text-xs">
                  <Mail className="mt-0.5 h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600">{buyer.email}</span>
                </div>
              )}

              {buyer?.createdAt && (
                <div className="flex items-start gap-2 text-xs">
                  <Calendar className="mt-0.5 h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600">
                    Đăng ký: {format(new Date(buyer.createdAt), "dd/MM/yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Post Info */}
          <div>
            <h4 className="mb-2 text-xs font-semibold text-gray-700">
              Bất động sản quan tâm
            </h4>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {post?.postTitle || "—"}
              </p>

              <div className="flex items-center gap-2 text-xs">
                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                  {post?.postType || "—"}
                </span>
              </div>

              {post?.postStatus && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">Trạng thái:</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
                    {post.postStatus}
                  </span>
                </div>
              )}

              {post?.createdAt && (
                <div className="text-xs text-gray-500">
                  Đăng: {format(new Date(post.createdAt), "dd/MM/yyyy")}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Agent Info */}
          {conversation.agent && (
            <div>
              <h4 className="mb-2 text-xs font-semibold text-gray-700">
                Agent phụ trách
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {conversation.agent.name || "—"}
                  </span>
                </div>
                {conversation.agent.email && (
                  <div className="flex items-start gap-2 text-xs">
                    <Mail className="mt-0.5 h-3.5 w-3.5 text-gray-400" />
                    <span className="text-gray-600">{conversation.agent.email}</span>
                  </div>
                )}
                {conversation.agent.phone && (
                  <div className="flex items-start gap-2 text-xs">
                    <Phone className="mt-0.5 h-3.5 w-3.5 text-gray-400" />
                    <span className="text-gray-600">{conversation.agent.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
