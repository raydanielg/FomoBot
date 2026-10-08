"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "cn"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  Loading03Icon,
  LockIcon,
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

import { accountApi } from "@/lib/api/resources"
import { errorMessage } from "@/lib/api/client"

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  })

type FormValues = z.infer<typeof schema>

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const params = useSearchParams()
  const uid = params.get("uid") ?? ""
  const token = params.get("token") ?? ""

  const [done, setDone] = React.useState(false)
  const [formError, setFormError] = React.useState<string>()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setFormError(undefined)
    try {
      await accountApi.confirmReset({ uid, token, new_password: values.password })
      setDone(true)
    } catch (e) {
      setFormError(
        errorMessage(e, "This reset link is invalid or has expired. Request a new one.")
      )
    }
  }

  const invalidLink = !uid || !token

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-2xl shadow-2xl shadow-primary/10">
        {done ? (
          <>
            <CardHeader className="items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary-foreground">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-6" />
              </div>
              <CardTitle className="text-xl">Password updated</CardTitle>
              <CardDescription>
                Your password has been reset. You can now sign in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button render={<Link href="/login" />} className="w-full">
                Back to sign in
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Set a new password</CardTitle>
              <CardDescription>
                Choose a strong password for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invalidLink ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  This reset link is invalid.{" "}
                  <Link href="/forgot-password" className="underline">
                    Request a new one
                  </Link>
                  .
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <FieldGroup>
                    {formError && (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {formError}
                      </div>
                    )}
                    <Field>
                      <FieldLabel htmlFor="password">New password</FieldLabel>
                      <div className="relative">
                        <HugeiconsIcon icon={LockIcon} strokeWidth={2} className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="ps-9"
                          autoComplete="new-password"
                          aria-invalid={!!errors.password}
                          disabled={isSubmitting}
                          {...register("password")}
                        />
                      </div>
                      {errors.password && (
                        <FieldError>{errors.password.message}</FieldError>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirm">Confirm password</FieldLabel>
                      <div className="relative">
                        <HugeiconsIcon icon={LockIcon} strokeWidth={2} className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirm"
                          type="password"
                          placeholder="••••••••"
                          className="ps-9"
                          autoComplete="new-password"
                          aria-invalid={!!errors.confirm}
                          disabled={isSubmitting}
                          {...register("confirm")}
                        />
                      </div>
                      {errors.confirm && (
                        <FieldError>{errors.confirm.message}</FieldError>
                      )}
                    </Field>
                    <Field>
                      <Button type="submit" disabled={isSubmitting} className="shadow-lg shadow-primary/25">
                        {isSubmitting ? (
                          <>
                            <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                            Updating…
                          </>
                        ) : (
                          "Reset password"
                        )}
                      </Button>
                    </Field>
                  </FieldGroup>
                </form>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
