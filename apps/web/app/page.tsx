import Link from "next/link"
import Image from "next/image"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ApiIcon,
  ArrowRight01Icon,
  BubbleChatIcon,
  Flowchart01Icon,
  InboxIcon,
  Key01Icon,
  QrCode01Icon,
  Robot01Icon,
  WebhookIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"

export const metadata = {
  title: "Fomobot — WhatsApp infrastructure for developers",
  description:
    "Connect your WhatsApp account, expose a developer API, automate conversations and integrate WhatsApp into your applications.",
}

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
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <Image src="/fomobot-logo.png" alt="Fomobot" width={26} height={28} />
          <span className="font-semibold tracking-tight">Fomobot</span>
        </div>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button size="sm" render={<Link href="/signup" />}>
            Get started
          </Button>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-3xl px-6 pb-16 pt-16 text-center md:pt-24">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Free while in beta
          </div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Connect WhatsApp.
            <br />
            Build on top of it.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            Connect your WhatsApp account, expose a developer API, automate
            conversations and integrate WhatsApp into your applications.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/signup" />}>
              Get started
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/login" />}>
              View dashboard
            </Button>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
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
          </div>
        </section>

        <section className="border-t border-border bg-muted/20">
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
          <div className="mx-auto max-w-3xl px-6 py-16 text-center">
            <h2 className="text-xl font-semibold tracking-tight">Free, for now</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              FomoBot is free while in beta — unlimited bots, messages and team
              members. Paid plans will come later; early users keep a generous
              free tier.
            </p>
            <Button className="mt-6" render={<Link href="/signup" />}>
              Create your workspace
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Image src="/fomobot-logo.png" alt="Fomobot" width={20} height={22} />
            <span>© {new Date().getFullYear()} Fomobot</span>
          </div>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-foreground">Sign in</Link>
            <Link href="/signup" className="hover:text-foreground">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
