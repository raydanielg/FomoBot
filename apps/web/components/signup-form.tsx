"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "cn"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  EyeIcon,
  EyeOffIcon,
  Loading03Icon,
  LockIcon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState<string>()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isLoading) return

    const data = new FormData(event.currentTarget)
    if (data.get("password") !== data.get("confirm-password")) {
      setPasswordError("Passwords do not match")
      return
    }
    setPasswordError(undefined)
    setIsLoading(true)
    // TODO: wire up real signup
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-2xl shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Start automating WhatsApp in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full name</FieldLabel>
                <div className="relative">
                  <HugeiconsIcon
                    icon={UserIcon}
                    strokeWidth={2}
                    className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="ps-9"
                    autoComplete="name"
                    required
                    disabled={isLoading}
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <div className="relative">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    strokeWidth={2}
                    className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="ps-9"
                    autoComplete="email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <HugeiconsIcon
                    icon={LockIcon}
                    strokeWidth={2}
                    className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="ps-9 pe-10"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute end-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <HugeiconsIcon
                      icon={showPassword ? EyeOffIcon : EyeIcon}
                      strokeWidth={2}
                      className="size-4"
                    />
                  </button>
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm password
                </FieldLabel>
                <div className="relative">
                  <HugeiconsIcon
                    icon={LockIcon}
                    strokeWidth={2}
                    className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="ps-9"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={isLoading}
                    aria-invalid={!!passwordError}
                  />
                </div>
                {passwordError ? (
                  <FieldError>{passwordError}</FieldError>
                ) : (
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="shadow-lg shadow-primary/25"
                >
                  {isLoading ? (
                    <>
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        strokeWidth={2}
                        className="size-4 animate-spin"
                      />
                      Creating account…
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
