"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { useAuth } from "@/lib/auth"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/login")
    }
  }, [ready, authenticated, router])

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-svh flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-56" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  return <>{children}</>
}
