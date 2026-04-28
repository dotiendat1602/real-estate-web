"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  Loader2,
  Share2,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NewsStatus } from "@/types/interfaces/api/news"
import { useNewsArticleDetail, useNewsArticles, useToggleSaveArticle } from "@/hooks/news/useNewsArticles"
import { useNewsTopics } from "@/hooks/news/useNewsTopics"

function formatDate(d?: string) {
  if (!d) return "—"
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

function estimateReadMin(articleReadMin?: number, content?: string) {
  if (articleReadMin && articleReadMin > 0) return articleReadMin
  if (!content) return 3
  const words = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length
  const mins = Math.max(2, Math.round(words / 220))
  return mins
}

function extractHeadings(content?: string) {
  if (!content) return []
  const headings: Array<{ id: string; text: string }> = []

  // Markdown headings: ## Heading
  const md = content.split("\n").filter((l) => l.trim().startsWith("## "))
  for (const line of md) {
    const text = line.replace(/^##\s+/, "").trim()
    if (!text) continue
    const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
    headings.push({ id, text })
  }

  // HTML headings: <h2>Heading</h2>
  const h2 = Array.from(content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi), (m) =>
    (m[1] ?? "").replace(/<[^>]*>/g, "").trim(),
  );

  for (const text of h2) {
    if (!text) continue
    const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
    if (!headings.some((h) => h.id === id)) headings.push({ id, text })
  }

  return headings.slice(0, 8)
}

function ContentRenderer({ content }: { content?: string }) {
  const looksLikeHtml = !!content && /<\/?[a-z][\s\S]*>/i.test(content)

  if (!content) {
    return (
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-8 text-center text-white/60">
        No content available for this article.
      </div>
    )
  }

  if (looksLikeHtml) {
    return (
      <div
        className="prose prose-invert max-w-none prose-p:text-white/80 prose-headings:text-white prose-a:text-purple-300 prose-strong:text-white
                   prose-li:text-white/80 prose-blockquote:text-white/70 prose-hr:border-[#262626]"
        // If you store HTML, consider sanitizing it server-side before saving.
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // Plain text / Markdown-ish fallback
  const paragraphs = content
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <div className="space-y-4">
      {paragraphs.map((p, idx) => {
        const isH2 = p.startsWith("## ")
        if (isH2) {
          const text = p.replace(/^##\s+/, "")
          const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
          return (
            <h2 key={idx} id={id} className="text-xl md:text-2xl font-bold text-white pt-2">
              {text}
            </h2>
          )
        }
        return (
          <p key={idx} className="text-white/80 leading-relaxed">
            {p}
          </p>
        )
      })}
    </div>
  )
}

export default function NewsDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = useMemo(() => {
    const raw = (params?.id ?? "").toString()
    const n = Number(raw)
    return Number.isFinite(n) ? n : 0
  }, [params])

  const { data: article, isLoading, isError } = useNewsArticleDetail(id)
  const { data: topics } = useNewsTopics()

  const relatedQuery = useMemo(() => {
    if (!article?.topicId) return null
    return {
      pageIndex: 1,
      pageSize: 6,
      topicId: article.topicId,
      status: NewsStatus.PUBLISHED,
      sortKey: "publishedAt",
      sortOrder: "desc" as const,
    }
  }, [article?.topicId])

  // IMPORTANT: only call related hook when we have a query (enabled pattern)
  const related = useNewsArticles(relatedQuery ?? {})
  const relatedItems = useMemo(() => {
    const list = related.data?.data ?? []
    return list.filter((x) => x.id !== article?.id).slice(0, 6)
  }, [related.data?.data, article?.id])

  const toggleSave = useToggleSaveArticle()
  const [sharing, setSharing] = useState(false)

  const headingItems = useMemo(() => extractHeadings(article?.content), [article?.content])
  const readMin = useMemo(() => estimateReadMin(article?.readMin, article?.content), [article?.readMin, article?.content])

  const topicName = article?.topic?.name
  const cover = article?.coverImageUrl

  const onCopyLink = async () => {
    try {
      setSharing(true)
      const url = typeof window !== "undefined" ? window.location.href : ""
      await navigator.clipboard.writeText(url)
    } finally {
      setTimeout(() => setSharing(false), 600)
    }
  }

  const onShareNative = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : ""
      if (navigator.share) {
        await navigator.share({
          title: article?.title ?? "Estatein News",
          text: article?.excerpt ?? "",
          url,
        })
      } else {
        await onCopyLink()
      }
    } catch {
      // ignore
    }
  }

  if (!id) {
    return (
      <div className="bg-[#0a0a0a] text-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-10 text-center">
            <div className="text-white font-semibold">Invalid article ID</div>
            <p className="text-white/60 mt-2">Please go back and select a valid article.</p>
            <Button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white" onClick={() => router.push("/news")}>
              Back to News
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] text-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10 space-y-6">
        {/* A) Breadcrumb + Top actions */}
        <section className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/60 flex-wrap">
                <Link href="/home" className="hover:text-white">
                  Home
                </Link>
                <span className="text-white/30">/</span>
                <Link href="/news" className="hover:text-white">
                  News
                </Link>
                {topicName && (
                  <>
                    <span className="text-white/30">/</span>
                    <span className="text-white/70">{topicName}</span>
                  </>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-8 w-[70%] bg-white/5 border border-[#262626] rounded-xl animate-pulse" />
                  <div className="h-4 w-[55%] bg-white/5 border border-[#262626] rounded-xl animate-pulse" />
                </div>
              ) : isError ? (
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold">Failed to load article</h1>
                  <p className="text-white/60">Please try again later.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-white text-balance">{article?.title}</h1>
                  {article?.excerpt && <p className="text-white/60 max-w-4xl">{article.excerpt}</p>}
                </div>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#262626] text-sm text-white/70">
                  <Calendar className="w-4 h-4 text-white/50" />
                  {formatDate(article?.publishedAt ?? article?.createdAt)}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#262626] text-sm text-white/70">
                  <Clock3 className="w-4 h-4 text-white/50" />
                  {readMin} min read
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#262626] text-sm text-white/70">
                  <Tag className="w-4 h-4 text-white/50" />
                  {topicName ?? "Uncategorized"}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#262626] text-sm text-white/70">
                  <Eye className="w-4 h-4 text-white/50" />
                  {article?._count?.savedBy ?? 0} saved
                </span>
              </div>
            </div>

            {/* Top actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button
                variant="outline"
                className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                onClick={onCopyLink}
                disabled={sharing}
              >
                {sharing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Copy className="w-4 h-4 mr-2" />}
                Copy link
              </Button>

              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={onShareNative}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </section>

        {/* B) Main grid */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Left: Article */}
          <div className="space-y-6">
            {/* Cover */}
            <section className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden">
              <div className="relative">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt={article?.title ?? "Article cover"} className="w-full aspect-[16/7] object-cover" />
                ) : (
                  <div className="w-full aspect-[16/7] bg-gradient-to-br from-purple-900/35 to-purple-600/10 flex items-center justify-center border-b border-[#262626]">
                    <span className="text-white/40 text-sm">Cover image</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 md:p-8">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-4 w-[92%] bg-white/5 border border-[#262626] rounded-lg animate-pulse" />
                    <div className="h-4 w-[88%] bg-white/5 border border-[#262626] rounded-lg animate-pulse" />
                    <div className="h-4 w-[84%] bg-white/5 border border-[#262626] rounded-lg animate-pulse" />
                    <div className="h-4 w-[80%] bg-white/5 border border-[#262626] rounded-lg animate-pulse" />
                    <div className="h-4 w-[65%] bg-white/5 border border-[#262626] rounded-lg animate-pulse" />
                  </div>
                ) : (
                  <ContentRenderer content={article?.content} />
                )}
              </div>
            </section>

            {/* Related */}
            <section className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Related articles</h2>
                  <p className="text-white/60 mt-1">More reads from the same topic.</p>
                </div>
                <Button variant="outline" className="border-[#262626] text-white hover:bg-white/5 bg-transparent" asChild>
                  <Link href="/news">
                    View all
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {(related.isFetching && relatedItems.length === 0 ? Array.from({ length: 4 }) : relatedItems).map(
                  (it: any, idx: number) => {
                    if (!it?.id) {
                      return (
                        <div key={idx} className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-5">
                          <div className="h-4 w-[60%] bg-white/5 border border-[#262626] rounded-lg animate-pulse" />
                          <div className="mt-3 h-3 w-[90%] bg-white/5 border border-[#262626] rounded-lg animate-pulse" />
                          <div className="mt-2 h-3 w-[70%] bg-white/5 border border-[#262626] rounded-lg animate-pulse" />
                        </div>
                      )
                    }

                    return (
                      <Link
                        key={it.id}
                        href={`/news/${it.id}`}
                        className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-5 hover:border-purple-600/30 transition-colors block"
                      >
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <span className="px-2.5 py-1 bg-[#141414] border border-[#262626] rounded-full">
                            {it.topic?.name ?? "News"}
                          </span>
                          <span>•</span>
                          <span>{formatDate(it.publishedAt ?? it.createdAt)}</span>
                          <span>•</span>
                          <span>{estimateReadMin(it.readMin, it.content)} min</span>
                        </div>

                        <div className="mt-3 text-white font-semibold leading-snug line-clamp-2">{it.title}</div>
                        {it.excerpt && <p className="mt-2 text-white/60 text-sm line-clamp-2">{it.excerpt}</p>}

                        <div className="mt-4 text-purple-400 text-sm inline-flex items-center gap-1">
                          Read <ArrowRight className="w-4 h-4" />
                        </div>
                      </Link>
                    )
                  },
                )}

                {!related.isFetching && relatedItems.length === 0 && (
                  <div className="sm:col-span-2 bg-[#0a0a0a] border border-[#262626] rounded-xl p-6 text-center">
                    <div className="text-white/70 font-medium">No related articles found</div>
                    <div className="text-white/50 text-sm mt-1">Try browsing other topics on the News page.</div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right: Sticky sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6">
            {/* Quick actions */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Quick actions</h3>

              <div className="grid gap-3">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    if (!article?.id) return
                    toggleSave.mutate(article.id)
                  }}
                  disabled={!article?.id || toggleSave.isPending}
                >
                  {toggleSave.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                  )}
                  Save article
                </Button>

                <Button
                  variant="outline"
                  className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                  onClick={onCopyLink}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy link
                </Button>
              </div>

              <div className="mt-5 text-white/50 text-xs">
                Tip: Use <span className="text-white/70">Save</span> to revisit later from your Saved list.
              </div>
            </div>

            {/* On this page */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">On this page</h3>

              {headingItems.length > 0 ? (
                <div className="space-y-2">
                  {headingItems.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className="block text-white/70 hover:text-white text-sm px-3 py-2 rounded-lg border border-transparent hover:border-purple-600/30 hover:bg-white/5 transition-colors"
                    >
                      {h.text}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-white/60 text-sm">No sections detected.</div>
              )}
            </div>

            {/* Topics quick jump */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Topics</h3>

              <div className="flex flex-wrap gap-2">
                {(topics ?? []).slice(0, 10).map((t) => (
                  <Link
                    key={t.id}
                    href={`/news?topicId=${t.id}`}
                    className="px-3 py-2 bg-[#0a0a0a] border border-[#262626] rounded-lg text-sm text-white/80
                               hover:border-purple-600/50 hover:text-white transition-colors"
                  >
                    {t.name}
                  </Link>
                ))}
                {(!topics || topics.length === 0) && <div className="text-white/60 text-sm">No topics yet.</div>}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-2">Newsletter</h3>
              <p className="text-white/60 text-sm mb-4">Get weekly updates straight to your inbox.</p>

              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-[#0a0a0a] border-[#262626] text-white h-11 rounded-lg"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 text-white h-11 px-4">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </aside>
        </section>

        {/* Bottom pagination (prev/next placeholders) */}
        <section className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-white/60 text-sm inline-flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Previous / Next navigation can be wired from API later (by publish date).
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="border-[#262626] text-white hover:bg-white/5 bg-transparent" disabled>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button variant="outline" className="border-[#262626] text-white hover:bg-white/5 bg-transparent" disabled>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
