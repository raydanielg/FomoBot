import { AuthShell } from "@/components/auth-shell"
import { VerifyEmailCard } from "@/components/verify-email-card"

export const metadata = {
  title: "Verify email — Fomobot",
}

export default function VerifyEmailPage() {
  return (
    <AuthShell>
      <VerifyEmailCard />
    </AuthShell>
  )
}
