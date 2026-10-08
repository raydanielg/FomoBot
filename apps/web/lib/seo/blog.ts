/** Blog content model — real articles with publish dates and bodies. */

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  updatedAt?: string
  readingMinutes: number
  sections: { heading: string; body: string }[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-build-a-whatsapp-bot",
    title: "How to Build a WhatsApp Bot in 10 Minutes",
    excerpt:
      "Scan a QR code, configure your first automation, and send your first API message — the complete quickstart.",
    category: "Tutorials",
    publishedAt: "2026-01-15",
    readingMinutes: 6,
    sections: [
      {
        heading: "Create your bot",
        body: "From the FomoBot dashboard, click Create Bot and give it a name and description. One bot maps to one WhatsApp number — you can run several bots in a single workspace, one per number.",
      },
      {
        heading: "Scan the QR code",
        body: "Open the bot detail page and click Connect WhatsApp. A QR code appears — scan it with the phone that owns the number, exactly like WhatsApp Web. The session then persists on our servers, so the bot stays online even when your phone is off.",
      },
      {
        heading: "Add an automation",
        body: "Create a rule: WHEN message.received, IF text contains 'price', THEN send your rate card message. That's a working chatbot — no code. Add conditions for keywords, assign conversations to teammates, or call your own webhook.",
      },
      {
        heading: "Send your first API message",
        body: "Generate an API key with messages:write scope, then POST /api/v1/messages/send with a bot_id, recipient phone and text. The response returns a message ID you can track through sent → delivered → read via webhooks.",
      },
    ],
  },
  {
    slug: "whatsapp-api-vs-business-app",
    title: "WhatsApp Business App vs. a WhatsApp API — When to Upgrade",
    excerpt:
      "The Business app is great for one person. Teams, automations and integrations need infrastructure. Here's how to tell the difference.",
    category: "Guides",
    publishedAt: "2026-02-02",
    readingMinutes: 5,
    sections: [
      {
        heading: "What the Business app gives you",
        body: "The WhatsApp Business app is a phone app for one operator: labels, quick replies and catalogs. It's free and excellent — until the team grows or customers message while you sleep.",
      },
      {
        heading: "Where it breaks",
        body: "One number, one phone. No shared inbox, no CRM sync, no webhooks to your own systems, no audit trail of who replied. Automations stop at quick replies.",
      },
      {
        heading: "What an API platform adds",
        body: "An API platform like FomoBot turns WhatsApp into software infrastructure: a shared team inbox, trigger/action automations, delivery tracking per message, webhooks into your systems, and a REST API your backend can call.",
      },
      {
        heading: "When to switch",
        body: "Upgrade when you need multiple agents, 24/7 auto-replies, or outbound notifications triggered by your systems — orders, deliveries, appointments.",
      },
    ],
  },
  {
    slug: "whatsapp-otp-vs-sms",
    title: "WhatsApp OTP vs SMS OTP — Why Developers Are Switching",
    excerpt:
      "SMS costs add up and delivery is spotty in many markets. WhatsApp OTPs are read almost instantly — here's how to implement them safely.",
    category: "Guides",
    publishedAt: "2026-02-20",
    readingMinutes: 7,
    sections: [
      {
        heading: "The SMS problem",
        body: "SMS delivery rates vary wildly by carrier and country, costs scale with volume, and SIM-swap fraud is rising. In WhatsApp-first markets, SMS open rates are low because nobody checks SMS anymore.",
      },
      {
        heading: "How WhatsApp OTP works",
        body: "Send a 6-digit code through your WhatsApp bot using a message template: 'Your verification code is {{otp}}'. FomoBot hashes the code, enforces expiry and rate limits, and logs every attempt — raw codes are never stored.",
      },
      {
        heading: "Security requirements",
        body: "Store only hashed codes, enforce maximum attempts, expire codes within minutes, rate-limit requests per identifier and IP, and invalidate used codes immediately. FomoBot's OTP subsystem implements all of this.",
      },
      {
        heading: "Fallback strategy",
        body: "If a number isn't reachable on WhatsApp, fall back to email or SMS — FomoBot's OTP channels are designed for that switch.",
      },
    ],
  },
]
