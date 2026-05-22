"use client";

import { SignupRole } from "@/types/enums/auth";
import { Button } from "@/components/ui/button";

import PasswordField from "./password-field";

type SignupState = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: SignupRole;
};

function RequiredMark() {
  return <span className="text-red-500">*</span>;
}

const labelClass = "text-sm text-zinc-600 dark:text-white/70";
const inputClass =
  "h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-purple-500 dark:border-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-white/90 dark:placeholder:text-white/30";

export default function RegisterStep({
  signup,
  setSignup,
  loading,
  onSubmit,
  onLogin,
}: {
  signup: SignupState;
  setSignup: React.Dispatch<React.SetStateAction<SignupState>>;
  loading: boolean;
  onSubmit: () => void;
  onLogin: () => void;
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
        <label className={labelClass}>Bạn là</label>
        <div className="inline-flex w-full rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-[#1a1a1a] dark:bg-[#0a0a0a]">
          {(["USER", "AGENT"] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSignup((current) => ({ ...current, role }))}
              className={[
                "flex-1 rounded-lg px-4 py-2 text-sm transition-colors",
                signup.role === role
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-white/10 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-950 dark:text-white/60 dark:hover:text-white",
              ].join(" ")}
            >
              {role === "USER" ? "Người dùng" : "Môi giới"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>
          Họ tên <RequiredMark />
        </label>
        <input
          value={signup.name}
          onChange={(event) =>
            setSignup((current) => ({ ...current, name: event.target.value }))
          }
          className={inputClass}
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div className="space-y-2">
        <label className={labelClass}>
          Email <RequiredMark />
        </label>
        <input
          value={signup.email}
          onChange={(event) =>
            setSignup((current) => ({ ...current, email: event.target.value }))
          }
          className={inputClass}
          placeholder="you@email.com"
        />
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Số điện thoại</label>
        <input
          value={signup.phone}
          onChange={(event) =>
            setSignup((current) => ({ ...current, phone: event.target.value }))
          }
          className={inputClass}
          placeholder="0901234567"
        />
      </div>

      <div className="space-y-2">
        <label className={labelClass}>
          Mật khẩu <RequiredMark />
        </label>
        <PasswordField
          value={signup.password}
          onChange={(value) =>
            setSignup((current) => ({ ...current, password: value }))
          }
          autoComplete="new-password"
        />
      </div>

      <Button
        disabled={loading}
        className="h-11 w-full rounded-xl bg-purple-600 text-white hover:bg-purple-700"
      >
        {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </Button>

      <div className="text-center text-xs text-zinc-500 dark:text-white/40">
        Đã có tài khoản?{" "}
        <button
          type="button"
          onClick={onLogin}
          className="text-zinc-950 underline dark:text-white"
        >
          Đăng nhập
        </button>
      </div>
    </form>
  );
}
