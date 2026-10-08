import type { Metadata } from "next"

import { seoConfig, type PageSEO } from "@/lib/seo/config"

/** Build a canonical URL for a path (trailing slash normalized off). */
export function canonical(path: string): string {
  const clean = path === "/" ? "/" : path.replace(/\/+$/, "")
  return `${seoConfig.url}${clean}`
}

/** Build a full Next.js Metadata object for a page. */
export function pageSeo(seo: PageSEO): Metadata {
  const url = canonical(seo.path)
  const ogImage = seo.image ?? seoConfig.ogImage
  const robots = seo.noIndex
    ? { index: false, follow: false, nocache: true }
    : undefined

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots,
    alternates: { canonical: url },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: seoConfig.name,
      type: seo.type ?? "website",
      locale: seoConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${seoConfig.name} — ${seo.title}` }],
      ...(seo.type === "article"
        ? {
            publishedTime: seo.publishedAt,
            modifiedTime: seo.updatedAt,
            authors: seo.authors,
            section: seo.section,
            tags: seo.tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
  }
}

/** Standard noindex metadata for private app areas. */
export const noIndexMetadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: { absolute: "Fomobot" },
}
