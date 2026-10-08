"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "cn"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Loading03Icon,
  Mail01Icon,
  MailCheckIcon,
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
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [sentTo, setSentTo] = React.useState<string>()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isLoading) return

    const email = String(new FormData(event.currentTarget).get("email") ?? "")
    setIsLoading(true)
    // TODO: wire up real password reset
    setTimeout(() => {
      setIsLoading(false)
      setSentTo(email)
    }, 1500)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-2xl shadow-2xl shadow-primary/10">
        {sentTo ? (
          <>
            <CardHeader className="items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <HugeiconsIcon
                  icon={MailCheckIcon}
                  strokeWidth={2}
                  className="size-6"
                />
              </div>
              <CardTitle className="text-xl">Check your inbox</CardTitle>
              <CardDescription>
                We&apos;ve sent a password reset link to{" "}
                <span className="font-medium text-foreground">{sentTo}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSentTo(undefined)}
                  >
                    Didn&apos;t get it? Resend
                  </Button>
                </Field>
              </FieldGroup>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Forgot password?</CardTitle>
              <CardDescription>
                No worries — enter your email and we&apos;ll send you a reset
                link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
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
                          Sending link…
                        </>
                      ) : (
                        "Send reset link"
                      )}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </>
        )}
      </Card>
      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 self-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
        Back to sign in
      </Link>
    </div>
  )
}
