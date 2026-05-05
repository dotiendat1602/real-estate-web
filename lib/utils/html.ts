export function looksLikeHtml(content?: string | null) {
  return !!content && /<\/?[a-z][\s\S]*>/i.test(content);
}

export function sanitizeHtml(content: string) {
  return content
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<(iframe|object|embed|link|meta|style)[\s\S]*?>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(iframe|object|embed|link|meta|style)[\s\S]*?\/?>/gi, "")
    .replace(/\son\w+=(["']).*?\1/gi, "")
    .replace(/\sstyle=(["']).*?\1/gi, "")
    .replace(/\s(href|src)=(["'])\s*javascript:[\s\S]*?\2/gi, "");
}

export function htmlToPlainText(content?: string | null) {
  if (!content) return "";
  return content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
