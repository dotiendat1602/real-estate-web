"use client"

import { ArrowLeft, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ForgotResetStep({
  newPassword,
  confirmPassword,
  setNewPassword,
  setConfirmPassword,
  loading,
  onSubmit,
  onBackOtp,
  onBackLogin,
}: {
  newPassword: string
  confirmPassword: string
  setNewPassword: (v: string) => void
  setConfirmPassword: (v: string) => void
  loading: boolean
  onSubmit: () => void
  onBackOtp: () => void
  onBackLogin: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/70 text-sm">
        <KeyRound className="h-4 w-4" />
        <span>Đặt lại mật khẩu</span>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">Mật khẩu mới</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
          placeholder="••••••••"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">Xác nhận mật khẩu</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
          placeholder="••••••••"
        />
      </div>

      <Button disabled={loading} onClick={onSubmit} className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl">
        {loading ? "Đang cập nhật..." : "Xác nhận đổi mật khẩu"}
      </Button>

      <div className="flex items-center justify-between text-xs">
        <button type="button" onClick={onBackOtp} className="inline-flex items-center gap-1 text-white/70 hover:text-white underline">
          <ArrowLeft className="h-4 w-4" />
          Quay lại OTP
        </button>

        <button type="button" onClick={onBackLogin} className="text-white/40 hover:text-white underline">
          Về đăng nhập
        </button>
      </div>
    </div>
  )
}
