"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "cn"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Building02Icon,
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
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

import { useAuth } from "@/lib/auth"
import { errorMessage, fieldErrors } from "@/lib/api/client"

const schema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    organization_name: z.string().optional(),
    email: z.email("Enter a valid email address"),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirm: z.string(),
    terms: z.boolean().refine((v) => v === true, "You must accept the terms to continue"),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  })

type FormValues = z.infer<typeof schema>

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const { register: registerAccount } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)
  const [formError, setFormError] = React.useState<string>()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { terms: false },
  })

  async function onSubmit(values: FormValues) {
    setFormError(undefined)
    try {
      const [first_name, ...rest] = values.name.trim().split(" ")
      await registerAccount({
        email: values.email,
        password: values.password,
        first_name,
        last_name: rest.join(" "),
        organization_name: values.organization_name || undefined,
      })
      router.push("/dashboard")
    } catch (e) {
      const fe = fieldErrors(e)
      if (fe.email) setError("email", { message: fe.email })
      if (fe.password) setError("password", { message: fe.password })
      setFormError(
        fe.email || fe.password
          ? undefined
          : errorMessage(e, "Could not create your account. Please try again.")
      )
    }
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
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              {formError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="name">Full name</FieldLabel>
                <div className="relative">
                  <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="ps-9"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    disabled={isSubmitting}
                    {...register("name")}
                  />
                </div>
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="organization_name">
                  Organization <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <div className="relative">
                  <HugeiconsIcon icon={Building02Icon} strokeWidth={2} className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="organization_name"
                    placeholder="Acme Technologies"
                    className="ps-9"
                    autoComplete="organization"
                    disabled={isSubmitting}
                    {...register("organization_name")}
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <div className="relative">
                  <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="ps-9"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    disabled={isSubmitting}
                    {...register("email")}
                  />
                </div>
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <HugeiconsIcon icon={LockIcon} strokeWidth={2} className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="ps-9 pe-10"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    disabled={isSubmitting}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute end-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <HugeiconsIcon icon={showPassword ? EyeOffIcon : EyeIcon} strokeWidth={2} className="size-4" />
                  </button>
                </div>
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm">Confirm password</FieldLabel>
                <div className="relative">
                  <HugeiconsIcon icon={LockIcon} strokeWidth={2} className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="ps-9"
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirm}
                    disabled={isSubmitting}
                    {...register("confirm")}
                  />
                </div>
                {errors.confirm ? (
                  <FieldError>{errors.confirm.message}</FieldError>
                ) : (
                  <FieldDescription>Must be at least 10 characters long.</FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="terms"
                    checked={watch("terms")}
                    onCheckedChange={(v) =>
                      setValue("terms", v === true, { shouldValidate: true })
                    }
                    disabled={isSubmitting}
                    aria-invalid={!!errors.terms}
                  />
                  <label htmlFor="terms" className="text-sm leading-snug text-muted-foreground">
                    I agree to the{" "}
                    <a href="#" className="text-foreground underline underline-offset-4">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-foreground underline underline-offset-4">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.terms && <FieldError>{errors.terms.message}</FieldError>}
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting} className="shadow-lg shadow-primary/25">
                  {isSubmitting ? (
                    <>
                      <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
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
    </div>
  )
}
