"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AuthApi } from "@/lib/api/auth";
import type {
  RequestOtpRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  VerifyOtpResponse,
} from "@/types/interfaces/api/auth";

const step1Schema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
});

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^*()_+\-=\[\]{};':"\\|,.<>/?~`]).{8,}$/;

const step2Schema = z
  .object({
    otp: z
      .string()
      .min(4, "OTP tối thiểu 4 ký tự")
      .max(8, "OTP tối đa 8 ký tự"),
    newPassword: z
      .string()
      .regex(
        passwordRegex,
        "Mật khẩu tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"
      ),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

export default function ForgotPasswordPageContent() {
  const router = useRouter();
  const locale = useLocale();

  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState<number>(0);

  const formStep1 = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { email: "" },
  });

  const formStep2 = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const homeHref = `/${locale}/home`;

  const startCooldown = useCallback((sec = 60) => {
    setCooldown(sec);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Gửi OTP
  const onSubmitStep1 = async (values: Step1Values) => {
    setServerError("");
    setServerSuccess("");
    try {
      const payload: RequestOtpRequest = { email: values.email };
      await AuthApi.requestOtp(payload);
      setEmail(values.email);
      setServerSuccess("Đã gửi mã OTP. Vui lòng kiểm tra email của bạn.");
      setStep(2);
      startCooldown(60);
    } catch (error: any) {
      const msg =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Không thể gửi mã OTP. Vui lòng thử lại.";
      setServerError(msg);
    }
  };

  // Gửi lại OTP
  const onResendOtp = async () => {
    if (cooldown > 0 || !email) return;
    setServerError("");
    setServerSuccess("");
    try {
      await AuthApi.requestOtp({ email });
      setServerSuccess("Đã gửi lại mã OTP.");
      startCooldown(60);
    } catch (error: any) {
      const msg =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Không thể gửi lại OTP. Vui lòng thử lại.";
      setServerError(msg);
    }
  };

  // 2 API: Verify OTP -> Resend Password
  const onSubmitStep2 = async (values: Step2Values) => {
    setServerError("");
    setServerSuccess("");

    try {
      const verifyPayload: VerifyOtpRequest = { email, otp: values.otp };
      const verifyRes = await AuthApi.verifyOtp(verifyPayload);

      if (!verifyRes?.ok || !verifyRes.resetToken) {
        setServerError("Mã OTP không hợp lệ hoặc đã hết hạn.");
        return;
      }

      const resetPayload: ResetPasswordRequest = {
        resetToken: verifyRes.resetToken,
        newPassword: values.newPassword,
      };
      await AuthApi.resetPassword(resetPayload);

      setServerSuccess("Đặt lại mật khẩu thành công. Bạn có thể đăng nhập.");
      setTimeout(() => router.replace(homeHref), 1000);
    } catch (error: any) {
      const msg =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Không thể đặt lại mật khẩu. Vui lòng thử lại.";
      setServerError(msg);
    }
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-6 dark:from-zinc-900 dark:to-zinc-800">
      <div className="w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-xl dark:bg-zinc-900/80">
        <h1 className="mb-1 text-center text-3xl font-extrabold text-blue-700 dark:text-blue-300">
          Quên mật khẩu
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-600 dark:text-zinc-300">
          {step === 1
            ? "Nhập email để nhận mã OTP."
            : "Nhập mã OTP và tạo mật khẩu mới."}
        </p>

        {serverError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        {serverSuccess && (
          <Alert className="mb-4">
            <AlertTitle>Thành công</AlertTitle>
            <AlertDescription>{serverSuccess}</AlertDescription>
          </Alert>
        )}

        {/* Indicator */}
        <div className="mb-6 flex items-center justify-center gap-3 text-xs font-medium">
          <div
            className={`h-2 w-20 rounded-full ${step >= 1 ? "bg-blue-600" : "bg-zinc-300"
              }`}
          />
          <div
            className={`h-2 w-20 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-zinc-300"
              }`}
          />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <Form {...formStep1}>
            <form
              onSubmit={formStep1.handleSubmit(onSubmitStep1)}
              className="flex flex-col gap-4"
              autoComplete="off"
            >
              <FormField
                control={formStep1.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="cursor-pointer"
                disabled={formStep1.formState.isSubmitting}
              >
                {formStep1.formState.isSubmitting ? "Đang gửi OTP..." : "Gửi OTP"}
              </Button>

              <div className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-300">
                <Link
                  href={homeHref}
                  className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
                >
                  Quay lại trang chủ
                </Link>
              </div>
            </form>
          </Form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Form {...formStep2}>
            <form
              onSubmit={formStep2.handleSubmit(onSubmitStep2)}
              className="flex flex-col gap-4"
              autoComplete="off"
            >
              {/* Email readonly */}
              <FormItem>
                <FormLabel className="text-xs text-zinc-500">Email</FormLabel>
                <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
                  {email}
                </div>
              </FormItem>

              <FormField
                control={formStep2.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã OTP</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã OTP" autoFocus {...field} />
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <FormMessage />
                      <button
                        type="button"
                        className={`text-xs underline cursor-pointer ${cooldown > 0
                          ? "cursor-not-allowed text-zinc-400"
                          : "text-blue-600 dark:text-blue-400"
                          }`}
                        onClick={onResendOtp}
                        disabled={cooldown > 0}
                        aria-disabled={cooldown > 0}
                      >
                        Gửi lại {cooldown > 0 ? `(${cooldown}s)` : ""}
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={formStep2.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="mt-1 text-xs text-zinc-500">
                      Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={formStep2.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="cursor-pointer"
                disabled={formStep2.formState.isSubmitting}
              >
                {formStep2.formState.isSubmitting
                  ? "Đang đặt lại..."
                  : "Đặt lại mật khẩu"}
              </Button>

              <div className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-300">
                <Link
                  href={homeHref}
                  className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
                >
                  Quay lại trang chủ
                </Link>
              </div>
            </form>
          </Form>
        )}
      </div>
    </section>
  );
}
