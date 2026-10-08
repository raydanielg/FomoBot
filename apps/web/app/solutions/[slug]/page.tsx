import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { pageSeo } from "@/lib/seo/metadata"
import { SeoLandingPageView } from "@/components/seo-landing"
import { solutionPages } from "@/lib/seo/landing"

export function generateStaticParams() {
  return solutionPages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = solutionPages.find((p) => p.slug === slug)
  if (!page) return {}
  return pageSeo({
    title: page.title,
    description: page.description,
    path: `/solutions/${page.slug}`,
  })
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = solutionPages.find((p) => p.slug === slug)
  if (!page) notFound()
  return <SeoLandingPageView page={{ ...page, slug: `solutions/${page.slug}` }} />
}
