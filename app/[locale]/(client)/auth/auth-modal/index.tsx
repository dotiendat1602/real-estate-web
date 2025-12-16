"use client"

import * as React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useAuth } from "../auth-provider"
import { useAuthModalState } from "@/hooks/client/auth/use-auth-modal-state"
import AuthModalHeader from "./header"
import AuthTabs from "./tabs"
import Notice from "./notice"
import LoginStep from "@/components/client/auth/login-step"
import RegisterStep from "@/components/client/auth/register-step"
import ForgotEmailStep from "@/components/client/auth/forgot-email-step"
import ForgotOtpStep from "@/components/client/auth/forgot-otp-step"
import ForgotResetStep from "@/components/client/auth/forgot-reset-step"

export default function AuthModalMount() {
  const { authModalOpen, closeAuthModal, authModalMode, openAuthModal, signIn, signUp } = useAuth()

  const s = useAuthModalState({
    authModalOpen,
    authModalMode,
    openAuthModal,
    signIn,
    signUp,
  })

  const onClose = () => {
    s.resetNoti()
    closeAuthModal()
  }

  const showTabs = s.view === "login" || s.view === "register"

  return (
    <Dialog open={authModalOpen} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent className="max-w-[520px] border border-[#1a1a1a] bg-[#0f0f0f] p-0 text-white">
        <AuthModalHeader title={s.headerTitle} desc={s.headerDesc} onClose={onClose} />

        {showTabs && (
          <AuthTabs active={s.view === "login" ? "login" : "register"} onLogin={s.toLogin} onRegister={s.toRegister} />
        )}

        <div className="px-6 pb-6 pt-5 space-y-4">
          <Notice errorMsg={s.errorMsg} infoMsg={s.infoMsg} />

          {s.view === "login" && (
            <LoginStep
              signin={s.signin}
              setSignin={s.setSignin}
              loading={s.loading}
              onSubmit={s.handleLogin}
              onForgot={s.toForgot}
              onRegister={s.toRegister}
            />
          )}

          {s.view === "register" && (
            <RegisterStep
              signup={s.signup}
              setSignup={s.setSignup}
              loading={s.loading}
              onSubmit={s.handleRegister}
              onLogin={s.toLogin}
            />
          )}

          {s.view === "forgot_email" && (
            <ForgotEmailStep
              email={s.fpEmail}
              setEmail={s.setFpEmail}
              loading={s.loading}
              onSubmit={s.handleRequestOtp}
              onBackLogin={s.toLogin}
              onRegister={s.toRegister}
            />
          )}

          {s.view === "forgot_otp" && (
            <ForgotOtpStep
              email={s.fpEmail}
              otp={s.fpOtp}
              setOtp={s.setFpOtp}
              loading={s.loading}
              onVerify={s.handleVerifyOtp}
              onBack={() => s.setView("forgot_email")}
              onResend={s.handleRequestOtp}
              resendLeft={s.resendLeft}
            />
          )}

          {s.view === "forgot_reset" && (
            <ForgotResetStep
              newPassword={s.fpNewPassword}
              confirmPassword={s.fpConfirmPassword}
              setNewPassword={s.setFpNewPassword}
              setConfirmPassword={s.setFpConfirmPassword}
              loading={s.loading}
              onSubmit={s.handleResetPassword}
              onBackOtp={() => s.setView("forgot_otp")}
              onBackLogin={s.toLogin}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
