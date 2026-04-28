"use client"

import { Button } from "@/components/ui/button"

export default function LoginStep({
  signin,
  setSignin,
  loading,
  onSubmit,
  onForgot,
  onRegister,
}: {
  signin: { email: string; password: string }
  setSignin: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>
  loading: boolean
  onSubmit: () => void
  onForgot: () => void
  onRegister: () => void
}) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div className="space-y-2">
        <label className="text-sm text-white/70">Email</label>
        <input
          value={signin.email}
          onChange={(e) => setSignin((p) => ({ ...p, email: e.target.value }))}
          className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
          placeholder="you@email.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">Mật khẩu</label>
        <input
          type="password"
          value={signin.password}
          onChange={(e) => setSignin((p) => ({ ...p, password: e.target.value }))}
          className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
          placeholder="••••••••"
        />
      </div>

      <Button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl">
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      <div className="flex items-center justify-between text-xs">
        <button type="button" onClick={onForgot} className="text-white/70 hover:text-white underline">
          Quên mật khẩu?
        </button>

        <div className="text-white/40">
          Chưa có tài khoản?{" "}
          <button type="button" onClick={onRegister} className="text-white underline">
            Đăng ký
          </button>
        </div>
      </div>
    </form>
  )
}
