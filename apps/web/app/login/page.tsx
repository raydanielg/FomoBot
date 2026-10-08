import { AuthShell } from "@/components/auth-shell"
import { LoginForm } from "@/components/login-form"

export const metadata = {
  title: "Sign in — Fomobot",
}

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  )
}
