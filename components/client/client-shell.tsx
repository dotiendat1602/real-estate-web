import type { ReactNode } from "react";

import AuthModalMount from "@/app/[locale]/(client)/auth/auth-modal/index";
import { AuthProvider } from "@/app/[locale]/(client)/auth/auth-provider";
import { ChatProvider } from "@/app/[locale]/(client)/chat/chat-context";
import ChatWidget from "@/app/[locale]/(client)/chat/chat-widget";

import Footer from "./footer";
import Header from "./header";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ChatProvider>
        <div className="client-theme relative min-h-screen bg-zinc-50 text-zinc-950 dark:bg-[#0a0a0a] dark:text-white">
          <Header />
          <main>{children}</main>
          <Footer />

          <AuthModalMount />
          <ChatWidget />
        </div>
      </ChatProvider>
    </AuthProvider>
  );
}
