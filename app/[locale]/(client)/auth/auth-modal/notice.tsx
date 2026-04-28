"use client"

function toText(v: unknown): string | null {
  if (v == null) return null
  if (typeof v === "string") return v
  if (typeof v === "number" || typeof v === "boolean") return String(v)

  // object dạng API error
  if (typeof v === "object") {
    const anyV = v as any
    if (typeof anyV?.message === "string") return anyV.message
    if (typeof anyV?.error === "string") return anyV.error
    if (typeof anyV?.detail === "string") return anyV.detail

    try {
      return JSON.stringify(v)
    } catch {
      return "Đã xảy ra lỗi."
    }
  }

  return "Đã xảy ra lỗi."
}

export default function Notice({
  errorMsg,
  infoMsg,
}: {
  errorMsg?: unknown
  infoMsg?: unknown
}) {
  const errText = toText(errorMsg)
  const infoText = toText(infoMsg)

  return (
    <div className="space-y-2">
      {errText && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errText}
        </div>
      )}
      {infoText && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {infoText}
        </div>
      )}
    </div>
  )
}
