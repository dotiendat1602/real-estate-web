"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const labelClass = "text-sm text-zinc-600 dark:text-white/70";
const inputClass =
  "h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-purple-500 dark:border-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-white/90 dark:placeholder:text-white/30";

export default function ForgotOtpStep({
  email,
  otp,
  setOtp,
  loading,
  onVerify,
  onBack,
  onResend,
  resendLeft,
}: {
  email: string;
  otp: string;
  setOtp: (v: string) => void;
  loading: boolean;
  onVerify: () => void;
  onBack: () => void;
  onResend: () => void;
  resendLeft: number;
}) {
  const resendDisabled = loading || resendLeft > 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-white/70">
        Email: <span className="text-zinc-950 dark:text-white/90">{email || "-"}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-white/70">
        <ShieldCheck className="h-4 w-4" />
        <span>Nhập OTP</span>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>OTP</label>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className={inputClass}
          placeholder="VD: 123456"
        />
      </div>

      <Button disabled={loading} onClick={onVerify} className="h-11 w-full rounded-xl bg-purple-600 text-white hover:bg-purple-700">
        {loading ? "Đang xác thực..." : "Xác thực OTP"}
      </Button>

      <div className="flex items-center justify-between text-xs">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-zinc-600 underline hover:text-zinc-950 dark:text-white/70 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Đổi email
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={resendDisabled}
          className={[
            "underline",
            resendDisabled
              ? "cursor-not-allowed text-zinc-400 dark:text-white/30"
              : "text-zinc-600 hover:text-zinc-950 dark:text-white/60 dark:hover:text-white",
          ].join(" ")}
          title={resendLeft > 0 ? `Vui lòng chờ ${resendLeft}s` : "Gửi lại OTP"}
        >
          {resendLeft > 0 ? `Gửi lại sau ${resendLeft}s` : "Gửi lại OTP"}
        </button>
      </div>
    </div>
  );
}
