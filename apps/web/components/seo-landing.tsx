import Link from "next/link"
import Image from "next/image"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"

import { JsonLd, faqSchema, breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas"
import type { SeoLandingPage } from "@/lib/seo/landing"

export function SeoLandingPageView({ page }: { page: SeoLandingPage }) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <JsonLd
        data={webPageSchema({ title: page.title, description: page.description, path: `/${page.slug}` })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          ...(page.slug.includes("/")
            ? [{ name: "Solutions", path: "/solutions/ecommerce" }]
            : []),
          { name: page.title.replace(" | FomoBot", ""), path: `/${page.slug}` },
        ])}
      />
      <JsonLd data={faqSchema(page.faqs)} />

      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/fomobot-logo.png" alt="Fomobot" width={24} height={26} />
          <span className="font-semibold tracking-tight">Fomobot</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button size="sm" render={<Link href="/signup" />}>
            Get started
          </Button>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-14 md:pt-20">
        <nav className="mb-6 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">Home</Link>
          {page.slug.includes("/") && (
            <> / <span>Solutions</span></>
          )}
          {" / "}
          <span className="text-foreground">{page.title.replace(" | FomoBot", "")}</span>
        </nav>

        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          {page.h1}
        </h1>
        <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          {page.intro}
        </p>

        <div className="mt-8 flex gap-3">
          <Button size="lg" render={<Link href="/signup" />}>
            Get started free
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/docs" />}>
            Documentation
          </Button>
        </div>

        <section className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">What you can do</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {page.capabilities.map((c) => (
              <div key={c.title} className="rounded-xl border border-border p-5">
                <p className="text-sm font-medium">{c.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight">Common use cases</h2>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {page.useCases.map((u) => (
              <li key={u} className="flex items-start gap-2.5 text-sm">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  strokeWidth={2}
                  className="mt-0.5 size-4 shrink-0 text-primary-foreground"
                />
                <span className="text-muted-foreground">{u}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight">Frequently asked questions</h2>
          <dl className="mt-6 flex flex-col gap-6">
            {page.faqs.map((f) => (
              <div key={f.question}>
                <dt className="text-sm font-medium">{f.question}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {f.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14 rounded-2xl border border-border bg-muted/30 p-8 text-center">
          <h2 className="text-lg font-semibold tracking-tight">Try it yourself</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Create a workspace and connect a WhatsApp number in under two minutes.
          </p>
          <Button size="lg" className="mt-5" render={<Link href="/signup" />}>
            Create your workspace
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {page.related.map((r) => (
              <Button key={r.href} variant="ghost" size="sm" render={<Link href={r.href} />}>
                {r.label}
              </Button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
