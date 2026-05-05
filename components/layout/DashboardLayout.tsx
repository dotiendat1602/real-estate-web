import type React from "react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {children}
    </div>
  )
}
