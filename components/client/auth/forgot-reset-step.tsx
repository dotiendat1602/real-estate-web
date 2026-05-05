"use client";

import { ArrowLeft, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";

import PasswordField from "./password-field";

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
  newPassword: string;
  confirmPassword: string;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  loading: boolean;
  onSubmit: () => void;
  onBackOtp: () => void;
  onBackLogin: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-white/70">
        <KeyRound className="h-4 w-4" />
        <span>Đặt lại mật khẩu</span>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">Mật khẩu mới</label>
        <PasswordField
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">Xác nhận mật khẩu</label>
        <PasswordField
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />
      </div>

      <Button
        disabled={loading}
        onClick={onSubmit}
        className="h-11 w-full rounded-xl bg-purple-600 text-white hover:bg-purple-700"
      >
        {loading ? "Đang cập nhật..." : "Xác nhận đổi mật khẩu"}
      </Button>

      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onBackOtp}
          className="inline-flex items-center gap-1 text-white/70 underline hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại OTP
        </button>

        <button
          type="button"
          onClick={onBackLogin}
          className="text-white/40 underline hover:text-white"
        >
          Về đăng nhập
        </button>
      </div>
    </div>
  );
}
