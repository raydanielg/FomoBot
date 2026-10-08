"use client"

import * as React from "react"

import { DashboardShell } from "@/components/dashboard-shell"
import { CopyButton } from "@/components/copy-button"
import { EmptyState, PageHeader } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon, SearchIcon } from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { cn } from "@workspace/ui/lib/utils"

import { timeAgo } from "@/lib/format"
import { useApiRequestLogs, useEventLogs } from "@/hooks/api"
import type { ApiRequestLog } from "@/types/api"

function statusColor(code: number) {
  if (code >= 500) return "text-destructive"
  if (code >= 400) return "text-amber-500"
  return "text-primary-foreground"
}

export default function LogsPage() {
  const [tab, setTab] = React.useState("api")
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("")
  const [method, setMethod] = React.useState("")
  const [detail, setDetail] = React.useState<ApiRequestLog | null>(null)
  const [page, setPage] = React.useState(1)

  const logs = useApiRequestLogs({
    search: search || undefined,
    status_code: statusFilter || undefined,
    method: method || undefined,
    page,
  })
  const events = useEventLogs({ page })

  const rows = logs.data?.results ?? []

  return (
    <DashboardShell crumb="Logs">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Logs"
          description="Every API request and event processed for your workspace."
          actions={
            <div className="relative">
              <HugeiconsIcon icon={SearchIcon} strokeWidth={2} className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search request ID…"
                className="w-52 ps-8"
              />
            </div>
          }
        />

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="api">API requests</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "api" && (
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "")}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="200">200 OK</SelectItem>
                <SelectItem value="201">201 Created</SelectItem>
                <SelectItem value="400">400 Bad request</SelectItem>
                <SelectItem value="401">401 Unauthorized</SelectItem>
                <SelectItem value="403">403 Forbidden</SelectItem>
                <SelectItem value="500">500 Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={method} onValueChange={(v) => setMethod(v ?? "")}>
              <SelectTrigger className="w-32"><SelectValue placeholder="All methods" /></SelectTrigger>
              <SelectContent>
                {["GET", "POST", "PATCH", "DELETE"].map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {tab === "api" ? (
          logs.isLoading ? (
            <div className="rounded-xl border border-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="m-4 h-10" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <EmptyState
              icon={<HugeiconsIcon icon={File01Icon} strokeWidth={2} className="size-6" />}
              title="No API requests yet"
              description="Calls made with your API keys will show up here."
            />
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((l) => (
                      <TableRow
                        key={l.id}
                        className="cursor-pointer"
                        onClick={() => setDetail(l)}
                      >
                        <TableCell className="text-muted-foreground">
                          {timeAgo(l.created_at)} ago
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {l.request_id.slice(0, 12)}…
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {l.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-56">
                          <span className="block truncate font-mono text-xs">{l.endpoint}</span>
                        </TableCell>
                        <TableCell>
                          <span className={cn("font-mono text-xs", statusColor(l.status_code))}>
                            {l.status_code}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {l.response_ms != null ? `${l.response_ms}ms` : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {(logs.data?.total_pages ?? 1) > 1 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Page {logs.data?.page} of {logs.data?.total_pages}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={page >= (logs.data?.total_pages ?? 1)} onClick={() => setPage((p) => p + 1)}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )
        ) : events.isLoading ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : (events.data?.results ?? []).length === 0 ? (
          <EmptyState
            icon={<HugeiconsIcon icon={File01Icon} strokeWidth={2} className="size-6" />}
            title="No events yet"
            description="System events (message.received, bot.connected…) appear here."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Retries</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(events.data?.results ?? []).map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-muted-foreground">
                      {timeAgo(e.created_at)} ago
                    </TableCell>
                    <TableCell className="font-mono text-xs">{e.event_type}</TableCell>
                    <TableCell className="capitalize">{e.processing_status}</TableCell>
                    <TableCell>{e.retry_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Sheet open={!!detail} onOpenChange={() => setDetail(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-mono text-sm">Request detail</SheetTitle>
            <SheetDescription>
              {detail?.method} {detail?.endpoint}
            </SheetDescription>
          </SheetHeader>
          {detail && (
            <div className="flex flex-col gap-4 px-4 pb-6 text-sm">
              <dl className="grid grid-cols-2 gap-3">
                {[
                  ["Request ID", detail.request_id],
                  ["Status", String(detail.status_code)],
                  ["Duration", detail.response_ms != null ? `${detail.response_ms}ms` : "—"],
                  ["IP", detail.ip_address ?? "—"],
                  ["API key", detail.api_key ?? "session auth"],
                  ["Time", new Date(detail.created_at).toLocaleString()],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-0.5">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="truncate font-mono text-xs">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex gap-2">
                <CopyButton value={detail.request_id} label="Copy request ID" />
              </div>
              {detail.user_agent && (
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">User agent</p>
                  <p className="break-all rounded-lg bg-muted/50 p-2 font-mono text-xs">
                    {detail.user_agent}
                  </p>
                </div>
              )}
              {detail.error_code && (
                <div>
                  <p className="mb-1 text-xs text-destructive">Error</p>
                  <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-2 font-mono text-xs text-destructive">
                    {detail.error_code}
                  </p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </DashboardShell>
  )
}
