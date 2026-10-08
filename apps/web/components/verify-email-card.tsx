"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "cn"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { accountApi } from "@/lib/api/resources"
import { errorMessage } from "@/lib/api/client"

type State = "verifying" | "done" | "error"

export function VerifyEmailCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const params = useSearchParams()
  const [state, setState] = React.useState<State>("verifying")
  const [message, setMessage] = React.useState("")

  React.useEffect(() => {
    const uid = params.get("uid")
    const token = params.get("token")
    if (!uid || !token) {
      setState("error")
      setMessage("This verification link is invalid.")
      return
    }
    accountApi
      .verifyEmail({ uid, token })
      .then(() => setState("done"))
      .catch((e) => {
        setState("error")
        setMessage(
          errorMessage(e, "This verification link is invalid or has expired.")
        )
      })
  }, [params])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-2xl shadow-2xl shadow-primary/10">
        <CardHeader className="items-center text-center">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full",
              state === "done"
                ? "bg-primary/15 text-primary-foreground"
                : state === "error"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground"
            )}
          >
            <HugeiconsIcon
              icon={
                state === "done"
                  ? CheckmarkCircle02Icon
                  : state === "error"
                    ? Alert02Icon
                    : Loading03Icon
              }
              strokeWidth={2}
              className={cn("size-6", state === "verifying" && "animate-spin")}
            />
          </div>
          <CardTitle className="text-xl">
            {state === "done"
              ? "Email verified"
              : state === "error"
                ? "Verification failed"
                : "Verifying your email…"}
          </CardTitle>
          <CardDescription>
            {state === "done"
              ? "Your email address has been confirmed."
              : state === "error"
                ? message
                : "Hold on a second."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            render={<Link href={state === "done" ? "/dashboard" : "/login"} />}
            className="w-full"
            variant={state === "verifying" ? "outline" : "default"}
            disabled={state === "verifying"}
          >
            {state === "done" ? "Go to dashboard" : "Back to sign in"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
