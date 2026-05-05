"use client";

import * as React from "react";
import {
  Bold,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";

import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
};

type ToolbarAction = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  command: string;
  value?: string;
};

const actions: ToolbarAction[] = [
  { label: "Bold", icon: Bold, command: "bold" },
  { label: "Italic", icon: Italic, command: "italic" },
  { label: "Underline", icon: Underline, command: "underline" },
  { label: "Heading", icon: Heading2, command: "formatBlock", value: "h2" },
  { label: "Quote", icon: Quote, command: "formatBlock", value: "blockquote" },
  { label: "Bullet list", icon: List, command: "insertUnorderedList" },
  { label: "Numbered list", icon: ListOrdered, command: "insertOrderedList" },
  { label: "Undo", icon: Undo2, command: "undo" },
  { label: "Redo", icon: Redo2, command: "redo" },
];

export function RichTextEditor({
  id,
  value = "",
  onChange,
  disabled,
  placeholder,
  className,
  editorClassName,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isEmpty, setIsEmpty] = React.useState(() => !value.replace(/<[^>]*>/g, "").trim());

  React.useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor) return;
    if (editor.innerHTML !== value) {
      editor.innerHTML = value || "";
      setIsEmpty(!editor.innerText.trim());
    }
  }, [value]);

  const emitChange = React.useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    setIsEmpty(!editor.innerText.trim());
    onChange(editor.innerHTML);
  }, [onChange]);

  const runCommand = React.useCallback(
    (command: string, commandValue?: string) => {
      if (disabled) return;
      editorRef.current?.focus();
      document.execCommand(command, false, commandValue);
      emitChange();
    },
    [disabled, emitChange],
  );

  const addLink = React.useCallback(() => {
    if (disabled) return;
    const url = window.prompt("URL");
    if (!url) return;
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    runCommand("createLink", normalized);
  }, [disabled, runCommand]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-[#262626] bg-[#0a0a0a] text-white dark:border-[#262626] dark:bg-[#0a0a0a]",
        "border-zinc-200 bg-white text-zinc-950",
        disabled && "opacity-70",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50 p-2 dark:border-[#262626] dark:bg-[#141414]">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={`${action.command}-${action.value ?? ""}`}
              type="button"
              title={action.label}
              aria-label={action.label}
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand(action.command, action.value)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-950 disabled:pointer-events-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}

        <button
          type="button"
          title="Link"
          aria-label="Link"
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={addLink}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-950 disabled:pointer-events-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="relative">
        {placeholder && isEmpty && !isFocused ? (
          <div className="pointer-events-none absolute left-4 top-3 text-sm text-zinc-400 dark:text-white/40">
            {placeholder}
          </div>
        ) : null}

        <div
          id={id}
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={emitChange}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          className={cn(
            "min-h-[180px] px-4 py-3 text-sm leading-relaxed outline-none",
            "[&_a]:text-purple-700 [&_a]:underline dark:[&_a]:text-purple-300",
            "[&_blockquote]:border-l-4 [&_blockquote]:border-purple-500 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-600 dark:[&_blockquote]:text-white/70",
            "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold",
            "[&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6",
            editorClassName,
          )}
        />
      </div>
    </div>
  );
}
