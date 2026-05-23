"use client";

import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const labelClass = "text-sm text-zinc-600 dark:text-white/70";
const inputClass =
  "h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-purple-500 dark:border-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-white/90 dark:placeholder:text-white/30";

export default function ForgotEmailStep({
  email,
  setEmail,
  loading,
  onSubmit,
  onBackLogin,
  onRegister,
}: {
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  onSubmit: () => void;
  onBackLogin: () => void;
  onRegister: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-white/70">
        <MailCheck className="h-4 w-4" />
        <span>Nhập email để nhận OTP</span>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="you@email.com"
        />
      </div>

      <Button disabled={loading} onClick={onSubmit} className="h-11 w-full rounded-xl bg-purple-600 text-white hover:bg-purple-700">
        {loading ? "Đang gửi OTP..." : "Gửi OTP"}
      </Button>

      <div className="flex items-center justify-between text-xs">
        <button type="button" onClick={onBackLogin} className="inline-flex items-center gap-1 text-zinc-600 underline hover:text-zinc-950 dark:text-white/70 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </button>

        <button type="button" onClick={onRegister} className="text-zinc-500 underline hover:text-zinc-950 dark:text-white/40 dark:hover:text-white">
          Tạo tài khoản
        </button>
      </div>
    </div>
  );
}
