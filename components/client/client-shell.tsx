import type { ReactNode } from "react"
import Header from "./header"
import Footer from "./footer"
import { AuthProvider } from "@/app/[locale]/(client)/auth/auth-provider"
import ChatWidget from "@/app/[locale]/(client)/chat/chat-widget"
import AuthModalMount from "@/app/[locale]/(client)/auth/auth-modal/index"
import { ChatProvider } from "@/app/[locale]/(client)/chat/chat-context"

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ChatProvider>
        <div className="relative min-h-screen bg-[#0a0a0a] text-white">
          <Header />
          <main>{children}</main>
          <Footer />

          <AuthModalMount />
          <ChatWidget />
        </div>
      </ChatProvider>
    </AuthProvider>
  )
}
