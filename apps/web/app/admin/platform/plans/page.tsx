"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "sonner"

import { errorMessage } from "@/lib/api/client"
import { useAdminPlans, useAdminUpdatePlan } from "@/hooks/admin"

const LIMIT_KEYS = ["max_bots", "messages_per_day", "api_requests_per_minute", "webhooks", "automations", "team_members", "contacts"]

export default function AdminPlansPage() {
  const plans = useAdminPlans()
  const updatePlan = useAdminUpdatePlan()
  const [edits, setEdits] = React.useState<Record<string, Record<string, string>>>({})

  return (
    <AdminShell crumbs={["Platform", "Plans"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Plans & limits"
          description="Edit what each plan can do. Changes take effect immediately."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)
            : plans.data?.results.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader className="flex-row items-center justify-between">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription className="font-mono uppercase">{plan.code}</CardDescription>
                    </div>
                    {plan.code === "free" && <Badge variant="outline">active</Badge>}
                  </CardHeader>
                  <CardContent className="grid gap-2.5">
                    {LIMIT_KEYS.map((k) => (
                      <div key={k} className="flex items-center justify-between gap-2 text-sm">
                        <span className="text-muted-foreground">{k.replace(/_/g, " ")}</span>
                        <Input
                          type="number"
                          className="h-8 w-24 text-end font-mono text-xs"
                          value={edits[plan.id]?.[k] ?? plan.limits?.[k] ?? ""}
                          onChange={(e) =>
                            setEdits((p) => ({
                              ...p,
                              [plan.id]: { ...(p[plan.id] ?? {}), [k]: e.target.value },
                            }))
                          }
                        />
                      </div>
                    ))}
                    <Button
                      size="sm"
                      className="mt-2"
                      disabled={!edits[plan.id] || updatePlan.isPending}
                      onClick={() =>
                        updatePlan.mutate(
                          {
                            id: plan.id,
                            limits: Object.fromEntries(
                              Object.entries(edits[plan.id] ?? {}).map(([k, v]) => [k, Number(v)])
                            ),
                          },
                          {
                            onSuccess: () => {
                              toast.success(`${plan.name} limits updated`)
                              setEdits((p) => { const n = { ...p }; delete n[plan.id]; return n })
                            },
                            onError: (e) => toast.error(errorMessage(e)),
                          }
                        )
                      }
                    >
                      Save limits
                    </Button>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </AdminShell>
  )
}
