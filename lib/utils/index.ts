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
