import type { MetadataRoute } from "next"

import { seoConfig } from "@/lib/seo/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/api/",
          "/internal",
          "/private",
        ],
      },
    ],
    sitemap: `${seoConfig.url}/sitemap.xml`,
  }
}
