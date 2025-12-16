"use client"

import * as React from "react"
import { AuthApi } from "@/lib/api/auth"
import { SignupRole, View } from "@/types/enums/auth"

export function useAuthModalState(params: {
  authModalOpen: boolean
  authModalMode: "signin" | "signup"
  openAuthModal: (mode: "signin" | "signup") => void
  signIn: (payload: { email: string; password: string }) => Promise<void>
  signUp: (payload: { name: string; email: string; password: string; role: SignupRole }) => Promise<void>
}) {
  const { authModalOpen, authModalMode, openAuthModal, signIn, signUp } = params

  const [view, setView] = React.useState<View>("login")

  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [infoMsg, setInfoMsg] = React.useState<string | null>(null)

  // login/register states
  const [signin, setSignin] = React.useState({ email: "", password: "" })
  const [signup, setSignup] = React.useState<{ name: string; email: string; password: string; role: SignupRole }>({
    name: "",
    email: "",
    password: "",
    role: "USER",
  })

  // forgot password states
  const [fpEmail, setFpEmail] = React.useState("")
  const [fpOtp, setFpOtp] = React.useState("")
  const [fpResetToken, setFpResetToken] = React.useState<string | null>(null)
  const [fpExpiresInSec, setFpExpiresInSec] = React.useState<number | null>(null)
  const [fpNewPassword, setFpNewPassword] = React.useState("")
  const [fpConfirmPassword, setFpConfirmPassword] = React.useState("")

  // resend cooldown 10s
  const [resendLeft, setResendLeft] = React.useState(0) // seconds

  const resetNoti = () => {
    setErrorMsg(null)
    setInfoMsg(null)
  }

  React.useEffect(() => {
    if (!authModalOpen) return
    setView(authModalMode === "signin" ? "login" : "register")
    resetNoti()
  }, [authModalOpen, authModalMode])

  React.useEffect(() => {
    if (resendLeft <= 0) return
    const t = setInterval(() => {
      setResendLeft((s) => (s <= 1 ? 0 : s - 1))
    }, 1000)
    return () => clearInterval(t)
  }, [resendLeft])

  const isEmailLike = (v: string) => /\S+@\S+\.\S+/.test(v.trim())
  const normalizeErr = (e: any) =>
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.response?.data?.msg ||
    e?.message ||
    "Có lỗi xảy ra, vui lòng thử lại."

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

  const startResendCooldown = () => setResendLeft(10)

  const handleLogin = async () => {
    resetNoti()
    if (!isEmailLike(signin.email)) return setErrorMsg("Email không hợp lệ.")
    if (!signin.password) return setErrorMsg("Vui lòng nhập mật khẩu.")

    setLoading(true)
    try {
      await signIn({ email: signin.email.trim(), password: signin.password })
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
        startResendCooldown()
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
        setSignin((p) => ({ ...p, email: fpEmail.trim(), password: "" }))

        // cleanup forgot states
        setFpOtp("")
        setFpResetToken(null)
        setFpExpiresInSec(null)
        setFpNewPassword("")
        setFpConfirmPassword("")
        setResendLeft(0)

        toLogin()
      } else {
        setErrorMsg(res.message || "Không thể đặt lại mật khẩu.")
      }
    } catch (e) {
      setErrorMsg(normalizeErr(e))
    } finally {
      setLoading(false)
    }
  }

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

  return {
    // view + header
    view,
    setView,
    headerTitle,
    headerDesc,

    // notices/loading
    loading,
    errorMsg,
    infoMsg,
    resetNoti,

    // login/register state
    signin,
    setSignin,
    signup,
    setSignup,

    // forgot state
    fpEmail,
    setFpEmail,
    fpOtp,
    setFpOtp,
    fpNewPassword,
    setFpNewPassword,
    fpConfirmPassword,
    setFpConfirmPassword,

    // cooldown
    resendLeft,

    // navigation
    toLogin,
    toRegister,
    toForgot,

    // handlers
    handleLogin,
    handleRegister,
    handleRequestOtp,
    handleVerifyOtp,
    handleResetPassword,
  }
}
