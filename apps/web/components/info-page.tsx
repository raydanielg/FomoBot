import Link from "next/link"
import Image from "next/image"

import { JsonLd, webPageSchema } from "@/lib/seo/schemas"

export function InfoPage({
  title,
  description,
  path,
  updated,
  children,
}: {
  title: string
  description: string
  path: string
  updated?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <JsonLd data={webPageSchema({ title, description, path })} />
      <header className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/fomobot-logo.png" alt="Fomobot" width={24} height={26} />
          <span className="font-semibold tracking-tight">Fomobot</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/docs" className="hover:text-foreground">Docs</Link>
          <Link href="/signup" className="text-foreground hover:underline">Get started</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-12">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
        {updated && (
          <p className="mt-1 text-xs text-muted-foreground">Last updated {updated}</p>
        )}
        <div className="prose-sm mt-10 flex flex-col gap-8 text-sm leading-relaxed">
          {children}
        </div>
      </main>
    </div>
  )
}

export function InfoSection({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-2.5 text-lg font-semibold tracking-tight">{heading}</h2>
      <div className="flex flex-col gap-3 text-muted-foreground">{children}</div>
    </section>
  )
}
