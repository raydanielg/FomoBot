import type { Metadata } from "next"
import Link from "next/link"

import { InfoPage, InfoSection } from "@/components/info-page"
import { pageSeo } from "@/lib/seo/metadata"
import { seoConfig } from "@/lib/seo/config"

export const metadata: Metadata = pageSeo({
  title: "About FomoBot",
  description:
    "FomoBot is WhatsApp infrastructure for developers and businesses — connect a number, automate conversations, integrate via API.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <InfoPage
      title="About FomoBot"
      description="WhatsApp infrastructure for developers and businesses."
      path="/about"
    >
      <InfoSection heading="What we build">
        <p>
          FomoBot lets teams connect a WhatsApp account once and treat it as
          software infrastructure — a persistent session, a clean REST API,
          signed webhooks, automations and a shared team inbox.
        </p>
        <p>
          The product exists because WhatsApp is the de-facto business channel
          across Africa and much of the world, yet integrating it properly means
          session management, provider quirks and delivery tracking that every
          team shouldn't have to rebuild.
        </p>
      </InfoSection>
      <InfoSection heading="How we work">
        <p>
          We build API-first: everything the dashboard does is also available
          over documented endpoints. We favor reliability, transparent logs and
          request IDs you can trace — because WhatsApp sessions fail, and when
          they do you should know exactly why.
        </p>
      </InfoSection>
      <InfoSection heading="Contact">
        <p>
          Questions or support:{" "}
          <a className="text-foreground underline" href={`mailto:${seoConfig.contactEmail}`}>
            {seoConfig.contactEmail}
          </a>
          . Developers should start with{" "}
          <Link className="text-foreground underline" href="/docs">
            the API documentation
          </Link>
          .
        </p>
      </InfoSection>
    </InfoPage>
  )
}
