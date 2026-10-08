import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"

import { JsonLd, breadcrumbSchema } from "@/lib/seo/schemas"
import { pageSeo } from "@/lib/seo/metadata"
import { blogPosts } from "@/lib/seo/blog"

export const metadata: Metadata = pageSeo({
  title: "FomoBot Blog — WhatsApp Automation & API Guides",
  description:
    "Tutorials and guides on building WhatsApp bots, automations, OTP verification and the WhatsApp API.",
  path: "/blog",
})

export default function BlogIndexPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
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
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Blog</h1>
        <p className="mt-3 text-muted-foreground">
          Guides on WhatsApp automation, the API and building bots.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-xl border border-border p-6 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline">{post.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  {post.readingMinutes} min read
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold tracking-tight">
                <Link href={`/blog/${post.slug}`} className="group-hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
