"use client";

import { Button } from "@/components/ui/button";

import PasswordField from "./password-field";

const labelClass = "text-sm text-zinc-600 dark:text-white/70";
const inputClass =
  "h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-purple-500 dark:border-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-white/90 dark:placeholder:text-white/30";

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
        <label className={labelClass}>Email</label>
        <input
          value={signin.email}
          onChange={(event) =>
            setSignin((current) => ({ ...current, email: event.target.value }))
          }
          className={inputClass}
          placeholder="you@email.com"
        />
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Mật khẩu</label>
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
          className="text-zinc-600 underline hover:text-zinc-950 dark:text-white/70 dark:hover:text-white"
        >
          Quên mật khẩu?
        </button>

        <div className="text-zinc-500 dark:text-white/40">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={onRegister}
            className="text-zinc-950 underline dark:text-white"
          >
            Đăng ký
          </button>
        </div>
      </div>
    </form>
  );
}
