"use client"

export default function AuthTabs({
  active,
  onLogin,
  onRegister,
}: {
  active: "login" | "register"
  onLogin: () => void
  onRegister: () => void
}) {
  return (
    <div className="px-6 pt-4">
      <div className="inline-flex rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-1">
        <button
          type="button"
          onClick={onLogin}
          className={[
            "px-4 py-2 text-sm rounded-lg transition-colors",
            active === "login" ? "bg-white/10 text-white" : "text-white/60 hover:text-white",
          ].join(" ")}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={onRegister}
          className={[
            "px-4 py-2 text-sm rounded-lg transition-colors",
            active === "register" ? "bg-white/10 text-white" : "text-white/60 hover:text-white",
          ].join(" ")}
        >
          Đăng ký
        </button>
      </div>
    </div>
  )
}
