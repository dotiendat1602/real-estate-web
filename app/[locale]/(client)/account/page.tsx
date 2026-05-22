"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Lock, Loader2, Mail, Phone, ShieldCheck, UserCircle } from "lucide-react";

import { useAuth } from "../auth/auth-provider";
import { UsersApi } from "@/lib/api/user";
import { withLocalePath } from "@/lib/utils/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastContainer, useToast } from "@/components/ui/toast";
import Link from "next/link";

export default function AccountPage() {
  const locale = useLocale();
  const { isAuthed, isLoadingUser, user, role, openAuthModal, refreshUser } = useAuth();
  const toast = useToast();

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);

  React.useEffect(() => {
    setName(user?.name ?? "");
    setPhone(user?.phone ?? "");
  }, [user?.name, user?.phone]);

  const submitProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextName = name.trim();
    const nextPhone = phone.trim();

    if (!nextName || !nextPhone) {
      toast.warning("Missing information", "Name and phone are required.");
      return;
    }

    setSavingProfile(true);
    try {
      await UsersApi.updatedProfile({ name: nextName, phone: nextPhone });
      await refreshUser();
      toast.success("Profile updated", "Your account information has been saved.");
    } catch (error: any) {
      toast.error(
        "Update failed",
        error?.response?.data?.message || error?.message || "Unable to update profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const submitPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("Missing password", "Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning("Password mismatch", "New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.warning("Password too short", "New password must be at least 6 characters.");
      return;
    }

    setSavingPassword(true);
    try {
      await UsersApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated", "You can use the new password on your next sign in.");
    } catch (error: any) {
      toast.error(
        "Password update failed",
        error?.response?.data?.message || error?.message || "Unable to update password.",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-zinc-50 px-4 py-16 dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-200 bg-white p-8 dark:border-[#262626] dark:bg-[#141414]">
          <div className="flex items-center gap-3 text-zinc-600 dark:text-white/70">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading account...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="min-h-[calc(100vh-200px)] bg-zinc-50 px-4 py-16 dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-[#262626] dark:bg-[#141414]">
          <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-[#262626] dark:bg-[#0a0a0a]">
            <UserCircle className="h-8 w-8 text-zinc-500 dark:text-white/50" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Account settings</h1>
          <p className="mt-3 text-zinc-600 dark:text-white/60">
            Sign in to update your profile and password.
          </p>
          <Button
            className="mt-6 bg-purple-600 text-white hover:bg-purple-700"
            onClick={() => openAuthModal("signin")}
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-zinc-50 text-zinc-950 dark:bg-[#0a0a0a] dark:text-white">
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-10 sm:px-6 lg:px-10">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-[#262626] dark:bg-[#141414] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-200 bg-purple-50 dark:border-purple-600/30 dark:bg-purple-600/10">
                <UserCircle className="h-9 w-9 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Account settings</h1>
                <p className="mt-1 text-sm text-zinc-600 dark:text-white/60">
                  Update your personal information and password.
                </p>
              </div>
            </div>

            <Button asChild variant="outline" className="border-zinc-200 bg-transparent dark:border-[#262626]">
              <Link href={withLocalePath(role === "AGENT" ? "/my-properties" : "/saved", locale)}>
                Back to workspace
              </Link>
            </Button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-[#262626] dark:bg-[#141414] md:p-8">
            <h2 className="text-xl font-bold">Profile information</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-white/60">
              This information is used for saved listings, inquiries and agent contact flows.
            </p>

            <form className="mt-6 space-y-5" onSubmit={submitProfile}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Full name</Label>
                  <Input
                    id="account-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-11 border-zinc-200 bg-white dark:border-[#262626] dark:bg-[#0a0a0a]"
                    disabled={savingProfile}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-phone">Phone</Label>
                  <Input
                    id="account-phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="h-11 border-zinc-200 bg-white dark:border-[#262626] dark:bg-[#0a0a0a]"
                    disabled={savingProfile}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex h-11 items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-600 dark:border-[#262626] dark:bg-[#0a0a0a] dark:text-white/60">
                    <Mail className="h-4 w-4" />
                    {user?.email ?? "-"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex h-11 items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-600 dark:border-[#262626] dark:bg-[#0a0a0a] dark:text-white/60">
                    <ShieldCheck className="h-4 w-4" />
                    {role ?? user?.role ?? "-"}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="bg-purple-600 text-white hover:bg-purple-700"
                disabled={savingProfile}
              >
                {savingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save profile
              </Button>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-[#262626] dark:bg-[#141414]">
              <h2 className="text-lg font-bold">Account summary</h2>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <UserCircle className="h-5 w-5 text-zinc-500 dark:text-white/50" />
                  <div>
                    <div className="text-zinc-500 dark:text-white/45">Name</div>
                    <div className="font-medium text-zinc-950 dark:text-white">{user?.name || "-"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-zinc-500 dark:text-white/50" />
                  <div>
                    <div className="text-zinc-500 dark:text-white/45">Phone</div>
                    <div className="font-medium text-zinc-950 dark:text-white">{user?.phone || "-"}</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-[#262626] dark:bg-[#141414]">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                <h2 className="text-lg font-bold">Change password</h2>
              </div>

              <form className="mt-5 space-y-4" onSubmit={submitPassword}>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className="h-11 border-zinc-200 bg-white dark:border-[#262626] dark:bg-[#0a0a0a]"
                    disabled={savingPassword}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="h-11 border-zinc-200 bg-white dark:border-[#262626] dark:bg-[#0a0a0a]"
                    disabled={savingPassword}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm new password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="h-11 border-zinc-200 bg-white dark:border-[#262626] dark:bg-[#0a0a0a]"
                    disabled={savingPassword}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 text-white hover:bg-purple-700"
                  disabled={savingPassword}
                >
                  {savingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Update password
                </Button>
              </form>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
