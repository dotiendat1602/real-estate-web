"use client";

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
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { AuthApi } from "@/lib/api/auth";
import type { LoginRequest } from "@/types/interfaces/api/auth";
import { useLocale } from "next-intl";
import { setAccessToken, setRefreshToken } from "@/lib/utils/cookies";

const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPageContent() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: LoginValues) => {
    setServerError("");

    const payload: LoginRequest = {
      email: values.email,
      password: values.password,
    };

    try {
      const data = await AuthApi.login(payload);

      if (!data?.accessToken) {
        setServerError("Không nhận được access token từ máy chủ.");
        return;
      }

      setAccessToken(data.accessToken);
      if (data.refreshToken) setRefreshToken(data.refreshToken);

      router.push(`/${locale}/pages/dashboard`);
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.";
      setServerError(message);
    }
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-6 dark:from-zinc-900 dark:to-zinc-800">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white/80 p-8 shadow-xl dark:bg-zinc-900/80"
          autoComplete="off"
        >
          <h1 className="text-center text-3xl font-extrabold text-blue-700 dark:text-blue-300">
            Đăng nhập tài khoản
          </h1>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập email"
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && (
            <Alert variant="destructive">
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <div className="flex flex-col items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <Link
              href={`/${locale}/auth/forgot-password`}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </form>
      </Form>
    </section>
  );
}
