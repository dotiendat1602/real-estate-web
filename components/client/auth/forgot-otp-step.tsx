"use client"

import { ArrowLeft, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  email: string
  otp: string
  setOtp: (v: string) => void
  loading: boolean
  onVerify: () => void
  onBack: () => void
  onResend: () => void
  resendLeft: number
}) {
  const resendDisabled = loading || resendLeft > 0

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-sm text-white/70">
        Email: <span className="text-white/90">{email || "—"}</span>
      </div>

      <div className="flex items-center gap-2 text-white/70 text-sm">
        <ShieldCheck className="h-4 w-4" />
        <span>Nhập OTP</span>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">OTP</label>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
          placeholder="VD: 123456"
        />
      </div>

      <Button disabled={loading} onClick={onVerify} className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl">
        {loading ? "Đang xác thực..." : "Xác thực OTP"}
      </Button>

      <div className="flex items-center justify-between text-xs">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-white/70 hover:text-white underline">
          <ArrowLeft className="h-4 w-4" />
          Đổi email
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={resendDisabled}
          className={[
            "underline",
            resendDisabled ? "text-white/30 cursor-not-allowed" : "text-white/60 hover:text-white",
          ].join(" ")}
          title={resendLeft > 0 ? `Vui lòng chờ ${resendLeft}s` : "Gửi lại OTP"}
        >
          {resendLeft > 0 ? `Gửi lại sau ${resendLeft}s` : "Gửi lại OTP"}
        </button>
      </div>
    </div>
  )
}
