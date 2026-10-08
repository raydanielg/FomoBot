import { AuthShell } from "@/components/auth-shell"
import { SignupForm } from "@/components/signup-form"

export const metadata = {
  title: "Create account — Fomobot",
}

export default function SignupPage() {
  return (
    <AuthShell>
      <SignupForm />
    </AuthShell>
  )
}
