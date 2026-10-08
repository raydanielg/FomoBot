/**
 * Programmatic SEO landing pages — each slug targets one distinct search intent.
 * Content is hand-written per page; do not add thin/duplicate slugs.
 */

export interface SeoLandingPage {
  slug: string
  h1: string
  title: string
  description: string
  intro: string
  capabilities: { title: string; text: string }[]
  useCases: string[]
  faqs: { question: string; answer: string }[]
  related: { label: string; href: string }[]
}

const CTA_RELATED = [
  { label: "API documentation", href: "/docs" },
  { label: "Create a free workspace", href: "/signup" },
]

export const seoPages: SeoLandingPage[] = [
  {
    slug: "whatsapp-bot",
    h1: "Build a WhatsApp bot without managing the plumbing",
    title: "WhatsApp Bot Builder | FomoBot",
    description:
      "Create a WhatsApp bot in minutes — scan a QR code, configure automations and send/receive messages through a clean API. Free while in beta.",
    intro:
      "A WhatsApp bot on FomoBot is a persistent session attached to a real WhatsApp number. You create the bot, scan a QR code once, and FomoBot keeps the session alive — so your application, automations and team inbox can send and receive messages around the clock.",
    capabilities: [
      { title: "Persistent sessions", text: "Bots stay connected across restarts and deploys. Sessions reconnect automatically and alert you if WhatsApp drops." },
      { title: "Automations", text: "WHEN/IF/THEN rules — auto-reply to keywords, tag contacts, assign conversations and call webhooks without writing code." },
      { title: "Shared team inbox", text: "Agents reply to WhatsApp conversations alongside the bot, with assignment and unread tracking." },
      { title: "Full API + webhooks", text: "Every bot exposes a REST API for sending messages and signed webhooks for inbound events." },
    ],
    useCases: [
      "Order status replies for ecommerce stores",
      "Appointment reminders for clinics and services",
      "Lead qualification before a human joins",
      "FAQ auto-answers outside business hours",
    ],
    faqs: [
      { question: "Do I need a WhatsApp Business account?", answer: "No. FomoBot works with a regular WhatsApp number linked via QR code, similar to WhatsApp Web." },
      { question: "Does the bot stay connected?", answer: "Yes — sessions persist server-side and reconnect automatically. You get a notification if the session drops." },
      { question: "Can I run multiple bots?", answer: "Yes. Each bot maps to one WhatsApp number and you can run several bots per workspace." },
    ],
    related: CTA_RELATED,
  },
  {
    slug: "whatsapp-automation",
    h1: "WhatsApp automation that runs while you sleep",
    title: "WhatsApp Automation Platform | FomoBot",
    description:
      "Automate WhatsApp replies, tagging, assignment and outbound messages with rules, triggers and webhooks. Built for teams and developers.",
    intro:
      "FomoBot's automation engine turns incoming WhatsApp messages into structured workflows. Match on keywords or events, apply conditions, then fire actions — send replies, apply tags, assign agents or call your own webhook.",
    capabilities: [
      { title: "Event triggers", text: "React to message.received, contact.created, bot.connected and more." },
      { title: "Conditions", text: "Gate actions on equals, contains, starts_with or field-exists checks." },
      { title: "Composable actions", text: "Send messages, send templates, add tags, assign conversations, call webhooks or delay." },
      { title: "Run history", text: "Every execution is logged with timing and errors so you can debug rule behavior." },
    ],
    useCases: [
      "Auto-reply 'price' with your rate card",
      "Route 'support' keywords to the support team",
      "Notify ops on Slack via webhook when orders arrive",
      "Welcome every new contact automatically",
    ],
    faqs: [
      { question: "Can automations call my own systems?", answer: "Yes — the call_webhook action posts the event payload to any HTTPS URL you control." },
      { question: "Do automations cost extra?", answer: "No. Automations are included; message counts apply like any other send." },
      { question: "Can I pause an automation?", answer: "Yes — rules have active, paused and draft statuses that can be toggled anytime." },
    ],
    related: CTA_RELATED,
  },
  {
    slug: "whatsapp-api",
    h1: "A clean REST API for WhatsApp",
    title: "WhatsApp API | FomoBot",
    description:
      "Send and receive WhatsApp messages through a documented REST API with scoped keys, request IDs and signed webhooks.",
    intro:
      "FomoBot exposes WhatsApp as a normal web API. Create an API key, POST a message, subscribe to webhooks — everything returns a consistent envelope with a request ID you can trace.",
    capabilities: [
      { title: "Scoped API keys", text: "Keys carry scopes like messages:write or contacts:read — least privilege by default." },
      { title: "Consistent envelopes", text: "Every response is { success, data, error, request_id } — easy to log and debug." },
      { title: "Signed webhooks", text: "Inbound messages and delivery events POST to your endpoints with a signature." },
      { title: "Request explorer", text: "The logs page shows every API call with request ID, status and timing." },
    ],
    useCases: [
      "Send order confirmations from your backend",
      "Two-way chat embedded in your own product",
      "Sync contacts and conversations to a CRM",
      "Trigger outbound notifications from cron jobs",
    ],
    faqs: [
      { question: "Is the API REST?", answer: "Yes — plain HTTPS + JSON. Authentication via Bearer JWT or X-API-Key header." },
      { question: "How do I test without WhatsApp?", answer: "The mock provider lets you create sessions and simulate QR scans without a real phone." },
      { question: "Are there rate limits?", answer: "Rate limits are enforced per key and per plan — see the docs for current values." },
    ],
    related: CTA_RELATED,
  },
  {
    slug: "whatsapp-webhooks",
    h1: "Signed webhooks for every WhatsApp event",
    title: "WhatsApp Webhook API | FomoBot",
    description:
      "Receive WhatsApp messages, delivery receipts and session events as signed HTTP webhooks with retries and delivery logs.",
    intro:
      "Subscribe a URL once and FomoBot POSTs every event to it — inbound messages, delivery and read receipts, bot connection state changes. Deliveries are retried on failure and fully logged.",
    capabilities: [
      { title: "14 event types", text: "message.received, message.delivered, message.read, bot.connected, contact.created and more." },
      { title: "Retries", text: "Failed deliveries retry automatically with backoff; you can replay any delivery manually." },
      { title: "Delivery log", text: "Inspect status codes, response bodies and timing for every webhook call." },
      { title: "Per-bot or org-wide", text: "Scope webhooks to a single bot or the whole organization." },
    ],
    useCases: [
      "Push inbound messages into your helpdesk",
      "Update order records on delivery receipts",
      "Page on-call when a bot disconnects",
      "Feed conversations into analytics",
    ],
    faqs: [
      { question: "What happens if my endpoint is down?", answer: "Deliveries retry with backoff and remain replayable from the delivery log." },
      { question: "Can I test a webhook?", answer: "Yes — every webhook has a test button that fires a sample event immediately." },
    ],
    related: CTA_RELATED,
  },
  {
    slug: "whatsapp-otp",
    h1: "Send OTP codes over WhatsApp",
    title: "WhatsApp OTP & Verification | FomoBot",
    description:
      "Deliver one-time passcodes through WhatsApp using templates, automations and a tracked OTP subsystem with rate limits.",
    intro:
      "WhatsApp OTP is cheaper and more reliable than SMS in markets where WhatsApp is the default messaging app. FomoBot's OTP model stores only hashed codes, enforces expiry and attempt limits, and can trigger from registration or sensitive actions.",
    capabilities: [
      { title: "Hashed storage", text: "Codes are SHA-256 hashed — raw values are never persisted or shown to admins." },
      { title: "Rate limiting", text: "Per-identifier hourly limits plus attempt caps before an OTP is blocked." },
      { title: "Template delivery", text: "Send codes through the 'Your code is {{otp}}' template over WhatsApp or email." },
      { title: "Audit trail", text: "Requests, verifications and blocks are recorded for support and security review." },
    ],
    useCases: [
      "Verify phone numbers at signup",
      "Confirm high-risk account actions",
      "Replace SMS OTP in WhatsApp-first markets",
      "Step-up verification for sensitive flows",
    ],
    faqs: [
      { question: "How long does an OTP last?", answer: "Default expiry is 10 minutes and configurable per purpose." },
      { question: "What channels are supported?", answer: "WhatsApp, SMS and email — WhatsApp is the primary channel where available." },
    ],
    related: CTA_RELATED,
  },
  {
    slug: "whatsapp-api-for-developers",
    h1: "WhatsApp API for developers",
    title: "WhatsApp API for Developers | FomoBot",
    description:
      "Docs-first WhatsApp integration: typed endpoints, scoped keys, request IDs, webhooks and an in-app playground.",
    intro:
      "FomoBot is built API-first. Everything the dashboard does — create bots, send messages, manage contacts — is available over the same REST endpoints, documented and testable in the built-in playground.",
    capabilities: [
      { title: "OpenAPI schema", text: "drf-spectacular generates a live schema at /api/schema/ — import it into Postman or your codegen." },
      { title: "In-app playground", text: "Pick an endpoint, edit the JSON body, send the request against your real org." },
      { title: "Predictable errors", text: "Validation failures return field-level details in error.details.fields." },
      { title: "Idempotent-friendly", text: "Request IDs let you correlate retries, logs and webhook deliveries." },
    ],
    useCases: [
      "Generate a client from the OpenAPI schema",
      "Smoke-test endpoints in the playground before shipping",
      "Trace a failing call end-to-end via request ID",
      "Lock a key to messages:read for reporting tools",
    ],
    faqs: [
      { question: "Is there an SDK?", answer: "Any OpenAPI-compatible generator produces a typed client from the live schema." },
      { question: "How is auth handled?", answer: "JWT for the dashboard, scoped API keys for server-to-server calls." },
    ],
    related: CTA_RELATED,
  },
  {
    slug: "whatsapp-customer-support",
    h1: "WhatsApp customer support automation",
    title: "WhatsApp Customer Support Automation | FomoBot",
    description:
      "Answer WhatsApp support chats instantly with automations, templates and a shared team inbox — with humans in the loop.",
    intro:
      "Most support questions are repetitive. FomoBot answers the predictable ones instantly — hours, pricing, order status — and hands the rest to agents in a shared inbox with assignment and unread tracking.",
    capabilities: [
      { title: "Keyword auto-replies", text: "Match 'price', 'hours', 'delivery' to canned answers — always on." },
      { title: "Human handoff", text: "Escalation rules assign conversations to agents with a notification." },
      { title: "Conversation context", text: "Agents see contact history, tags and notes before replying." },
      { title: "Delivery states", text: "Sent, delivered, read and failed are tracked per message." },
    ],
    useCases: [
      "24/7 answers to common questions",
      "Auto-assign billing questions to finance",
      "Catch failed sends before customers complain",
      "Measure how much the bot resolves alone",
    ],
    faqs: [
      { question: "Can a bot and agent share one number?", answer: "Yes — automations answer first, agents take over in the same inbox." },
      { question: "How do customers reach a human?", answer: "A keyword like 'human' or a fallback condition assigns the conversation to an agent." },
    ],
    related: CTA_RELATED,
  },
  {
    slug: "whatsapp-notifications",
    h1: "Transactional WhatsApp notifications",
    title: "WhatsApp Notifications | FomoBot",
    description:
      "Send order updates, reminders and alerts over WhatsApp via API, with delivery tracking and retries.",
    intro:
      "Email gets ignored and SMS is expensive. WhatsApp notifications land where people actually read. Send order updates, appointment reminders and alerts through one API call — then track delivery and read state per message.",
    capabilities: [
      { title: "One-call send", text: "POST /messages/send with a phone number and text — FomoBot queues and delivers." },
      { title: "Delivery receipts", text: "Webhook events fire on delivered, read and failed so you can retry or fall back." },
      { title: "Template messages", text: "Parameterize reusable messages with {{variables}} for consistent formatting." },
      { title: "Broadcasts", text: "Admins can notify user segments with recipient estimates and confirmation." },
    ],
    useCases: [
      "'Your order shipped' alerts",
      "Appointment reminders 24h before",
      "Payment confirmations",
      "Service outage notifications",
    ],
    faqs: [
      { question: "Can users opt out?", answer: "Yes — respect marketing preferences; transactional/security messages have separate handling." },
      { question: "What if a number isn't on WhatsApp?", answer: "The send fails with a provider error visible in logs and webhooks." },
    ],
    related: CTA_RELATED,
  },
  {
    slug: "whatsapp-chatbot",
    h1: "A WhatsApp chatbot for real businesses",
    title: "WhatsApp Chatbot Builder | FomoBot",
    description:
      "Build a WhatsApp chatbot that answers FAQs, qualifies leads and hands off to humans — no coding required.",
    intro:
      "A FomoBot chatbot is an automation graph plus a team inbox. It greets customers, answers common questions instantly, collects details and routes complex issues to people — with a full log of every decision.",
    capabilities: [
      { title: "No-code rules", text: "WHEN/IF/THEN builder — define triggers, conditions and replies visually." },
      { title: "Variable templating", text: "Personalize replies with {{name}}, {{order_id}} and contact fields." },
      { title: "Fallback handling", text: "When nothing matches, route to a human agent instead of dead-ending the chat." },
      { title: "Execution history", text: "See exactly which rule fired for every incoming message." },
    ],
    useCases: [
      "Store-front FAQ on WhatsApp",
      "Lead intake forms in chat",
      "Booking confirmations and reminders",
      "After-hours coverage",
    ],
    faqs: [
      { question: "Do I need developers?", answer: "Not to start — automations and templates are configured in the UI. Developers can extend via API/webhooks." },
      { question: "Does it understand free text?", answer: "Rules match keywords and patterns; LLM-style intent can be added via the webhook action to your own service." },
    ],
    related: CTA_RELATED,
  },
  {
    slug: "whatsapp-business-automation",
    h1: "WhatsApp automation for businesses",
    title: "WhatsApp Business Automation | FomoBot",
    description:
      "Turn WhatsApp into a business channel: automate replies, notify customers, share an inbox and integrate your systems.",
    intro:
      "For businesses, WhatsApp is where customers already are. FomoBot turns the channel into infrastructure — automations handle volume, the inbox handles exceptions, and the API connects it all to your existing systems.",
    capabilities: [
      { title: "Team inbox", text: "Multiple agents share one number with assignment, unread badges and history." },
      { title: "Contact CRM", text: "Tags, notes and last-seen tracking on every contact." },
      { title: "System integration", text: "Webhooks and REST API plug WhatsApp into your CRM, helpdesk or ERP." },
      { title: "Multi-bot", text: "Separate numbers per brand or team under one organization." },
    ],
    useCases: [
      "Centralize customer chat for a whole team",
      "Auto-confirm bookings and orders",
      "Tag VIP customers for priority handling",
      "Sync conversations to internal tools",
    ],
    faqs: [
      { question: "How is this different from the WhatsApp Business app?", answer: "The app is one phone, one person. FomoBot is multi-user, automatable and API-connected." },
      { question: "Can we import contacts?", answer: "Contacts can be created via API and managed in the contacts explorer." },
    ],
    related: CTA_RELATED,
  },
]

export const solutionPages: SeoLandingPage[] = [
  {
    slug: "ecommerce",
    h1: "WhatsApp automation for ecommerce",
    title: "WhatsApp for Ecommerce | FomoBot",
    description:
      "Order confirmations, shipping updates and abandoned-cart nudges over WhatsApp — automated via API and webhooks.",
    intro:
      "WhatsApp converts better than email for post-purchase communication. FomoBot plugs your store into WhatsApp: automatic order updates, delivery notifications and instant answers to 'where is my order?'.",
    capabilities: [
      { title: "Order lifecycle messages", text: "Confirm, ship, deliver — triggered from your backend via one API call." },
      { title: "WISMO deflection", text: "'Where is my order' auto-replies pull status from your systems via webhook." },
      { title: "Delivery tracking", text: "Know which customers read notifications via read receipts." },
      { title: "Recovery flows", text: "Automations nudge abandoned checkouts and notify when items restock." },
    ],
    useCases: ["Order confirmations", "Delivery notifications", "COD reminders", "Post-delivery feedback"],
    faqs: [
      { question: "Does it integrate with my store?", answer: "Any backend that can POST JSON can integrate — no plugin required." },
    ],
    related: CTA_RELATED,
  },
  {
    slug: "logistics",
    h1: "WhatsApp for logistics & delivery",
    title: "WhatsApp for Logistics | FomoBot",
    description:
      "Keep customers and drivers informed over WhatsApp — ETAs, delivery proof and exception alerts.",
    intro:
      "Deliveries go wrong in transit, not in systems. FomoBot keeps everyone informed on the channel they check — automated ETAs, driver contacts and exception alerts on the same number.",
    capabilities: [
      { title: "ETA notifications", text: "Push status changes from your dispatch system via API." },
      { title: "Exception alerts", text: "Failed delivery attempts notify customers instantly to reschedule." },
      { title: "Driver relay", text: "Customers can message the same thread the driver uses." },
      { title: "Delivery proof", text: "Photos and confirmations captured in the conversation record." },
    ],
    useCases: ["ETA updates", "Failed-delivery rescheduling", "COD confirmations", "Two-way driver contact"],
    faqs: [
      { question: "Can drivers use it without an app?", answer: "Drivers just use normal WhatsApp — your dispatch system sends via API." },
    ],
    related: CTA_RELATED,
  },
  {
    slug: "healthcare",
    h1: "WhatsApp for clinics & healthcare",
    title: "WhatsApp for Healthcare | FomoBot",
    description:
      "Appointment reminders, results notifications and secure patient communication over WhatsApp.",
    intro:
      "No-shows cost clinics money and delay care. WhatsApp reminders are read within minutes. FomoBot automates appointment communication while keeping PHI discipline — reminders go out, sensitive content stays in your systems.",
    capabilities: [
      { title: "Appointment reminders", text: "Automated 48h/24h reminders with reschedule links." },
      { title: "Two-way booking", text: "Patients reply YES/RESCHEDULE — automations update your schedule." },
      { title: "Results-ready alerts", text: "Notify patients when results are ready without including clinical content." },
      { title: "Verified OTP", text: "Confirm patient identity with WhatsApp OTP before sharing records." },
    ],
    useCases: ["Appointment reminders", "Results notifications", "Post-visit follow-ups", "Identity verification"],
    faqs: [
      { question: "Is it private?", answer: "Messages stay between your number and the patient. Keep clinical detail in linked records, not in chat." },
    ],
    related: CTA_RELATED,
  },
  {
    slug: "education",
    h1: "WhatsApp for schools & edtech",
    title: "WhatsApp for Education | FomoBot",
    description:
      "Reach students and parents on WhatsApp — class reminders, fee notifications and announcements.",
    intro:
      "Students and parents live on WhatsApp — not on portals nobody checks. FomoBot helps schools send class reminders, fee alerts and announcements to the channels people actually read.",
    capabilities: [
      { title: "Announcements", text: "Broadcast schedule changes or urgent notices to a whole intake." },
      { title: "Fee reminders", text: "Automated payment-due reminders with direct reply support." },
      { title: "Class alerts", text: "Homework, exam dates and timetable changes pushed to parents." },
      { title: "Enrollment support", text: "Automations answer admissions questions 24/7." },
    ],
    useCases: ["Class reminders", "Fee notifications", "Exam alerts", "Admissions FAQ"],
    faqs: [
      { question: "Can parents reply?", answer: "Yes — conversations come back to a shared inbox for the admin office." },
    ],
    related: CTA_RELATED,
  },
]

export const allSeoPages = [...seoPages, ...solutionPages.map((p) => ({ ...p, slug: `solutions/${p.slug}` }))]

export const landingSlugs = allSeoPages.map((p) => p.slug)
