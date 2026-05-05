"use client";

import { Button } from "@/components/ui/button";

import PasswordField from "./password-field";

export default function LoginStep({
  signin,
  setSignin,
  loading,
  onSubmit,
  onForgot,
  onRegister,
}: {
  signin: { email: string; password: string };
  setSignin: React.Dispatch<
    React.SetStateAction<{ email: string; password: string }>
  >;
  loading: boolean;
  onSubmit: () => void;
  onForgot: () => void;
  onRegister: () => void;
}) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-2">
        <label className="text-sm text-white/70">Email</label>
        <input
          value={signin.email}
          onChange={(event) =>
            setSignin((current) => ({ ...current, email: event.target.value }))
          }
          className="h-11 w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 text-sm text-white/90 outline-none placeholder:text-white/30 focus:border-purple-500"
          placeholder="you@email.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">Mật khẩu</label>
        <PasswordField
          value={signin.password}
          onChange={(value) =>
            setSignin((current) => ({ ...current, password: value }))
          }
          autoComplete="current-password"
        />
      </div>

      <Button
        disabled={loading}
        className="h-11 w-full rounded-xl bg-purple-600 text-white hover:bg-purple-700"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onForgot}
          className="text-white/70 underline hover:text-white"
        >
          Quên mật khẩu?
        </button>

        <div className="text-white/40">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={onRegister}
            className="text-white underline"
          >
            Đăng ký
          </button>
        </div>
      </div>
    </form>
  );
}
