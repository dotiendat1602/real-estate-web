"use client"

import { ArrowLeft, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ForgotEmailStep({
  email,
  setEmail,
  loading,
  onSubmit,
  onBackLogin,
  onRegister,
}: {
  email: string
  setEmail: (v: string) => void
  loading: boolean
  onSubmit: () => void
  onBackLogin: () => void
  onRegister: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/70 text-sm">
        <MailCheck className="h-4 w-4" />
        <span>Nhập email để nhận OTP</span>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
          placeholder="you@email.com"
        />
      </div>

      <Button disabled={loading} onClick={onSubmit} className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl">
        {loading ? "Đang gửi OTP..." : "Gửi OTP"}
      </Button>

      <div className="flex items-center justify-between text-xs">
        <button type="button" onClick={onBackLogin} className="inline-flex items-center gap-1 text-white/70 hover:text-white underline">
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </button>

        <button type="button" onClick={onRegister} className="text-white/40 hover:text-white underline">
          Tạo tài khoản
        </button>
      </div>
    </div>
  )
}
