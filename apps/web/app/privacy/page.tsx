import type { Metadata } from "next"
import Link from "next/link"

import {
  LegalList,
  LegalNote,
  LegalPage,
  LegalSection,
  LegalWarning,
} from "@/components/legal-page"
import { pageSeo } from "@/lib/seo/metadata"

export const metadata: Metadata = pageSeo({
  title: "Privacy Policy — FomoBot",
  description:
    "What data FomoBot collects, how we use it, how WhatsApp session data is protected, and the rights you have over your information.",
  path: "/privacy",
})

const TOC = [
  { id: "scope", label: "1. Scope & roles" },
  { id: "collect", label: "2. Data we collect" },
  { id: "whatsapp-data", label: "3. WhatsApp data & sessions" },
  { id: "messages", label: "4. Messages & content" },
  { id: "use", label: "5. How we use data" },
  { id: "legal-bases", label: "6. Legal bases" },
  { id: "sharing", label: "7. Sharing & subprocessors" },
  { id: "security", label: "8. Security" },
  { id: "retention", label: "9. Retention & deletion" },
  { id: "rights", label: "10. Your rights" },
  { id: "cookies", label: "11. Cookies" },
  { id: "transfers", label: "12. International transfers" },
  { id: "children", label: "13. Children" },
  { id: "changes", label: "14. Changes" },
  { id: "contact", label: "15. Contact" },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How FomoBot collects, uses, protects and deletes your data — including the WhatsApp session credentials you trust us with."
      intro="This policy explains our data practices in plain language. It applies to the FomoBot dashboard, the developer API, and everything that flows through your bots."
      path="/privacy"
      updated="October 2026"
      toc={TOC}
    >
      <LegalSection id="scope" index={1} heading="Scope and our roles">
        <p>
          FomoBot provides WhatsApp session hosting and a messaging API. For
          <strong> account and platform data</strong> (your registration, org
          settings, usage) we act as the <strong>data controller</strong>. For
          <strong> your business data</strong> — your contacts, conversations,
          messages and automations — we act as a <strong>data processor</strong>{" "}
          on your organization&apos;s behalf: you control that data, we process
          it only to provide the Service.
        </p>
      </LegalSection>

      <LegalSection id="collect" index={2} heading="Data we collect">
        <p><strong>Account & organization data</strong></p>
        <LegalList
          items={[
            "Name, email address, password (hashed — never stored in plaintext), and profile settings.",
            "Organization name, slug, members, roles, and plan information.",
            "Login activity: timestamps, IP addresses, and failed-login counters used for security.",
          ]}
        />
        <p className="pt-2"><strong>Service & technical data</strong></p>
        <LegalList
          items={[
            "API request logs: endpoint, method, status code, latency, IP and user agent.",
            "Webhook delivery records, automation run logs, and audit events.",
            "Device/browser metadata and support conversations.",
          ]}
        />
        <p className="pt-2"><strong>Data you put into the Service</strong></p>
        <LegalList
          items={[
            "Contacts (names, phone numbers, tags, notes) and conversations you manage.",
            "Message content and media metadata you send or receive through your bots.",
            "Templates, automation rules, and webhook endpoint URLs you configure.",
          ]}
        />
      </LegalSection>

      <LegalSection id="whatsapp-data" index={3} heading="WhatsApp data & session credentials">
        <p>
          Connecting a WhatsApp account stores a <strong>session credential</strong>{" "}
          so your bot stays online. We treat this as highly sensitive:
        </p>
        <LegalList
          items={[
            "Credentials are encrypted at rest (Fernet/AES) and never exposed through the API, logs, or admin panels.",
            "They are destroyed when you log out, delete a bot, or delete your account.",
            "Phone numbers you connect and message are stored in normalized form and are visible to your organization members according to their role.",
            "Incoming provider events are deduplicated and logged; sensitive payload fields are kept to the minimum needed for delivery.",
          ]}
        />
      </LegalSection>

      <LegalSection id="messages" index={4} heading="Messages & message content">
        <LegalWarning title="You control the content">
          <p>
            Messages sent through your bots are your data — FomoBot processes
            them only to deliver, log and display them back to you. We do
            <strong> not</strong> read, sell, profile or mine your message
            content for advertising, and we do not share it with other tenants.
          </p>
        </LegalWarning>
        <LegalList
          items={[
            "Outbound text may pass through provider infrastructure to reach WhatsApp's network — see WhatsApp/Meta's policies for their handling.",
            "We recommend not sending highly sensitive data (passwords, payment credentials, ID numbers) over the Service.",
            "Audit and API logs exclude secrets and are limited to metadata, not message bodies.",
          ]}
        />
      </LegalSection>

      <LegalSection id="use" index={5} heading="How we use data">
        <LegalList
          items={[
            "Operate, maintain and secure the Service — authentication, sessions, delivery, webhooks, automations.",
            "Enforce plan limits, rate limits and anti-abuse monitoring.",
            "Debug, troubleshoot and improve reliability and features.",
            "Send service communications: security notices, product updates, billing/plan changes.",
            "Comply with legal obligations and respond to valid law-enforcement requests.",
          ]}
        />
        <p>
          We do <strong>not</strong> sell personal data, rent contact lists, or
          use your messages to train advertising models.
        </p>
      </LegalSection>

      <LegalSection id="legal-bases" index={6} heading="Legal bases for processing">
        <LegalList
          items={[
            "Contract — providing the Service you signed up for.",
            "Legitimate interests — security, anti-abuse monitoring, reliability improvements.",
            "Legal obligation — records required by law, and responses to lawful requests.",
            "Consent — where required (e.g. optional analytics or marketing emails you opt into).",
          ]}
        />
      </LegalSection>

      <LegalSection id="sharing" index={7} heading="Sharing & subprocessors">
        <p>We share data only with the categories needed to run the Service:</p>
        <LegalList
          items={[
            "Infrastructure providers — VPS/cloud hosting, database and queue infrastructure hosting our systems.",
            "WhatsApp/Meta — strictly as needed to deliver messages and maintain sessions.",
            "Operational tooling — error monitoring and email delivery (minimal data).",
            "Legal — when compelled by a valid legal request or to protect the platform and users from abuse.",
          ]}
        />
        <p>
          We do not share your data with data brokers, advertisers, or other
          FomoBot customers.
        </p>
      </LegalSection>

      <LegalSection id="security" index={8} heading="Security measures">
        <LegalList
          items={[
            "Encryption in transit (TLS) and encryption at rest for session credentials.",
            "Hashed passwords and hashed API keys — secrets are never stored or logged in plaintext.",
            "Tenant isolation: organization-scoped access with role-based permissions and object-level checks.",
            "Request IDs, audit logs and security events for traceability.",
            "See our Security page for architecture details and responsible-disclosure instructions.",
          ]}
        />
        <LegalNote title="Your part matters">
          <p>
            Most breaches we see start with a leaked API key or a weak password.
            Rotate keys, use strong unique passwords, limit scopes, and restrict
            key access to the smallest group of people.
          </p>
        </LegalNote>
      </LegalSection>

      <LegalSection id="retention" index={9} heading="Retention & deletion">
        <LegalList
          items={[
            "Account and org data: retained while your account is active.",
            "Session credentials: destroyed on logout, bot deletion or account deletion.",
            "Messages, contacts and conversations: retained until you delete them or your account; soft-deleted records are purged on a schedule.",
            "API and event logs: kept for the log-retention window of your plan (default 30 days) then purged.",
            "Backup cycles mean deleted data may persist briefly in backups before being overwritten.",
          ]}
        />
      </LegalSection>

      <LegalSection id="rights" index={10} heading="Your rights">
        <p>Depending on your jurisdiction (including GDPR and equivalents), you may:</p>
        <LegalList
          items={[
            "Access, correct or export your personal data.",
            "Request deletion of your account and associated personal data.",
            "Object to or restrict certain processing.",
            "Withdraw consent where processing is consent-based.",
            "Lodge a complaint with your local data-protection authority.",
          ]}
        />
        <p>
          Exercise these via <Link href="/contact" className="text-foreground underline underline-offset-2">contact</Link>{" "}
          or <strong>privacy@fomobot.dev</strong>. We verify identity before
          fulfilling requests.
        </p>
      </LegalSection>

      <LegalSection id="cookies" index={11} heading="Cookies & tracking">
        <p>
          We use only what&apos;s needed to run the app: authentication/session
          cookies, CSRF tokens, and preferences like theme. We do not use
          third-party advertising trackers. Essential cookies can&apos;t be
          disabled without breaking sign-in.
        </p>
      </LegalSection>

      <LegalSection id="transfers" index={12} heading="International transfers">
        <p>
          Your data is processed where our infrastructure and subprocessors
          operate. Where required, cross-border transfers are protected by
          appropriate safeguards (such as standard contractual clauses or
          equivalent measures).
        </p>
      </LegalSection>

      <LegalSection id="children" index={13} heading="Children's privacy">
        <p>
          FomoBot is a business tool and is not directed at children. We do not
          knowingly collect personal data from anyone under 18. If you believe a
          child has provided data, contact us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection id="changes" index={14} heading="Changes to this policy">
        <p>
          We may update this policy as the Service evolves. Material changes
          will be announced in the dashboard or by email before they take
          effect; the &quot;Last updated&quot; date reflects the current
          version. Continued use after changes means acceptance.
        </p>
      </LegalSection>

      <LegalSection id="contact" index={15} heading="Contact & data requests">
        <LegalList
          items={[
            <span key="privacy">Privacy requests &amp; data questions: <strong>privacy@fomobot.dev</strong></span>,
            <span key="security">Security issues &amp; responsible disclosure: <strong>security@fomobot.dev</strong></span>,
            <span key="legal">Legal questions: <strong>legal@fomobot.dev</strong></span>,
            <span key="page">Or use the <Link href="/contact" className="text-foreground underline underline-offset-2">contact page</Link>.</span>,
          ]}
        />
      </LegalSection>
    </LegalPage>
  )
}
