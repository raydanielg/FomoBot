/** Central SEO configuration — single source of truth. */

export const seoConfig = {
  name: "Fomobot",
  legalName: "Fomobot",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fomobot.dev",
  description:
    "Build WhatsApp bots, automate conversations, send messages and connect WhatsApp to your applications with FomoBot — a developer-friendly WhatsApp platform.",
  tagline: "Connect WhatsApp. Build on top of it.",
  logo: "/fomobot-logo.png",
  ogImage: "/opengraph-image",
  twitterHandle: "@fomobot",
  locale: "en_US",
  contactEmail: "hello@fomobot.dev",
  /** Paths that must never be indexed. */
  privatePrefixes: ["/dashboard", "/admin", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/api"],
} as const

export type PageType = "website" | "article"

export interface PageSEO {
  title: string
  description: string
  path: string
  noIndex?: boolean
  type?: PageType
  keywords?: string[]
  image?: string
  publishedAt?: string
  updatedAt?: string
  authors?: string[]
  section?: string
  tags?: string[]
}
