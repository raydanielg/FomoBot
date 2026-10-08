import { seoConfig } from "@/lib/seo/config"
import { canonical } from "@/lib/seo/metadata"

/** Render a validated JSON-LD script tag. Only render schemas that describe the page. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.name,
    url: seoConfig.url,
    logo: canonical(seoConfig.logo),
    description: seoConfig.description,
    email: seoConfig.contactEmail,
  }
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.name,
    url: seoConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${seoConfig.url}/docs?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  }
}

export function softwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: seoConfig.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: seoConfig.url,
    description: seoConfig.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free while in beta",
    },
  }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  }
}

export function webPageSchema(page: { title: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: canonical(page.path),
    isPartOf: { "@type": "WebSite", name: seoConfig.name, url: seoConfig.url },
  }
}

export function articleSchema(article: {
  title: string
  description: string
  path: string
  publishedAt: string
  updatedAt?: string
  author: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: canonical(article.path),
    image: canonical(article.image ?? seoConfig.ogImage),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Organization", name: seoConfig.name, url: seoConfig.url },
    publisher: {
      "@type": "Organization",
      name: seoConfig.name,
      logo: { "@type": "ImageObject", url: canonical(seoConfig.logo) },
    },
  }
}
