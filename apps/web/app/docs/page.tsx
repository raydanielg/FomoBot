import type { Metadata } from "next"
import Link from "next/link"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, ApiIcon, WebhookIcon, Key01Icon, BubbleChatIcon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"

import { InfoPage, InfoSection } from "@/components/info-page"
import { JsonLd, breadcrumbSchema } from "@/lib/seo/schemas"
import { pageSeo } from "@/lib/seo/metadata"
import { seoConfig } from "@/lib/seo/config"

export const metadata: Metadata = pageSeo({
  title: "FomoBot API Documentation — WhatsApp API, Webhooks, Automations",
  description:
    "Complete developer documentation for the FomoBot WhatsApp API: authentication, messages, webhooks, automations, contacts and error handling.",
  path: "/docs",
})

const sections = [
  {
    icon: Key01Icon,
    title: "Authentication",
    body: "JWT for dashboard sessions; scoped API keys (X-API-Key header) for server-to-server calls. Keys carry scopes like messages:write, contacts:read, webhooks:manage.",
  },
  {
    icon: BubbleChatIcon,
    title: "Messages",
    body: "POST /api/v1/messages/send — send text, images, documents. Every response returns a request_id for tracing; delivery status flows via webhooks.",
  },
  {
    icon: WebhookIcon,
    title: "Webhooks",
    body: "Subscribe a URL to 14 event types: message.received, message.delivered, bot.connected and more. Failed deliveries retry and are fully logged.",
  },
  {
    icon: ApiIcon,
    title: "Bots & sessions",
    body: "POST /api/v1/bots/ creates a bot; /connect returns a QR payload; /status reports connection state. Sessions persist across restarts.",
  },
]

export default function DocsPage() {
  return (
    <InfoPage
      title="API Documentation"
      description="Everything you need to integrate FomoBot."
      path="/docs"
    >
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Documentation", path: "/docs" },
        ])}
      />

      <div className="not-prose mb-4 rounded-xl border border-border bg-muted/40 p-5 font-mono text-xs leading-relaxed">
        <p className="text-muted-foreground"># send a WhatsApp message</p>
        <p className="mt-2">
          <span className="text-foreground">curl -X POST</span>{" "}
          <span className="text-muted-foreground">{seoConfig.url.replace("https://", "")}/api/v1/messages/send/</span>{" "}
          <span className="text-foreground">\</span>
        </p>
        <p className="ps-4 text-muted-foreground">-H "X-API-Key: fmb_live_…" \</p>
        <p className="ps-4 text-muted-foreground">-d '&#123;"bot_id":"bot_…","to":"2557XXXXXXXX","type":"text","text":"Hello"&#125;'</p>
      </div>

      {sections.map((s) => (
        <InfoSection key={s.title} heading={s.title}>
          <p>{s.body}</p>
        </InfoSection>
      ))}

      <InfoSection heading="Response envelope">
        <p>
          Every endpoint returns a consistent envelope:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            &#123; success, data, error, request_id &#125;
          </code>
          . Validation failures include field-level detail at{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">error.details.fields</code>.
        </p>
      </InfoSection>

      <InfoSection heading="Go further">
        <div className="not-prose flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="sm" render={<Link href="/dashboard/api/playground" />}>
            API playground
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
          <Button variant="ghost" size="sm" render={<Link href="/whatsapp-api" />}>
            API overview
          </Button>
          <Button variant="ghost" size="sm" render={<Link href="/whatsapp-webhooks" />}>
            Webhooks guide
          </Button>
          <Button variant="ghost" size="sm" render={<Link href="/blog" />}>
            Tutorials
          </Button>
        </div>
      </InfoSection>
    </InfoPage>
  )
}
