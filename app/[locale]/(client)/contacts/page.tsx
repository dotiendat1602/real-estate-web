"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquareText,
  HelpCircle,
  Building2,
  Star,
  BadgeCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCreateContact } from "@/hooks/contacts/useContacts";
import { useFeaturedAgents } from "@/hooks/users/useAgent";
import { withLocalePath } from "@/lib/utils/i18n";

type Topic = "Support" | "Partnership";

// UI -> API: map your page topics to backend strings
const topicToApi = (t: Topic) => (t === "Support" ? "Support" : "Partnership");

function initialsOf(name?: string | null) {
  if (!name) return "AG";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((x) => x[0]?.toUpperCase())
    .join("");
}

// Map coordinates
const OFFICE_LAT = 20.958721;
const OFFICE_LNG = 105.770565;

export default function ContactsPage() {
  const locale = useLocale();
  const [agentKeyword, setAgentKeyword] = useState("");
  const [agentAppliedSearch, setAgentAppliedSearch] = useState("");

  const agentsQ = useFeaturedAgents({
    pageIndex: 1,
    pageSize: 9,
    search: agentAppliedSearch || undefined,
  });

  const agents = agentsQ.data?.data ?? [];

  const [topic, setTopic] = useState<Topic>("Support");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const createContactM = useCreateContact();

  const canSubmit = useMemo(() => {
    if (!fullName.trim()) return false;
    if (!email.trim()) return false;
    if (!subject.trim()) return false;
    if (!message.trim()) return false;
    return true;
  }, [fullName, email, subject, message]);

  const submit = () => {
    if (!canSubmit || createContactM.isPending) return;

    createContactM.mutate(
      {
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() ? phone.trim() : undefined,
        topic: topicToApi(topic),
        subject: subject.trim(),
        message: message.trim(),
      },
      {
        onSuccess: () => {
          // reset form
          setFullName("");
          setEmail("");
          setPhone("");
          setSubject("");
          setMessage("");
        },
      }
    );
  };

  // Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${OFFICE_LAT},${OFFICE_LNG}`;
  const embedMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.473663107358!2d${OFFICE_LNG}!3d${OFFICE_LAT}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDU3JzMxLjQiTiAxMDXCsDQ2JzE0LjAiRQ!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s`;

  return (
    <div className="bg-[#0a0a0a] text-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-14 py-10 space-y-6">
        {/* A) Page Header */}
        <section className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
          <div className="mt-3 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-white text-balance">
                Contact Estatein
              </h1>
              <p className="text-white/60 max-w-3xl">
                {"Need account help or want to partner with us? Send a message to the Estatein team — we'll get back to you soon."}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-600/10 border border-purple-500/25 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-600/30 flex items-center justify-center">
                  <MessageSquareText className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Need quick help?</h3>
                  <p className="text-white/60 text-sm mt-1">
                    Use the chat widget in the bottom-right (when logged in) for
                    faster support.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4">
                  <div className="text-white/60 text-xs">Avg response</div>
                  <div className="text-white font-semibold mt-1">~ 2 hours</div>
                </div>
                <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4">
                  <div className="text-white/60 text-xs">Working days</div>
                  <div className="text-white font-semibold mt-1">Mon–Sat</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* B) Main grid */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          {/* Left: Agents + Form */}
          <div className="space-y-4">
            {/* Agents list - API */}
            <section className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Featured Agents
                  </h2>
                  <p className="text-white/60 mt-1">
                    Browse agents by area/specialty and contact them directly if
                    you need guidance.
                  </p>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                >
                  <Link href={withLocalePath("/agents", locale)}>
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Input
                  value={agentKeyword}
                  onChange={(e) => setAgentKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      setAgentAppliedSearch(agentKeyword.trim());
                  }}
                  placeholder="Search agents by name, area, or tags..."
                  className="bg-[#0a0a0a] border-[#262626] text-white h-12 rounded-lg"
                />
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 rounded-lg"
                  onClick={() => setAgentAppliedSearch(agentKeyword.trim())}
                >
                  Search
                </Button>
              </div>

              {agentsQ.isLoading ? (
                <div className="mt-6 flex items-center gap-2 text-white/60">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading agents...
                </div>
              ) : agentsQ.isError ? (
                <div className="mt-6 bg-[#0a0a0a] border border-[#262626] rounded-xl p-6 text-white/70">
                  Failed to load agents.
                </div>
              ) : (
                <>
                  <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {agents.map((a) => {
                      const profile = a.agentProfile;

                      const name = a.name ?? "Unnamed Agent";
                      const title = profile?.title ?? "Agent";
                      const rating = profile?.rating ?? null;
                      const deals = profile?.deals ?? null;
                      const areas = profile?.areas ?? [];
                      const tags = profile?.tags ?? [];

                      return (
                        <div
                          key={a.id}
                          className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-5 hover:border-purple-600/30 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-600/25 flex items-center justify-center font-semibold text-white">
                              {initialsOf(name)}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="text-white font-semibold">
                                  {name}
                                </div>
                                <BadgeCheck className="w-4 h-4 text-purple-300" />
                              </div>
                              <div className="text-white/60 text-sm">
                                {title}
                              </div>

                              <div className="mt-2 flex items-center gap-3 text-sm text-white/70">
                                <div className="inline-flex items-center gap-1">
                                  <Star className="w-4 h-4 text-purple-300" />
                                  <span className="text-white">
                                    {rating !== null
                                      ? rating.toFixed(1)
                                      : "—"}
                                  </span>
                                </div>
                                <span className="text-white/30">•</span>
                                <span>{deals !== null ? `${deals} deals` : "—"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 space-y-3">
                            <div className="flex items-start gap-2 text-sm text-white/70">
                              <MapPin className="w-4 h-4 mt-0.5 text-white/60" />
                              <div className="flex flex-wrap gap-2">
                                {areas.length ? (
                                  areas.map((x) => (
                                    <span
                                      key={x}
                                      className="px-2.5 py-1 rounded-full bg-[#141414] border border-[#262626] text-white/70"
                                    >
                                      {x}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-white/50">
                                    No areas
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {(tags ?? []).slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="px-2.5 py-1 rounded-full bg-[#141414] border border-[#262626] text-xs text-white/70"
                                >
                                  {t}
                                </span>
                              ))}
                              {!tags?.length && (
                                <span className="text-white/50 text-xs">
                                  No tags
                                </span>
                              )}
                            </div>

                            <div className="pt-2 flex gap-2">
                              <Button
                                asChild
                                variant="outline"
                                className="flex-1 border-[#262626] text-white hover:bg-white/5 bg-transparent"
                              >
                                <Link href={withLocalePath(`/agents/${a.id}`, locale)}>
                                  View Profile
                                </Link>
                              </Button>

                              <Button
                                asChild
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                <a
                                  href={
                                    a.phone
                                      ? `tel:${a.phone.replace(/\s+/g, "")}`
                                      : undefined
                                  }
                                  onClick={(e) => {
                                    if (!a.phone) e.preventDefault();
                                  }}
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  Contact
                                </a>
                              </Button>
                            </div>

                            {(a.phone || a.email) && (
                              <div className="text-white/50 text-xs">
                                {a.phone ? (
                                  <>
                                    Hotline:{" "}
                                    <span className="text-white/70">
                                      {a.phone}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    Email:{" "}
                                    <span className="text-white/70">
                                      {a.email}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {agents.length === 0 && (
                    <div className="mt-6 bg-[#0a0a0a] border border-[#262626] rounded-xl p-6 text-center">
                      <div className="text-white/70 font-medium">
                        No matching agents found
                      </div>
                      <div className="text-white/50 text-sm mt-1">
                        Try another keyword or clear the search.
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Contact Form - API create */}
            <section className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Send us a message
                  </h2>
                  <p className="text-white/60 mt-1">
                    {"Select a topic and we'll route your message to the right team."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { k: "Support", label: "Support" },
                      { k: "Partnership", label: "Partnership" },
                    ].map((t) => {
                      const active = topic === (t.k as Topic);
                      return (
                        <button
                          key={t.k}
                          onClick={() => setTopic(t.k as Topic)}
                          className={
                            "px-4 py-2 rounded-full text-sm border transition-colors " +
                            (active
                              ? "bg-purple-600/15 border-purple-600/50 text-white"
                              : "bg-[#0a0a0a] border-[#262626] text-white/80 hover:border-purple-600/40 hover:text-white")
                          }
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  View FAQs
                </Button>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm">Full name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="mt-2 bg-[#0a0a0a] border-[#262626] text-white h-12 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm">Email</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@email.com"
                    className="mt-2 bg-[#0a0a0a] border-[#262626] text-white h-12 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm">
                    Phone (optional)
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    className="mt-2 bg-[#0a0a0a] border-[#262626] text-white h-12 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm">Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value as Topic)}
                    className="mt-2 w-full bg-[#0a0a0a] border border-[#262626] text-white rounded-lg px-4 h-12 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Support">Support</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-white/70 text-sm">Subject</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={
                      topic === "Support"
                        ? "Tell us what you need help with"
                        : "Partnership request summary"
                    }
                    className="mt-2 bg-[#0a0a0a] border-[#262626] text-white h-12 rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-white/70 text-sm">Message</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      topic === "Support"
                        ? "Describe your issue and include any relevant details..."
                        : "Tell us about your partnership proposal, your role, and your goals..."
                    }
                    className="mt-2 bg-[#0a0a0a] border-[#262626] text-white rounded-lg min-h-[160px] focus-visible:ring-purple-600"
                  />
                </div>
              </div>

              {createContactM.isError && (
                <div className="mt-4 bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 text-white/70">
                  Failed to send message. Please try again.
                </div>
              )}

              {createContactM.isSuccess && (
                <div className="mt-4 bg-purple-600/10 border border-purple-600/25 rounded-xl p-4 text-white/80">
                  {"Message sent successfully. We'll get back to you soon."}
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <p className="text-white/50 text-sm">
                  By sending this message, you agree to our Terms & Privacy
                  Policy.
                </p>

                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 rounded-lg disabled:opacity-60"
                  disabled={!canSubmit || createContactM.isPending}
                  onClick={submit}
                >
                  {createContactM.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </section>
          </div>

          {/* Right: Contact Info + Map (Real Google Maps) */}
          <div className="space-y-6">
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-4">
                Contact details
              </h3>

              <div className="space-y-3">
                <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#262626] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <div className="text-white/60 text-sm">
                      support@estatein.com
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#262626] flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Phone</div>
                    <div className="text-white/60 text-sm">
                      (+84) 35 620 263
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#262626] flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white/80" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Office</div>
                    <div className="text-white/60 text-sm">Hanoi, Vietnam</div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#262626] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Hours</div>
                    <div className="text-white/60 text-sm">
                      Mon–Sat • 9:00–18:00
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden">
              <div className="p-6 md:p-8 border-b border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-white/70" />
                  <h3 className="text-lg font-bold text-white">Our location</h3>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#262626] text-white hover:bg-white/5 bg-transparent"
                >
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Map
                  </a>
                </Button>
              </div>

              <div className="aspect-[16/10] relative">
                <iframe
                  src={embedMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                  title="Office Location Map"
                />
              </div>
            </div>
          </div>
        </section>

        {/* C) FAQs (UI only) */}
        <section className="bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Contact FAQs
              </h2>
              <p className="text-white/60 mt-1">
                Quick answers for contacting support or partnership inquiries.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-purple-600 text-purple-400 hover:bg-purple-600/10 bg-transparent"
            >
              View All
            </Button>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            {[
              {
                q: "How long does it take to get a response?",
                a: "Usually within 1–2 hours during working hours. It may take longer outside business hours.",
              },
              {
                q: "Can I request a partnership?",
                a: "Yes. Select the Partnership topic and describe your proposal in detail.",
              },
              {
                q: "What should I include for Support?",
                a: "Please provide your account email and a clear description of the issue (screenshots help).",
              },
              {
                q: "Can I contact an agent directly?",
                a: "Yes. Use the Featured Agents section above to find and contact the right person.",
              },
            ].map((it) => (
              <div
                key={it.q}
                className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-5"
              >
                <div className="text-white font-semibold mb-1">{it.q}</div>
                <div className="text-white/60 text-sm">{it.a}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
