import type { Metadata } from "next"

import { InfoPage, InfoSection } from "@/components/info-page"
import { pageSeo } from "@/lib/seo/metadata"

export const metadata: Metadata = pageSeo({
  title: "Privacy Policy — FomoBot",
  description: "What data FomoBot collects, why, and how it's protected.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      description="What we collect and how it's used."
      path="/privacy"
      updated="February 2026"
    >
      <InfoSection heading="What we collect">
        <p>
          Account data (name, email), organization membership, WhatsApp session
          state needed to keep your bot connected, message metadata (sender,
          recipient, timestamps, delivery status) and request logs for security
          and debugging.
        </p>
      </InfoSection>
      <InfoSection heading="What we don't collect">
        <p>
          We don't sell or share your data with advertisers. We don't inspect
          message content beyond what's needed to deliver it. OTP codes are
          stored hashed — the raw value exists only in the sent message.
        </p>
      </InfoSection>
      <InfoSection heading="Your rights">
        <p>
          You can export or delete your data at any time by contacting support.
          Deleting your account anonymizes personal data while retaining
          anonymized aggregate logs required for security auditing.
        </p>
      </InfoSection>
      <InfoSection heading="Data location">
        <p>
          Data is processed on infrastructure we control. Contact us for
          details on region availability.
        </p>
      </InfoSection>
    </InfoPage>
  )
}
