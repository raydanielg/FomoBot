import type { Metadata } from "next"

import { InfoPage, InfoSection } from "@/components/info-page"
import { pageSeo } from "@/lib/seo/metadata"

export const metadata: Metadata = pageSeo({
  title: "Terms of Service — FomoBot",
  description: "Terms governing use of the FomoBot platform and API.",
  path: "/terms",
})

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms of Service"
      description="Rules for using FomoBot."
      path="/terms"
      updated="February 2026"
    >
      <InfoSection heading="The service">
        <p>
          FomoBot provides WhatsApp session hosting, a messaging API, webhooks,
          automations and a team inbox. The service is provided "as is" while
          in beta — free of charge — with no uptime SLA yet.
        </p>
      </InfoSection>
      <InfoSection heading="Acceptable use">
        <p>
          You must comply with WhatsApp's policies. Don't use FomoBot to spam,
          send unsolicited bulk messages, harass people, or transmit unlawful
          content. Accounts that abuse the platform may be suspended.
        </p>
      </InfoSection>
      <InfoSection heading="Your responsibilities">
        <p>
          You're responsible for your API keys and webhook endpoints, the
          content you send, and having consent to message recipients.
        </p>
      </InfoSection>
      <InfoSection heading="Termination">
        <p>
          You can delete your account anytime. We can suspend accounts that
          violate these terms. On termination, sessions disconnect and personal
          data is anonymized per our privacy policy.
        </p>
      </InfoSection>
    </InfoPage>
  )
}
