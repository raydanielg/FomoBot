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
  title: "Terms of Service — FomoBot",
  description:
    "The agreement governing your use of FomoBot: WhatsApp session hosting, the messaging API, webhooks, automations and the team inbox.",
  path: "/terms",
})

const TOC = [
  { id: "agreement", label: "1. Agreement" },
  { id: "service", label: "2. The service" },
  { id: "accounts", label: "3. Accounts & security" },
  { id: "acceptable-use", label: "4. Acceptable use" },
  { id: "whatsapp", label: "5. WhatsApp compliance" },
  { id: "consent", label: "6. Consent & opt-in" },
  { id: "prohibited-content", label: "7. Prohibited content" },
  { id: "api", label: "8. API & rate limits" },
  { id: "plans", label: "9. Plans & pricing" },
  { id: "ip", label: "10. Intellectual property" },
  { id: "termination", label: "11. Suspension & termination" },
  { id: "disclaimers", label: "12. Disclaimers" },
  { id: "liability", label: "13. Limitation of liability" },
  { id: "indemnity", label: "14. Indemnification" },
  { id: "changes", label: "15. Changes to terms" },
  { id: "law", label: "16. Governing law" },
  { id: "contact", label: "17. Contact & abuse reports" },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="The rules of the road for FomoBot — WhatsApp bots, the messaging API, webhooks and automations."
      intro="These terms form a binding agreement between you (and the organization you represent) and FomoBot. By creating an account, connecting a WhatsApp number, or calling our API, you accept them in full. If you do not agree, do not use the service."
      path="/terms"
      updated="October 2026"
      toc={TOC}
    >
      <LegalSection id="agreement" index={1} heading="Agreement to these terms">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of
          FomoBot (the &quot;Service&quot;), operated by FomoBot (&quot;we&quot;,
          &quot;us&quot;). The Service includes hosted WhatsApp bot sessions, a
          REST API, webhook delivery, automations, templates, a team inbox, and
          related tooling.
        </p>
        <p>
          If you register on behalf of an organization, you confirm you are
          authorized to bind that organization, and &quot;you&quot; refers to it.
          You must be at least 18 years old or the age of legal majority in your
          jurisdiction.
        </p>
      </LegalSection>

      <LegalSection id="service" index={2} heading="The service">
        <p>
          FomoBot lets you connect a WhatsApp number to a hosted bot, send and
          receive messages through our API, receive webhook events, and manage
          conversations from a shared inbox. The Service is currently offered
          <strong> free of charge in beta</strong> — we may introduce paid plans
          with reasonable notice, and plan limits are enforced per your tier.
        </p>
        <p>
          FomoBot is an infrastructure provider. We are <strong>not</strong> a
          party to your conversations, and we do not send messages on your
          behalf — your bots act on your instructions via the API and
          automations you configure.
        </p>
      </LegalSection>

      <LegalSection id="accounts" index={3} heading="Accounts, API keys & security">
        <LegalList
          items={[
            "You must provide accurate registration information and keep it current.",
            "You are responsible for everything done with your account, organization, API keys and bot sessions — including actions by your members and integrations.",
            "API keys are secrets: store them server-side, rotate them when exposed, and never embed them in client-side code or public repositories.",
            "You must notify us immediately of any unauthorized use or credential compromise.",
            "We may require verification and may refuse or reclaim usernames, slugs or organization names that infringe rights or mislead.",
          ]}
        />
      </LegalSection>

      <LegalSection id="acceptable-use" index={4} heading="Acceptable Use Policy">
        <p>
          FomoBot exists to help legitimate businesses talk to their own
          customers. The following are <strong>strictly prohibited</strong>:
        </p>
        <LegalList
          tone="ban"
          items={[
            "Spam or unsolicited bulk messaging of any kind — including purchased, scraped or rented contact lists.",
            "Messaging numbers that have not given you valid opt-in consent to be contacted.",
            "Harassment, threats, intimidation, stalking, or any content that violates a person's dignity.",
            "Fraud, phishing, social engineering, impersonation, or messages designed to steal credentials or money.",
            "Circumventing WhatsApp's limits, anti-spam systems, quality ratings, bans or reporting mechanisms — including rotating numbers to evade enforcement.",
            "Using the Service to promote or facilitate illegal goods or services.",
            "Reverse engineering, probing, scanning, or attempting to breach the platform, its APIs, or other tenants' data.",
            "Reselling, sublicensing or white-labeling the Service without written permission.",
            "Running automated campaigns that generate complaints, blocks or report rates that endanger the platform.",
            "Any activity violating applicable law, including telecommunications, privacy and anti-spam law (e.g. GDPR, TCPA, CAN-SPAM, local equivalents).",
          ]}
        />
        <LegalWarning title="Zero-tolerance enforcement">
          <p>
            Abuse is not a grey area. We monitor complaint signals, delivery
            failure rates and platform reports. Suspected violations may result
            in <strong>immediate session disconnection and account suspension
            without prior warning</strong>. Serious or repeated abuse leads to
            permanent termination and, where required, referral to law
            enforcement. There is no refund of unused service.
          </p>
        </LegalWarning>
      </LegalSection>

      <LegalSection id="whatsapp" index={5} heading="WhatsApp platform compliance">
        <p>
          The Service connects through the WhatsApp platform and related
          technologies. You must comply at all times with the{" "}
          <strong>WhatsApp Terms of Service, Business Messaging Policy and
          Messaging Guidelines</strong>, as updated by Meta.
        </p>
        <LegalList
          items={[
            "You are solely responsible for the WhatsApp accounts and numbers you connect, and for ensuring you own or are authorized to use them.",
            "A WhatsApp ban, restriction or quality downgrade applied to your number is your responsibility — FomoBot cannot appeal, prevent or reverse Meta's enforcement.",
            "Do not connect stolen, unauthorized, rented or shared phone numbers.",
            "FomoBot is independent and is not affiliated with, endorsed by, or sponsored by Meta or WhatsApp.",
          ]}
        />
      </LegalSection>

      <LegalSection id="consent" index={6} heading="Consent & opt-in messaging">
        <p>
          You may only message people who have given you valid, specific and
          revocable consent to receive messages on WhatsApp. Consent must be
          recorded and provable.
        </p>
        <LegalList
          items={[
            "Honor opt-outs immediately and permanently — when someone says \"stop\", you stop.",
            "Do not infer consent from purchases, app installs or imported lists without an explicit opt-in.",
            "Transactional or service messages still require the recipient's prior consent to WhatsApp contact.",
            "Templates and automations must not disguise marketing as service messages.",
          ]}
        />
      </LegalSection>

      <LegalSection id="prohibited-content" index={7} heading="Prohibited content">
        <p>You may not use FomoBot to create, transmit or store content that:</p>
        <LegalList
          tone="ban"
          items={[
            "Depicts or facilitates child exploitation or sexual abuse — reported immediately to authorities.",
            "Promotes terrorism, extremist violence, or hate against protected groups.",
            "Sells or promotes weapons, illicit drugs, human trafficking, or other regulated illegal trade.",
            "Contains malware, viruses, or links designed to harm recipients or their devices.",
            "Infringes copyrights, trademarks, or other intellectual property rights.",
            "Constitutes pornography or adult content where prohibited by law or by WhatsApp policy.",
            "Interferes with elections or spreads coordinated disinformation.",
          ]}
        />
      </LegalSection>

      <LegalSection id="api" index={8} heading="API usage, limits & fair use">
        <LegalList
          items={[
            "Rate limits, quotas and plan limits are technical boundaries — you may not attempt to bypass them, including by creating multiple accounts.",
            "You may not benchmark, flood or load-test the platform without written consent.",
            "API credentials are scoped per organization — attempting to access another tenant's data, sessions or endpoints is prohibited and grounds for termination.",
            "Webhooks you register must be endpoints you control; do not point them at third parties without authorization.",
          ]}
        />
      </LegalSection>

      <LegalSection id="plans" index={9} heading="Plans, limits & future pricing">
        <p>
          The Service is currently free under the FREE plan, with published
          limits on bots, members, message volume, API rate, webhooks and
          automation rules. We may introduce paid plans; material changes to
          pricing will be announced in advance. Continued use after a change
          takes effect constitutes acceptance.
        </p>
        <p>
          Exceeding plan limits may result in queued messages being dropped,
          API requests being throttled, or features being restricted until the
          plan is upgraded or the period resets.
        </p>
      </LegalSection>

      <LegalSection id="ip" index={10} heading="Intellectual property">
        <p>
          We own the Service, the FomoBot brand, and all software and
          documentation we provide. You own your data, your message content and
          your organization&apos;s materials. You grant us a limited license to
          host, process and transmit your content solely as needed to provide
          the Service.
        </p>
        <p>
          Feedback you send us may be used without restriction. You may not
          copy, resell, or create derivative works of the Service itself.
        </p>
      </LegalSection>

      <LegalSection id="termination" index={11} heading="Suspension & termination">
        <LegalList
          items={[
            "You may stop using the Service and delete your account at any time.",
            "We may suspend or terminate access immediately for violation of these Terms, abusive behavior, security risk, or legal requirement — with or without notice.",
            "On termination: bot sessions disconnect, session credentials are destroyed, and data is handled per our Privacy Policy.",
            "WhatsApp-side bans or invalidation of your sessions by the platform may also disconnect your bots; we are not liable for provider enforcement.",
          ]}
        />
      </LegalSection>

      <LegalSection id="disclaimers" index={12} heading="Disclaimers">
        <p>
          THE SERVICE IS PROVIDED <strong>&quot;AS IS&quot;</strong> AND
          <strong> &quot;AS AVAILABLE&quot;</strong>, WITHOUT WARRANTIES OF ANY
          KIND — express, implied or statutory — including merchantability,
          fitness for a particular purpose, non-infringement, and uninterrupted
          or error-free operation. We do not guarantee uptime, message delivery,
          delivery latency, or that WhatsApp will remain reachable.
        </p>
      </LegalSection>

      <LegalSection id="liability" index={13} heading="Limitation of liability">
        <p>
          To the maximum extent permitted by law, FomoBot and its operators will
          not be liable for indirect, incidental, special, consequential or
          punitive damages — including lost profits, lost messages, lost data,
          WhatsApp account bans, or business interruption — arising from or
          related to the Service.
        </p>
        <p>
          Our total aggregate liability for any claim is limited to the greater
          of the amount you paid us in the 12 months preceding the claim or
          <strong> USD 100</strong>. Some jurisdictions do not allow these
          limits, in which case they apply to the fullest extent allowed.
        </p>
      </LegalSection>

      <LegalSection id="indemnity" index={14} heading="Indemnification">
        <p>
          You agree to indemnify and hold harmless FomoBot, its owners and
          operators from claims, damages, fines and expenses (including
          reasonable legal fees) arising out of your use of the Service, your
          message content, your violation of these Terms, your violation of
          WhatsApp&apos;s policies, or your infringement of any third
          party&apos;s rights — including recipients&apos; claims that you
          messaged them without consent.
        </p>
      </LegalSection>

      <LegalSection id="changes" index={15} heading="Changes to these terms">
        <p>
          We may update these Terms as the Service evolves. Material changes
          will be announced through the dashboard or email before taking effect;
          the &quot;Last updated&quot; date reflects the current version.
          Continued use after changes means acceptance. If you disagree, stop
          using the Service and delete your account.
        </p>
      </LegalSection>

      <LegalSection id="law" index={16} heading="Governing law & disputes">
        <p>
          These Terms are governed by the laws of the jurisdiction in which
          FomoBot is established, excluding conflict-of-law rules. Disputes will
          be resolved in the courts of that jurisdiction unless mandatory
          consumer law provides otherwise. If any provision is unenforceable,
          the remainder stays in effect. Our failure to enforce a provision is
          not a waiver.
        </p>
      </LegalSection>

      <LegalSection id="contact" index={17} heading="Contact & abuse reports">
        <LegalList
          items={[
            <span key="legal">Legal &amp; terms questions: <strong>legal@fomobot.dev</strong></span>,
            <span key="abuse">Report abuse of the platform (spam, harassment, phishing): <strong>abuse@fomobot.dev</strong></span>,
            <span key="privacy">Privacy requests: <strong>privacy@fomobot.dev</strong></span>,
            <span key="page">You can also reach us via the <Link href="/contact" className="text-foreground underline underline-offset-2">contact page</Link>.</span>,
          ]}
        />
        <LegalNote title="Good-faith use">
          <p>
            The vast majority of customers use FomoBot responsibly — building
            support inboxes, notifications and automations their customers
            actually want. These rules exist so abusers cannot ruin the
            platform for everyone else.
          </p>
        </LegalNote>
      </LegalSection>
    </LegalPage>
  )
}
