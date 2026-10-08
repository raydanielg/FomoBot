"use client"

import * as React from "react"
import Link from "next/link"

import { DashboardShell } from "@/components/dashboard-shell"
import { CopyButton } from "@/components/copy-button"
import { PageHeader } from "@/components/page-header"
import { cn } from "@workspace/ui/lib/utils"

const BASE = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

const SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "auth", label: "Authentication" },
  { id: "bots", label: "Bots" },
  { id: "messages", label: "Messages" },
  { id: "contacts", label: "Contacts" },
  { id: "conversations", label: "Conversations" },
  { id: "webhooks", label: "Webhooks" },
  { id: "errors", label: "Errors" },
]

function Code({ children, lang = "bash" }: { children: string; lang?: string }) {
  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded-lg bg-muted/60 p-4 font-mono text-xs leading-relaxed">
        <code data-lang={lang}>{children}</code>
      </pre>
      <div className="absolute end-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton value={children} size="icon-sm" variant="ghost" />
      </div>
    </div>
  )
}

function Endpoint({ method, path }: { method: string; path: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 font-mono text-xs">
      <span
        className={cn(
          "font-semibold",
          method === "GET"
            ? "text-sky-500"
            : method === "DELETE"
              ? "text-destructive"
              : "text-primary-foreground"
        )}
      >
        {method}
      </span>
      <span className="truncate text-muted-foreground">/api/v1{path}</span>
    </div>
  )
}

export default function ApiDocsPage() {
  const [active, setActive] = React.useState("intro")
  const base = BASE()

  return (
    <DashboardShell crumb="API Docs">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="API documentation"
          description="REST API reference for FomoBot. Full OpenAPI spec is at /api/docs on the server."
        />
        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          <nav className="hidden lg:block">
            <ul className="sticky top-4 space-y-0.5 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setActive(s.id)}
                    className={cn(
                      "block rounded-md px-2.5 py-1.5 transition-colors",
                      active === s.id
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-3xl space-y-10 pb-10">
            <section id="intro" className="space-y-3">
              <h2 className="text-base font-semibold">Introduction</h2>
              <p className="text-sm text-muted-foreground">
                The FomoBot API lets you send and receive WhatsApp messages,
                manage bots, and subscribe to events. Base URL:
              </p>
              <Code>{`${base}/api/v1`}</Code>
              <p className="text-sm text-muted-foreground">
                Every response is wrapped in an envelope:{" "}
                <code className="rounded bg-muted px-1 text-xs">{"{ success, data, request_id }"}</code>.
              </p>
            </section>

            <section id="auth" className="space-y-3">
              <h2 className="text-base font-semibold">Authentication</h2>
              <p className="text-sm text-muted-foreground">
                Use an API key (from{" "}
                <Link href="/dashboard/api/keys" className="underline underline-offset-4">
                  API Keys
                </Link>
                ) via the{" "}
                <code className="rounded bg-muted px-1 text-xs">X-API-Key</code>{" "}
                header, or a JWT via{" "}
                <code className="rounded bg-muted px-1 text-xs">Authorization: Bearer …</code>.
                Organization context goes in{" "}
                <code className="rounded bg-muted px-1 text-xs">X-Organization-ID</code>.
              </p>
              <Code>{`curl ${base}/api/v1/bots/ \\
  -H "X-API-Key: fmb_live_…" \\
  -H "X-Organization-ID: <org_id>"`}</Code>
            </section>

            <section id="bots" className="space-y-3">
              <h2 className="text-base font-semibold">Bots</h2>
              <div className="space-y-2">
                <Endpoint method="GET" path="/bots/" />
                <Endpoint method="POST" path="/bots/" />
                <Endpoint method="POST" path="/bots/{id}/connect/" />
                <Endpoint method="GET" path="/bots/{id}/qr/" />
                <Endpoint method="GET" path="/bots/{id}/status/" />
                <Endpoint method="POST" path="/bots/{id}/disconnect/" />
              </div>
            </section>

            <section id="messages" className="space-y-3">
              <h2 className="text-base font-semibold">Messages</h2>
              <Endpoint method="POST" path="/messages/send/" />
              <Code>{`curl -X POST ${base}/api/v1/messages/send/ \\
  -H "X-API-Key: fmb_live_…" \\
  -H "X-Organization-ID: <org_id>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "bot_id": "bot_…",
    "to": "2557XXXXXXXX",
    "type": "text",
    "text": "Hello from FomoBot"
  }'`}</Code>
            </section>

            <section id="contacts" className="space-y-3">
              <h2 className="text-base font-semibold">Contacts</h2>
              <div className="space-y-2">
                <Endpoint method="GET" path="/contacts/" />
                <Endpoint method="POST" path="/contacts/" />
                <Endpoint method="PATCH" path="/contacts/{id}/" />
              </div>
            </section>

            <section id="conversations" className="space-y-3">
              <h2 className="text-base font-semibold">Conversations</h2>
              <div className="space-y-2">
                <Endpoint method="GET" path="/conversations/" />
                <Endpoint method="GET" path="/conversations/{id}/messages/" />
                <Endpoint method="POST" path="/conversations/{id}/messages/send/" />
                <Endpoint method="POST" path="/conversations/{id}/archive/" />
              </div>
            </section>

            <section id="webhooks" className="space-y-3">
              <h2 className="text-base font-semibold">Webhooks</h2>
              <p className="text-sm text-muted-foreground">
                We sign every request with{" "}
                <code className="rounded bg-muted px-1 text-xs">X-Fomobot-Signature</code>{" "}
                (HMAC-SHA256 of the raw body with your webhook secret). Verify it
                before processing.
              </p>
              <div className="space-y-2">
                <Endpoint method="GET" path="/webhooks/" />
                <Endpoint method="POST" path="/webhooks/" />
                <Endpoint method="POST" path="/webhooks/{id}/test/" />
              </div>
              <Code>{`# Verify signature (Node.js)
const crypto = require("crypto")
const expected = crypto
  .createHmac("sha256", WEBHOOK_SECRET)
  .update(rawBody)
  .digest("hex")
assert(crypto.timingSafeEqual(
  Buffer.from(expected), Buffer.from(req.headers["x-fomobot-signature"])
))`}</Code>
            </section>

            <section id="errors" className="space-y-3">
              <h2 className="text-base font-semibold">Errors</h2>
              <p className="text-sm text-muted-foreground">
                Errors return{" "}
                <code className="rounded bg-muted px-1 text-xs">
                  {"{ success: false, error: { code, message } }"}
                </code>
                . Common codes:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "VALIDATION_ERROR", "UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND",
                  "RATE_LIMITED", "BOT_NOT_CONNECTED", "PLAN_LIMIT_REACHED",
                ].map((c) => (
                  <code key={c} className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {c}
                  </code>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
