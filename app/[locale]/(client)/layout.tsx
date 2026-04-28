import ClientShell from "@/components/client/client-shell"
import type { ReactNode } from "react"

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <ClientShell>{children}</ClientShell>
}
