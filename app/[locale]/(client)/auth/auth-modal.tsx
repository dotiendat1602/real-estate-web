"use client"

import * as React from "react"
import { X, ArrowLeft, MailCheck, ShieldCheck, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AuthApi } from "@/lib/api/auth"

type SignupRole = "USER" | "AGENT"
type View = "login" | "register" | "forgot_email" | "forgot_otp" | "forgot_reset"

export default function AuthModalMount() {
  const { authModalOpen, closeAuthModal, authModalMode, openAuthModal, signIn, signUp } = useAuth()

  // -------------------------
  // View control
  // -------------------------
  const [view, setView] = React.useState<View>("login")

  // sync view theo authModalMode (giữ tabs như cũ)
  React.useEffect(() => {
    if (!authModalOpen) return
    setView(authModalMode === "signin" ? "login" : "register")
  }, [authModalOpen, authModalMode])

  // -------------------------
  // Shared UI state
  // -------------------------
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [infoMsg, setInfoMsg] = React.useState<string | null>(null)

  const resetNoti = () => {
    setErrorMsg(null)
    setInfoMsg(null)
  }

  const onClose = () => {
    resetNoti()
    setLoading(false)
    closeAuthModal()
  }

  // -------------------------
  // Login/Register states
  // -------------------------
  const [signin, setSignin] = React.useState({ email: "", password: "" })
  const [signup, setSignup] = React.useState<{ name: string; email: string; password: string; role: SignupRole }>({
    name: "",
    email: "",
    password: "",
    role: "USER",
  })

  // -------------------------
  // Forgot password (OTP) states
  // -------------------------
  const [fpEmail, setFpEmail] = React.useState("")
  const [fpOtp, setFpOtp] = React.useState("")
  const [fpResetToken, setFpResetToken] = React.useState<string | null>(null)
  const [fpExpiresInSec, setFpExpiresInSec] = React.useState<number | null>(null)
  const [fpNewPassword, setFpNewPassword] = React.useState("")
  const [fpConfirmPassword, setFpConfirmPassword] = React.useState("")

  const toLogin = () => {
    resetNoti()
    setView("login")
    openAuthModal("signin")
  }

  const toRegister = () => {
    resetNoti()
    setView("register")
    openAuthModal("signup")
  }

  const toForgot = () => {
    resetNoti()
    setView("forgot_email")
  }

  // -------------------------
  // Simple validators
  // -------------------------
  const isEmailLike = (v: string) => /\S+@\S+\.\S+/.test(v.trim())
  const normalizeErr = (e: any) => {
    // cố gắng lấy message từ axios error structure
    return (
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.response?.data?.msg ||
      e?.message ||
      "Có lỗi xảy ra, vui lòng thử lại."
    )
  }

  // -------------------------
  // Actions
  // -------------------------
  const handleLogin = async () => {
    resetNoti()
    if (!isEmailLike(signin.email)) return setErrorMsg("Email không hợp lệ.")
    if (!signin.password) return setErrorMsg("Vui lòng nhập mật khẩu.")

    setLoading(true)
    try {
      await signIn({ email: signin.email.trim(), password: signin.password })
      // signIn thành công sẽ tự close modal trong provider (nếu bạn đang close ở đó)
      // nhưng để chắc chắn: onClose()
    } catch (e) {
      setErrorMsg(normalizeErr(e))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    resetNoti()
    if (!signup.name.trim()) return setErrorMsg("Vui lòng nhập họ tên.")
    if (!isEmailLike(signup.email)) return setErrorMsg("Email không hợp lệ.")
    if (!signup.password) return setErrorMsg("Vui lòng nhập mật khẩu.")
    if (signup.password.length < 6) return setErrorMsg("Mật khẩu tối thiểu 6 ký tự.")

    setLoading(true)
    try {
      await signUp({
        name: signup.name.trim(),
        email: signup.email.trim(),
        password: signup.password,
        role: signup.role,
      })
    } catch (e) {
      setErrorMsg(normalizeErr(e))
    } finally {
      setLoading(false)
    }
  }

  const handleRequestOtp = async () => {
    resetNoti()
    if (!isEmailLike(fpEmail)) return setErrorMsg("Email không hợp lệ.")

    setLoading(true)
    try {
      const res = await AuthApi.requestOtp({ email: fpEmail.trim() })
      if (res.ok) {
        setInfoMsg(res.message || "Đã gửi OTP. Vui lòng kiểm tra email.")
        setView("forgot_otp")
      } else {
        setErrorMsg(res.message || "Không thể gửi OTP.")
      }
    } catch (e) {
      setErrorMsg(normalizeErr(e))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    resetNoti()
    if (!isEmailLike(fpEmail)) return setErrorMsg("Email không hợp lệ.")
    if (!fpOtp.trim()) return setErrorMsg("Vui lòng nhập OTP.")

    setLoading(true)
    try {
      const res = await AuthApi.verifyOtp({ email: fpEmail.trim(), otp: fpOtp.trim() })
      if (res.ok) {
        setFpResetToken(res.resetToken)
        setFpExpiresInSec(res.expiresInSec)
        setInfoMsg("Xác thực OTP thành công. Bạn có thể đặt lại mật khẩu.")
        setView("forgot_reset")
      } else {
        setErrorMsg("OTP không đúng hoặc đã hết hạn.")
      }
    } catch (e) {
      setErrorMsg(normalizeErr(e))
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    resetNoti()
    if (!fpResetToken) return setErrorMsg("Thiếu resetToken. Vui lòng xác thực OTP lại.")
    if (!fpNewPassword) return setErrorMsg("Vui lòng nhập mật khẩu mới.")
    if (fpNewPassword.length < 6) return setErrorMsg("Mật khẩu tối thiểu 6 ký tự.")
    if (fpNewPassword !== fpConfirmPassword) return setErrorMsg("Mật khẩu xác nhận không khớp.")

    setLoading(true)
    try {
      const res = await AuthApi.resetPassword({ resetToken: fpResetToken, newPassword: fpNewPassword })
      if (res.ok) {
        setInfoMsg(res.message || "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.")
        // đưa user về login + prefill email
        setSignin((p) => ({ ...p, email: fpEmail.trim(), password: "" }))
        setFpOtp("")
        setFpResetToken(null)
        setFpExpiresInSec(null)
        setFpNewPassword("")
        setFpConfirmPassword("")
        setView("login")
        openAuthModal("signin")
      } else {
        setErrorMsg(res.message || "Không thể đặt lại mật khẩu.")
      }
    } catch (e) {
      setErrorMsg(normalizeErr(e))
    } finally {
      setLoading(false)
    }
  }

  // -------------------------
  // Title + subtitle
  // -------------------------
  const headerTitle =
    view === "login"
      ? "Đăng nhập"
      : view === "register"
        ? "Tạo tài khoản"
        : view === "forgot_email"
          ? "Quên mật khẩu"
          : view === "forgot_otp"
            ? "Xác thực OTP"
            : "Đặt lại mật khẩu"

  const headerDesc =
    view === "login"
      ? "Đăng nhập để chat với tư vấn viên và lưu bất động sản yêu thích."
      : view === "register"
        ? "Tạo tài khoản để chat và quản lý nhu cầu mua/thuê."
        : view === "forgot_email"
          ? "Nhập email để nhận mã OTP đặt lại mật khẩu."
          : view === "forgot_otp"
            ? "Nhập OTP vừa gửi về email để lấy reset token."
            : `Tạo mật khẩu mới cho tài khoản của bạn${fpExpiresInSec ? ` (token còn hiệu lực ~${fpExpiresInSec}s)` : ""}.`

  // -------------------------
  // UI Blocks
  // -------------------------
  const Notice = () => (
    <div className="space-y-2">
      {errorMsg && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMsg}
        </div>
      )}
      {infoMsg && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {infoMsg}
        </div>
      )}
    </div>
  )

  return (
    <Dialog open={authModalOpen} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent className="max-w-[520px] border border-[#1a1a1a] bg-[#0f0f0f] p-0 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] px-6 py-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold">{headerTitle}</DialogTitle>
            <div className="text-xs text-white/50">{headerDesc}</div>
          </DialogHeader>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 hover:text-white hover:bg-white/5"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs: chỉ hiện khi login/register */}
        {(view === "login" || view === "register") && (
          <div className="px-6 pt-4">
            <div className="inline-flex rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-1">
              <button
                type="button"
                onClick={toLogin}
                className={[
                  "px-4 py-2 text-sm rounded-lg transition-colors",
                  view === "login" ? "bg-white/10 text-white" : "text-white/60 hover:text-white",
                ].join(" ")}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={toRegister}
                className={[
                  "px-4 py-2 text-sm rounded-lg transition-colors",
                  view === "register" ? "bg-white/10 text-white" : "text-white/60 hover:text-white",
                ].join(" ")}
              >
                Đăng ký
              </button>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="px-6 pb-6 pt-5 space-y-4">
          <Notice />

          {/* ---------------- LOGIN ---------------- */}
          {view === "login" && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleLogin()
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

              <Button
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <div className="flex items-center justify-between text-xs">
                <button type="button" onClick={toForgot} className="text-white/70 hover:text-white underline">
                  Quên mật khẩu?
                </button>

                <div className="text-white/40">
                  Chưa có tài khoản?{" "}
                  <button type="button" onClick={toRegister} className="text-white underline">
                    Đăng ký
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ---------------- REGISTER ---------------- */}
          {view === "register" && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleRegister()
              }}
            >
              {/* Role */}
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
                    Môi giới
                  </button>
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

              <Button
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl"
              >
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </Button>

              <div className="text-center text-xs text-white/40">
                Đã có tài khoản?{" "}
                <button type="button" onClick={toLogin} className="text-white underline">
                  Đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* ---------------- FORGOT: EMAIL ---------------- */}
          {view === "forgot_email" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <MailCheck className="h-4 w-4" />
                <span>Nhập email để nhận OTP</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/70">Email</label>
                <input
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
                  placeholder="you@email.com"
                />
              </div>

              <Button
                disabled={loading}
                onClick={handleRequestOtp}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl"
              >
                {loading ? "Đang gửi OTP..." : "Gửi OTP"}
              </Button>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    resetNoti()
                    setView("login")
                    openAuthModal("signin")
                  }}
                  className="inline-flex items-center gap-1 text-white/70 hover:text-white underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại đăng nhập
                </button>

                <button type="button" onClick={toRegister} className="text-white/40 hover:text-white underline">
                  Tạo tài khoản
                </button>
              </div>
            </div>
          )}

          {/* ---------------- FORGOT: OTP ---------------- */}
          {view === "forgot_otp" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-sm text-white/70">
                Email: <span className="text-white/90">{fpEmail || "—"}</span>
              </div>

              <div className="flex items-center gap-2 text-white/70 text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>Nhập OTP</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/70">OTP</label>
                <input
                  value={fpOtp}
                  onChange={(e) => setFpOtp(e.target.value)}
                  className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
                  placeholder="VD: 123456"
                />
              </div>

              <Button
                disabled={loading}
                onClick={handleVerifyOtp}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl"
              >
                {loading ? "Đang xác thực..." : "Xác thực OTP"}
              </Button>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    resetNoti()
                    setView("forgot_email")
                  }}
                  className="inline-flex items-center gap-1 text-white/70 hover:text-white underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Đổi email / gửi lại OTP
                </button>

                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-white/40 hover:text-white underline"
                  disabled={loading}
                >
                  Gửi lại OTP
                </button>
              </div>
            </div>
          )}

          {/* ---------------- FORGOT: RESET PASSWORD ---------------- */}
          {view === "forgot_reset" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <KeyRound className="h-4 w-4" />
                <span>Đặt lại mật khẩu</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/70">Mật khẩu mới</label>
                <input
                  type="password"
                  value={fpNewPassword}
                  onChange={(e) => setFpNewPassword(e.target.value)}
                  className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/70">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  value={fpConfirmPassword}
                  onChange={(e) => setFpConfirmPassword(e.target.value)}
                  className="h-11 w-full rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] px-4 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-purple-500"
                  placeholder="••••••••"
                />
              </div>

              <Button
                disabled={loading}
                onClick={handleResetPassword}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl"
              >
                {loading ? "Đang cập nhật..." : "Xác nhận đổi mật khẩu"}
              </Button>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    resetNoti()
                    setView("forgot_otp")
                  }}
                  className="inline-flex items-center gap-1 text-white/70 hover:text-white underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại OTP
                </button>

                <button type="button" onClick={toLogin} className="text-white/40 hover:text-white underline">
                  Về đăng nhập
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
