import { AuthShell } from "@/components/auth-shell"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export const metadata = {
  title: "Reset password — Fomobot",
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  )
}
