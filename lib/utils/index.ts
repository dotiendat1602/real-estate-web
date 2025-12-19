import { PERMISSION_NAME_MAP, ROLE_NAME_MAP } from "@/types/enums/common";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleFromEnum(value?: string | null) {
  if (!value) return "";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatRoleName(rawName?: string | null) {
  if (!rawName) return "";
  return ROLE_NAME_MAP[rawName] ?? toTitleFromEnum(rawName);
}

export function formatPermissionName(rawName?: string | null) {
  if (!rawName) return "";
  return PERMISSION_NAME_MAP[rawName] ?? toTitleFromEnum(rawName);
}

export function softUpdateConversationsCache(
  queryClient: any,
  conversationId: number,
  newMessage: { id: any; content: any; createdAt: any; senderId: any }
) {
  const msg = {
    id: newMessage.id,
    content: typeof newMessage.content === "string" ? newMessage.content : String(newMessage.content ?? ""),
    createdAt: newMessage.createdAt ?? new Date().toISOString(),
    senderId: newMessage.senderId,
  };

  queryClient.setQueriesData({ queryKey: ["conversations"] }, (old: any) => {
    if (!old) return old;

    const list: any[] | undefined =
      Array.isArray(old.data) ? old.data :
        Array.isArray(old?.data?.data) ? old.data.data :
          Array.isArray(old.items) ? old.items :
            undefined;

    if (!list) return old;

    const idx = list.findIndex((c) => c.id === conversationId);
    if (idx === -1) return old;

    const conv = list[idx];

    const updatedConv = {
      ...conv,

      // ✅ các field sort / hiển thị thời gian
      updatedAt: msg.createdAt,
      lastMessageAt: msg.createdAt,

      // ✅ các field preview phổ biến (tuỳ API mà FE dùng cái nào)
      messages: [msg],         // nhiều UI dùng messages[0]
      lastMessage: msg,        // nhiều API trả lastMessage
      latestMessage: msg,      // nhiều chỗ đặt tên latestMessage
    };

    const next = [updatedConv, ...list.slice(0, idx), ...list.slice(idx + 1)];

    if (Array.isArray(old.data)) return { ...old, data: next };
    if (Array.isArray(old?.data?.data)) return { ...old, data: { ...old.data, data: next } };
    if (Array.isArray(old.items)) return { ...old, items: next };

    return old;
  });
}

