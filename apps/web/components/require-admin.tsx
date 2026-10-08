"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Button } from "@workspace/ui/components/button"

import { useAuth } from "@/lib/auth"

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/login")
    }
  }, [ready, authenticated, router])

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-svh flex-col gap-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!user?.is_platform_admin) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="font-mono text-sm text-muted-foreground">403</p>
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This area is restricted to FomoBot platform administrators.
        </p>
        <Button variant="outline" render={<Link href="/dashboard" />}>
          Back to dashboard
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
