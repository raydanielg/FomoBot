import Link from "next/link"
import Image from "next/image"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ApiIcon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  BubbleChatIcon,
  CheckmarkCircle02Icon,
  Flowchart01Icon,
  InboxIcon,
  Key01Icon,
  QrCode01Icon,
  Robot01Icon,
  WebhookIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"

import { JsonLd, faqSchema, organizationSchema, softwareSchema, websiteSchema } from "@/lib/seo/schemas"
import { pageSeo } from "@/lib/seo/metadata"

export const metadata = pageSeo({
  title: "Fomobot — WhatsApp Bots, Automation & Messaging API",
  description:
    "Connect your WhatsApp account, expose a developer API, automate conversations and integrate WhatsApp into your applications.",
  path: "/",
  keywords: ["whatsapp bot", "whatsapp automation", "whatsapp api", "whatsapp messaging api"],
})

const homeFaqs = [
  {
    question: "What is FomoBot?",
    answer: "FomoBot is WhatsApp infrastructure for developers and businesses — connect a WhatsApp number once, then automate conversations, send messages through a REST API, receive webhooks and manage everything in a shared team inbox.",
  },
  {
    question: "How do I connect WhatsApp?",
    answer: "Create a bot, open its detail page and click Connect WhatsApp — a QR code appears that you scan with the phone that owns the number, like WhatsApp Web. The session persists on our servers.",
  },
  {
    question: "Does the session stay connected?",
    answer: "Yes — sessions persist server-side and reconnect automatically. If WhatsApp drops, you get a notification and the bot status changes to reconnecting or error.",
  },
  {
    question: "Can I use the API?",
    answer: "Yes — generate scoped API keys (messages:write, contacts:read, etc.) and call documented REST endpoints. An in-app playground and OpenAPI schema are included.",
  },
  {
    question: "Do you support webhooks?",
    answer: "Yes — subscribe to 14 event types (message.received, delivered, read, bot.connected, ...) with signed payloads, retries and a full delivery log.",
  },
  {
    question: "Is FomoBot free?",
    answer: "Yes, free while in beta — unlimited bots, messages and team members. Early users keep a generous free tier when paid plans launch.",
  },
]

const steps = [
  {
    icon: Robot01Icon,
    title: "Create a bot",
    text: "One bot = one WhatsApp connection in your workspace.",
  },
  {
    icon: QrCode01Icon,
    title: "Scan the QR",
    text: "Link WhatsApp like WhatsApp Web — takes under a minute.",
  },
  {
    icon: Key01Icon,
    title: "Generate API keys",
    text: "Scoped credentials for your app, server or scripts.",
  },
  {
    icon: ApiIcon,
    title: "Integrate",
    text: "Call the REST API, receive webhooks, automate replies.",
  },
]

const features = [
  { icon: WhatsappIcon, title: "Persistent sessions", text: "WhatsApp stays connected across restarts and redeploys." },
  { icon: ApiIcon, title: "Developer API", text: "Clean REST API with JWT or scoped API keys." },
  { icon: WebhookIcon, title: "Webhooks", text: "Signed HTTP callbacks for every message and event." },
  { icon: Flowchart01Icon, title: "Automations", text: "IF/WHEN/THEN rules — auto-replies, tags, assignments." },
  { icon: InboxIcon, title: "Team inbox", text: "Shared WhatsApp inbox for agents and humans." },
  { icon: BubbleChatIcon, title: "Contacts", text: "Contacts, tags and conversation history built in." },
]

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={softwareSchema()} />
      <JsonLd data={faqSchema(homeFaqs)} />
      {/* ---- Hero ---- */}
      <section className="px-3 pt-3 md:px-5 md:pt-5">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2rem]">
          {/* background */}
          <Image
            src="/hero-sky.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-sky-950/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-950/40 via-transparent to-sky-950/50" />

          {/* nav */}
          <header className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/fomobot-logo.png" alt="Fomobot" width={26} height={28} />
              <span className="font-semibold tracking-tight text-white">Fomobot</span>
            </Link>
            <nav className="hidden items-center gap-7 text-sm text-white/80 md:flex">
              <a href="#how" className="transition-colors hover:text-white">How it works</a>
              <a href="#features" className="transition-colors hover:text-white">Features</a>
              <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
              <Link href="/dashboard/api/docs" className="transition-colors hover:text-white">
                Docs
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/login" />}
              >
                Sign in
              </Button>
              <Button size="sm" className="bg-white text-sky-950 shadow-lg shadow-sky-950/20 hover:bg-white/90" render={<Link href="/signup" />}>
                Get started
              </Button>
            </div>
          </header>

          {/* copy */}
          <div className="relative z-10 mx-auto max-w-3xl px-6 pb-52 pt-16 text-center md:pb-64 md:pt-24">
            <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-emerald-300" />
              Free while in beta
            </div>
            <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl">
              WhatsApp bots,
              <br />
              <span className="text-white/60">minus the plumbing.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/75 md:text-lg">
              Connect a number with a QR code and get a real API, webhooks and
              automations — in minutes, not weeks.
            </p>
            <div className="mt-9 flex items-center justify-center gap-3">
              <Button
                size="lg"
                className="h-11 rounded-full bg-white px-6 text-sky-950 shadow-xl shadow-sky-950/25 hover:bg-white/90"
                render={<Link href="/signup" />}
              >
                Get started free
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-full border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/dashboard/api/docs" />}
              >
                Read the docs
              </Button>
            </div>
          </div>

          {/* floating product cards */}
          <div className="pointer-events-none relative z-10 mx-auto hidden max-w-5xl items-end justify-center gap-6 px-6 pb-14 lg:flex">
            {/* bot status card */}
            <div className="w-56 -translate-y-4 -rotate-3 rounded-2xl bg-white/95 p-4 text-slate-900 shadow-2xl shadow-sky-950/40">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100">
                  <HugeiconsIcon icon={Robot01Icon} strokeWidth={1.8} className="size-4.5 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">Support Bot</p>
                  <p className="font-mono text-[10px] text-slate-500">+255 712 ••• 678</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1.5 text-[11px] font-medium text-emerald-700">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-3.5" />
                Connected · 42d uptime
              </div>
            </div>

            {/* messages chart card */}
            <div className="w-60 translate-y-2 rounded-2xl bg-white/95 p-4 text-slate-900 shadow-2xl shadow-sky-950/40">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-slate-500">Messages today</p>
                <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2.5} className="size-2.5" />
                  +18%
                </span>
              </div>
              <p className="mt-1 text-2xl font-semibold tracking-tight">1,284</p>
              <div className="mt-3 flex h-14 items-end gap-1.5">
                {[35, 50, 42, 68, 55, 80, 62, 95, 72, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-sky-200"
                    style={{ height: `${h}%` }}
                  >
                    {i === 8 && <div className="h-full rounded-sm bg-sky-500" />}
                  </div>
                ))}
              </div>
            </div>

            {/* API request card */}
            <div className="w-60 -translate-y-3 rotate-2 rounded-2xl bg-slate-950/90 p-4 font-mono text-[11px] leading-relaxed text-slate-200 shadow-2xl shadow-sky-950/40 backdrop-blur">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-rose-400" />
                <span className="size-2 rounded-full bg-amber-400" />
                <span className="size-2 rounded-full bg-emerald-400" />
                <span className="ms-1 text-[10px] text-slate-500">requests.log</span>
              </div>
              <p><span className="text-sky-300">POST</span> /messages/send</p>
              <p className="text-slate-400"><span className="text-emerald-400">200</span> · 84ms · req_9f3a…</p>
              <p className="mt-2"><span className="text-sky-300">POST</span> /webhooks/delivery</p>
              <p className="text-slate-400"><span className="text-emerald-400">200</span> · 41ms · req_c81b…</p>
            </div>

            {/* notification card */}
            <div className="w-52 translate-y-1 -rotate-1 rounded-2xl bg-white/95 p-4 text-slate-900 shadow-2xl shadow-sky-950/40">
              <div className="flex items-start gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <HugeiconsIcon icon={WhatsappIcon} strokeWidth={1.8} className="size-4 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold">New message</p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">
                    Mwanahamisi: “Do you deliver on weekends?”
                  </p>
                </div>
              </div>
              <p className="mt-2.5 rounded-lg bg-slate-50 px-2 py-1.5 text-[10px] text-slate-500">
                Automation <span className="font-semibold text-slate-700">#delivery-hours</span> replied in 1.2s
              </p>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section id="how" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-xl font-semibold tracking-tight">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <HugeiconsIcon icon={s.icon} strokeWidth={1.5} className="size-5 text-primary-foreground" />
                </div>
                <p className="mt-4 text-sm font-medium">
                  <span className="me-2 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="border-t border-border bg-muted/20">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-center text-xl font-semibold tracking-tight">
              Everything you need for WhatsApp
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <HugeiconsIcon icon={f.icon} strokeWidth={1.5} className="size-4.5 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-sm font-medium">{f.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                A REST API your team will enjoy
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Integrate WhatsApp into your application in minutes. Clean
                envelopes, request IDs, scoped keys and signed webhooks.
              </p>
              <Button variant="outline" size="sm" className="mt-5" render={<Link href="/signup" />}>
                Read the docs
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </Button>
            </div>
            <pre className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-5 font-mono text-xs leading-relaxed">
{`curl -X POST $API/api/v1/messages/send/ \\
  -H "X-API-Key: fmb_live_…" \\
  -H "Content-Type: application/json" \\
  -d '{
    "bot_id": "bot_…",
    "to": "2557XXXXXXXX",
    "type": "text",
    "text": "Hello from FomoBot"
  }'`}
            </pre>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-center text-xl font-semibold tracking-tight">
              Explore FomoBot
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["WhatsApp bot builder", "/whatsapp-bot", "Create persistent WhatsApp sessions"],
                ["Automation platform", "/whatsapp-automation", "Rules that reply for you"],
                ["Developer API", "/whatsapp-api-for-developers", "REST + webhooks + docs"],
                ["OTP verification", "/whatsapp-otp", "Hashed, rate-limited codes"],
                ["Customer support", "/whatsapp-customer-support", "Bot + human inbox"],
                ["Notifications", "/whatsapp-notifications", "Transactional messages"],
                ["Ecommerce", "/solutions/ecommerce", "Orders and delivery updates"],
                ["Webhooks", "/whatsapp-webhooks", "Signed events, retries, logs"],
              ].map(([title, href, text]) => (
                <Link
                  key={href}
                  href={href!}
                  className="group rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
                >
                  <p className="text-sm font-medium group-hover:underline">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="text-center text-xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
            <dl className="mt-10 flex flex-col gap-8">
              {homeFaqs.map((f) => (
                <div key={f.question}>
                  <dt className="text-sm font-medium">{f.question}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {f.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="pricing" className="px-3 pb-5 pt-8 md:px-5">
          <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2rem]">
            <Image
              src="/hero-sky.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_55%]"
            />
            <div className="absolute inset-0 bg-sky-950/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-sky-950/50 via-transparent to-sky-950/50" />

            <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center md:py-32">
              <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-emerald-300" />
                Free while in beta
              </p>
              <h2 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Every bot is free.
                <br />
                <span className="text-white/60">For now.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-pretty text-sm leading-relaxed text-white/75 md:text-base">
                Unlimited bots, messages and team members while we&apos;re in beta.
                Early users keep a generous free tier forever.
              </p>
              <div className="mt-9 flex items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="h-11 rounded-full bg-white px-6 text-sky-950 shadow-xl shadow-sky-950/25 hover:bg-white/90"
                  render={<Link href="/signup" />}
                >
                  Create your workspace
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-full border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
                  render={<Link href="/login" />}
                >
                  Sign in
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-3 pb-3 md:px-5 md:pb-5">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] bg-sky-950 text-white">
          {/* soft sky gradient echo */}
          <div className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-sky-400/15 to-transparent" />

          <div className="relative z-10 mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
              <div>
                <Link href="/" className="flex items-center gap-2.5">
                  <Image src="/fomobot-logo.png" alt="Fomobot" width={28} height={30} />
                  <span className="font-semibold tracking-tight">Fomobot</span>
                </Link>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
                  WhatsApp infrastructure for developers and businesses. Connect
                  a number, get an API, ship conversations.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                  <span className="size-1.5 rounded-full bg-emerald-300" />
                  All systems operational
                </div>
              </div>

              {[
                {
                  title: "Product",
                  links: [
                    ["WhatsApp bot", "/whatsapp-bot"],
                    ["Automation", "/whatsapp-automation"],
                    ["Pricing", "#pricing"],
                    ["Customer support", "/whatsapp-customer-support"],
                  ],
                },
                {
                  title: "Developers",
                  links: [
                    ["API docs", "/docs"],
                    ["API overview", "/whatsapp-api"],
                    ["Webhooks", "/whatsapp-webhooks"],
                    ["OTP", "/whatsapp-otp"],
                  ],
                },
                {
                  title: "Company",
                  links: [
                    ["About", "/about"],
                    ["Contact", "/contact"],
                    ["Security", "/security"],
                    ["Privacy", "/privacy"],
                    ["Terms", "/terms"],
                    ["Blog", "/blog"],
                  ],
                },
              ].map((col) => (
                <div key={col.title}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    {col.title}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                    {col.links.map(([label, href]) => (
                      <li key={label}>
                        <Link
                          href={href!}
                          className="text-white/60 transition-colors hover:text-white"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50">
              <span>© {new Date().getFullYear()} Fomobot — built for teams that ship.</span>
              <div className="flex gap-6">
                <Link href="/login" className="hover:text-white">Sign in</Link>
                <Link href="/signup" className="hover:text-white">Get started</Link>
                <a href="#top" className="hover:text-white">Back to top</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
