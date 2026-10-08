import type { Metadata } from "next"

import { InfoPage, InfoSection } from "@/components/info-page"
import { pageSeo } from "@/lib/seo/metadata"
import { seoConfig } from "@/lib/seo/config"

export const metadata: Metadata = pageSeo({
  title: "Contact FomoBot",
  description:
    "Get help with FomoBot — support, sales and technical questions about WhatsApp automation and the API.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact"
      description="Reach the FomoBot team."
      path="/contact"
    >
      <InfoSection heading="Support">
        <p>
          For product help, bug reports or account issues, email{" "}
          <a className="text-foreground underline" href={`mailto:${seoConfig.contactEmail}`}>
            {seoConfig.contactEmail}
          </a>
          . Include your request ID (found on every API response) for fastest help.
        </p>
      </InfoSection>
      <InfoSection heading="Technical questions">
        <p>
          Integration questions are usually answered fastest by{" "}
          <a className="text-foreground underline" href="/docs">
            the API documentation
          </a>{" "}
          — endpoints, authentication, webhooks and error formats are all covered.
        </p>
      </InfoSection>
      <InfoSection heading="Security">
        <p>
          Found a vulnerability? Please review{" "}
          <a className="text-foreground underline" href="/security">
            our security page
          </a>{" "}
          before reporting — responsible disclosure is appreciated and never punished.
        </p>
      </InfoSection>
    </InfoPage>
  )
}
