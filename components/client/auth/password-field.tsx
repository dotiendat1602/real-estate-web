"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
};

export default function PasswordField({
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-purple-500 dark:border-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-white/90 dark:placeholder:text-white/30"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute top-1/2 right-3 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
