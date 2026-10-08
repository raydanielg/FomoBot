import type { Metadata } from "next"

import { InfoPage, InfoSection } from "@/components/info-page"
import { pageSeo } from "@/lib/seo/metadata"
import { seoConfig } from "@/lib/seo/config"

export const metadata: Metadata = pageSeo({
  title: "Security — FomoBot",
  description:
    "How FomoBot protects your WhatsApp sessions, API keys and data — hashed OTPs, scoped keys, audit logs and more.",
  path: "/security",
})

export default function SecurityPage() {
  return (
    <InfoPage
      title="Security"
      description="How FomoBot protects accounts, sessions and messages."
      path="/security"
      updated="February 2026"
    >
      <InfoSection heading="Authentication">
        <p>
          Passwords are hashed and never stored in plaintext. Sessions use
          short-lived JWT access tokens with rotating refresh tokens. Failed
          logins are throttled and recorded as security events.
        </p>
      </InfoSection>
      <InfoSection heading="API keys">
        <p>
          API keys are shown once at creation, stored hashed, and scoped by
          permission (e.g. messages:read, webhooks:write). Keys can be revoked
          or rotated instantly. Every API call is logged with a request ID.
        </p>
      </InfoSection>
      <InfoSection heading="OTP codes">
        <p>
          Verification codes are SHA-256 hashed before storage, expire within
          minutes, are single-use and rate-limited per identifier and IP. Raw
          codes are never persisted or shown to administrators.
        </p>
      </InfoSection>
      <InfoSection heading="WhatsApp sessions">
        <p>
          Session credentials are stored server-side and never exposed to the
          frontend. QR codes expire and can be revoked from the bot settings at
          any time. Disconnecting a bot immediately invalidates its session.
        </p>
      </InfoSection>
      <InfoSection heading="Audit trail">
        <p>
          Sensitive admin actions — user suspension, impersonation, role
          changes, broadcasts — are appended to an immutable audit log with
          actor, IP and timestamp. Audit logs cannot be edited or deleted
          through the UI.
        </p>
      </InfoSection>
      <InfoSection heading="Reporting a vulnerability">
        <p>
          Email{" "}
          <a className="text-foreground underline" href={`mailto:${seoConfig.contactEmail}`}>
            {seoConfig.contactEmail}
          </a>{" "}
          with details. We investigate promptly and never take legal action
          against good-faith security research.
        </p>
      </InfoSection>
    </InfoPage>
  )
}
