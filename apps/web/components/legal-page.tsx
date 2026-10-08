import Link from "next/link"
import Image from "next/image"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlertDiamondIcon,
  ArrowRight01Icon,
  BanIcon,
  CheckmarkCircle02Icon,
  LegalDocument01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"

import { JsonLd, webPageSchema } from "@/lib/seo/schemas"

export type LegalTocItem = { id: string; label: string }

export function LegalPage({
  title,
  description,
  path,
  updated,
  intro,
  toc,
  children,
}: {
  title: string
  description: string
  path: string
  updated: string
  intro?: string
  toc: LegalTocItem[]
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <JsonLd data={webPageSchema({ title, description, path })} />

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/fomobot-logo.png" alt="Fomobot" width={24} height={26} />
            <span className="font-semibold tracking-tight">Fomobot</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" render={<Link href="/docs" />}>
              Docs
            </Button>
            <Button size="sm" render={<Link href="/signup" />}>
              Get started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-sky-400/[0.04] to-transparent" />
        <div className="absolute inset-x-0 -top-40 h-72 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.18),transparent_65%)]" />
        <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-16 md:pb-16 md:pt-20">
          <div className="flex size-12 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 shadow-sm">
            <HugeiconsIcon
              icon={LegalDocument01Icon}
              strokeWidth={1.5}
              className="size-6 text-sky-600 dark:text-sky-400"
            />
          </div>
          <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
          {intro && (
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
              {intro}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Last updated {updated}
            </span>
            <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 font-medium">
              Applies to all FomoBot accounts
            </span>
          </div>
        </div>
      </div>

      {/* Body: sticky TOC + content */}
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <aside className="hidden lg:block">
            <nav className="sticky top-24 flex flex-col gap-1 text-sm" aria-label="On this page">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                On this page
              </p>
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="flex min-w-0 flex-col gap-10 text-[15px] leading-relaxed">
            {children}
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium">Questions about this document?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Reach our team any time — we answer legal and privacy questions seriously.
            </p>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/contact" />}>
            Contact us
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
        </div>
        <div className="border-t border-border/60">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-5 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} FomoBot</span>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/security" className="hover:text-foreground">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function LegalSection({
  id,
  index,
  heading,
  children,
}: {
  id: string
  index: number
  heading: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm font-medium text-sky-600 dark:text-sky-400">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{heading}</h2>
      </div>
      <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

export function LegalWarning({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-red-500/25 bg-red-500/[0.06] p-5">
      <div className="flex items-center gap-2.5">
        <HugeiconsIcon icon={AlertDiamondIcon} strokeWidth={1.5} className="size-5 text-red-600 dark:text-red-400" />
        <p className="text-sm font-semibold text-red-700 dark:text-red-400">{title}</p>
      </div>
      <div className="mt-3 flex flex-col gap-2 text-sm text-red-900/80 dark:text-red-200/80">
        {children}
      </div>
    </div>
  )
}

export function LegalNote({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-sky-500/25 bg-sky-500/[0.06] p-5">
      <div className="flex items-center gap-2.5">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={1.5} className="size-5 text-sky-600 dark:text-sky-400" />
        <p className="text-sm font-semibold text-sky-700 dark:text-sky-400">{title}</p>
      </div>
      <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
        {children}
      </div>
    </div>
  )
}

export function LegalList({
  items,
  tone = "neutral",
}: {
  items: React.ReactNode[]
  tone?: "neutral" | "ban"
}) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          {tone === "ban" ? (
            <HugeiconsIcon
              icon={BanIcon}
              strokeWidth={2}
              className="mt-0.5 size-4 shrink-0 text-red-500"
            />
          ) : (
            <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
