#!/usr/bin/env node
/**
 * SEO audit — fetches every public route on the running dev/prod server and
 * validates titles, descriptions, canonicals, H1s, OG/Twitter tags and JSON-LD.
 *
 *   BASE=http://localhost:3000 node scripts/seo-audit.mjs
 */

const BASE = process.env.BASE ?? "http://localhost:3000"

const PUBLIC_ROUTES = [
  "/",
  "/docs",
  "/blog",
  "/about",
  "/contact",
  "/security",
  "/privacy",
  "/terms",
  "/whatsapp-bot",
  "/whatsapp-automation",
  "/whatsapp-api",
  "/whatsapp-webhooks",
  "/whatsapp-otp",
  "/whatsapp-api-for-developers",
  "/whatsapp-customer-support",
  "/whatsapp-notifications",
  "/whatsapp-chatbot",
  "/whatsapp-business-automation",
  "/solutions/ecommerce",
  "/solutions/logistics",
  "/solutions/healthcare",
  "/solutions/education",
  "/blog/how-to-build-a-whatsapp-bot",
  "/blog/whatsapp-api-vs-business-app",
  "/blog/whatsapp-otp-vs-sms",
]

const PRIVATE_ROUTES = ["/dashboard", "/admin", "/login"]

const results = {
  scanned: 0,
  errors: [],
  titles: new Map(),
  descriptions: new Map(),
}

function fail(route, msg) {
  results.errors.push(`${route}: ${msg}`)
}

async function checkPage(route) {
  const res = await fetch(`${BASE}${route}`, { redirect: "manual" })
  if (res.status !== 200) {
    fail(route, `HTTP ${res.status}`)
    return
  }
  const html = await res.text()
  results.scanned++

  const title = /<title[^>]*>([^<]+)<\/title>/.exec(html)?.[1]?.trim()
  const desc = /<meta name="description" content="([^"]+)"/.exec(html)?.[1]
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1]
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length
  const ogTitle = /<meta property="og:title"/.test(html)
  const ogImage = /<meta property="og:image"/.test(html)
  const twCard = /<meta name="twitter:card"/.test(html)
  const jsonLd = /<script type="application\/ld\+json">/.test(html)
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html)

  if (!title) fail(route, "missing <title>")
  if (!desc) fail(route, "missing meta description")
  if (!canonical) fail(route, "missing canonical")
  if (h1Count === 0) fail(route, "missing <h1>")
  if (h1Count > 1) fail(route, `${h1Count} <h1> tags`)
  if (!ogTitle) fail(route, "missing og:title")
  if (!ogImage) fail(route, "missing og:image")
  if (!twCard) fail(route, "missing twitter:card")
  if (!jsonLd) fail(route, "missing JSON-LD")
  if (noindex) fail(route, "public page marked noindex")

  if (title) {
    if (results.titles.has(title)) fail(route, `duplicate title with ${results.titles.get(title)}`)
    results.titles.set(title, route)
  }
  if (desc) {
    if (results.descriptions.has(desc)) fail(route, `duplicate description with ${results.descriptions.get(desc)}`)
    results.descriptions.set(desc, route)
  }
}

async function checkPrivate(route) {
  const res = await fetch(`${BASE}${route}`, { redirect: "manual" })
  if (![200, 307].includes(res.status)) fail(route, `unexpected HTTP ${res.status}`)
}

for (const r of PUBLIC_ROUTES) await checkPage(r)
for (const r of PRIVATE_ROUTES) await checkPrivate(r)

// sitemap + robots
const robots = await fetch(`${BASE}/robots.txt`).then((r) => r.text())
if (!robots.includes("Sitemap:")) fail("/robots.txt", "missing sitemap directive")
if (!/Disallow: \/dashboard/.test(robots)) fail("/robots.txt", "dashboard not disallowed")

const sitemap = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text())
const locs = (sitemap.match(/<loc>/g) ?? []).length
if (locs === 0) fail("/sitemap.xml", "no URLs")
if (sitemap.includes("/dashboard")) fail("/sitemap.xml", "dashboard indexed")
if (sitemap.includes("/admin")) fail("/sitemap.xml", "admin indexed")

console.log(`\nSEO AUDIT\n\nPages scanned: ${results.scanned + PRIVATE_ROUTES.length}`)
console.log(`Sitemap URLs: ${locs}`)
console.log(`Unique titles: ${results.titles.size}`)
console.log(`Unique descriptions: ${results.descriptions.size}`)
if (results.errors.length === 0) {
  console.log("\nAll checks passed.")
} else {
  console.log(`\n${results.errors.length} issue(s):`)
  results.errors.forEach((e) => console.log(`  ✗ ${e}`))
  process.exitCode = 1
}
