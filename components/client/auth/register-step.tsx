"use client"

import { Button } from "@/components/ui/button"
import { SignupRole } from "@/types/enums/auth";

export default function RegisterStep({
  signup,
  setSignup,
  loading,
  onSubmit,
  onLogin,
}: {
  signup: { name: string; email: string; password: string; role: SignupRole }
  setSignup: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; role: SignupRole }>>
  loading: boolean
  onSubmit: () => void
  onLogin: () => void
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
        <label className="text-sm text-white/70">Bạn là</label>
        <div className="inline-flex w-full rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-1">
          <button
            type="button"
            onClick={() => setSignup((p) => ({ ...p, role: "USER" }))}
            className={[
              "flex-1 px-4 py-2 text-sm rounded-lg transition-colors",
              signup.role === "USER" ? "bg-white/10 text-white" : "text-white/60 hover:text-white",
            ].join(" ")}
          >
            Người dùng
          </button>
          <button
            type="button"
            onClick={() => setSignup((p) => ({ ...p, role: "AGENT" }))}
            className={[
              "flex-1 px-4 py-2 text-sm rounded-lg transition-colors",
              signup.role === "AGENT" ? "bg-white/10 text-white" : "text-white/60 hover:text-white",
            ].join(" ")}
          >
            Môi giới / Agent
          </button>
        </div>
        <div className="text-xs text-white/40">
          {signup.role === "USER"
            ? "USER: xem tin, lưu yêu thích, chat tư vấn."
            : "AGENT: đăng tin, nhận lead/chat từ khách hàng."}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">Họ tên</label>
        <input
          value={signup.name}
          onChange={(e) => setSignup((p) => ({ ...p, name: e.target.value }))}
          className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">Email</label>
        <input
          value={signup.email}
          onChange={(e) => setSignup((p) => ({ ...p, email: e.target.value }))}
          className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
          placeholder="you@email.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">Mật khẩu</label>
        <input
          type="password"
          value={signup.password}
          onChange={(e) => setSignup((p) => ({ ...p, password: e.target.value }))}
          className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
          placeholder="••••••••"
        />
      </div>

      <Button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl">
        {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </Button>

      <div className="text-center text-xs text-white/40">
        Đã có tài khoản?{" "}
        <button type="button" onClick={onLogin} className="text-white underline">
          Đăng nhập
        </button>
      </div>
    </form>
  )
}
