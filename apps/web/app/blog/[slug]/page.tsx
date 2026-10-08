import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"

import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/seo/schemas"
import { pageSeo } from "@/lib/seo/metadata"
import { blogPosts } from "@/lib/seo/blog"

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return {}
  return pageSeo({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    keywords: [post.category, "WhatsApp", "FomoBot"],
    tags: [post.category],
    section: post.category,
    authors: ["FomoBot"],
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <div className="min-h-svh bg-background text-foreground">
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.excerpt,
          path: `/blog/${post.slug}`,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          author: "FomoBot",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <header className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/fomobot-logo.png" alt="Fomobot" width={24} height={26} />
          <span className="font-semibold tracking-tight">Fomobot</span>
        </Link>
        <Button variant="ghost" size="sm" render={<Link href="/blog" />}>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          All posts
        </Button>
      </header>

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-10">
        <nav className="mb-6 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">Home</Link>
          {" / "}
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          {" / "}
          <span className="text-foreground">{post.title}</span>
        </nav>

        <div className="flex items-center gap-2.5">
          <Badge variant="outline">{post.category}</Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {post.readingMinutes} min read
          </span>
        </div>

        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="mt-10 flex flex-col gap-9">
          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="mb-2.5 text-lg font-semibold tracking-tight">{s.heading}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>

        {related.length > 0 && (
          <aside className="mt-16 border-t border-border pt-8">
            <h2 className="text-sm font-semibold">More guides</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </article>
    </div>
  )
}
