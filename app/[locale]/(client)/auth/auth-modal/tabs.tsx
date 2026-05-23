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
      <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-[#1a1a1a] dark:bg-[#0a0a0a]">
        <button
          type="button"
          onClick={onLogin}
          className={[
            "px-4 py-2 text-sm rounded-lg transition-colors",
            active === "login"
              ? "bg-white text-zinc-950 shadow-sm dark:bg-white/10 dark:text-white"
              : "text-zinc-500 hover:text-zinc-950 dark:text-white/60 dark:hover:text-white",
          ].join(" ")}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={onRegister}
          className={[
            "px-4 py-2 text-sm rounded-lg transition-colors",
            active === "register"
              ? "bg-white text-zinc-950 shadow-sm dark:bg-white/10 dark:text-white"
              : "text-zinc-500 hover:text-zinc-950 dark:text-white/60 dark:hover:text-white",
          ].join(" ")}
        >
          Đăng ký
        </button>
      </div>
    </div>
  )
}
