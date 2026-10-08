import type { MetadataRoute } from "next"

import { seoConfig } from "@/lib/seo/config"
import { allSeoPages } from "@/lib/seo/landing"
import { blogPosts } from "@/lib/seo/blog"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { path: "/", priority: 1 },
    { path: "/docs", priority: 0.8 },
    { path: "/blog", priority: 0.7 },
    { path: "/about", priority: 0.4 },
    { path: "/contact", priority: 0.4 },
    { path: "/security", priority: 0.4 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/login", priority: 0.2 },
  ].map((p) => ({
    url: `${seoConfig.url}${p.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p.priority,
  }))

  const landing: MetadataRoute.Sitemap = allSeoPages.map((p) => ({
    url: `${seoConfig.url}/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const blog: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${seoConfig.url}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...landing, ...blog]
}
