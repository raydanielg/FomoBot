"use client"

import Link from "next/link"

import { DashboardShell } from "@/components/dashboard-shell"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  BubbleChatIcon,
  Contact01Icon,
  InboxIcon,
  Robot01Icon,
  SentIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons"
import {
  Avatar,
  AvatarFallback,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

import { useAuth } from "@/lib/auth"
import {
  useBots,
  useConversations,
  useMessageStats,
  useOverview,
} from "@/hooks/api"
import { botStatusMeta, timeAgo } from "@/lib/format"

const statIcons = [SentIcon, InboxIcon, Robot01Icon, Contact01Icon]

export default function Page() {
  const { user } = useAuth()
  const overview = useOverview()
  const stats = useMessageStats(14)
  const bots = useBots({ page_size: 5 })
  const conversations = useConversations({ page_size: 5 })

  const o = overview.data
  const kpis = [
    {
      title: "Connected bots",
      value: o ? `${o.bots.connected}/${o.bots.total}` : "—",
      hint: "WhatsApp sessions live",
    },
    {
      title: "Messages",
      value: o ? o.messages.total.toLocaleString() : "—",
      hint: "all time",
    },
    {
      title: "Open conversations",
      value: o ? o.conversations.open.toLocaleString() : "—",
      hint: `${o?.conversations.unread ?? 0} unread`,
    },
    {
      title: "Delivery rate",
      value: o?.messages.delivery_rate != null ? `${o.messages.delivery_rate}%` : "—",
      hint: "outbound delivered/read",
    },
  ]

  const days = stats.data ?? []
  const max = Math.max(1, ...days.map((d) => d.inbound + d.outbound))
  const noBots = bots.data && bots.data.count === 0

  return (
    <DashboardShell crumb="Overview">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Good evening{user?.first_name ? `, ${user.first_name}` : ""}
            </h1>
            <p className="text-sm text-muted-foreground">
              Here&apos;s what&apos;s happening with your Fomobot workspace.
            </p>
          </div>
          <Button render={<Link href="/dashboard/bots" />} size="sm">
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
            New bot
          </Button>
        </div>

        {noBots ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15">
                <HugeiconsIcon
                  icon={WhatsappIcon}
                  strokeWidth={1.5}
                  className="size-7 text-primary-foreground"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Connect your first WhatsApp</h2>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Create a bot and connect your WhatsApp account using a QR
                  code. You&apos;ll be sending messages in minutes.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button render={<Link href="/dashboard/bots/new" />}>
                  Connect WhatsApp
                </Button>
                <Button variant="outline" render={<Link href="/dashboard/api/docs" />}>
                  Explore documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kpis.map((stat, i) => (
                <div
                  key={stat.title}
                  className="rounded-2xl bg-muted/40 p-5 transition-colors hover:bg-muted/60"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
                    <HugeiconsIcon
                      icon={statIcons[i]!}
                      strokeWidth={2}
                      className="size-5 text-primary-foreground"
                    />
                  </div>
                  {overview.isLoading ? (
                    <Skeleton className="mt-5 h-7 w-20" />
                  ) : (
                    <div className="mt-5 text-2xl font-semibold tracking-tight">
                      {stat.value}
                    </div>
                  )}
                  <div className="mt-0.5 text-sm text-muted-foreground">
                    {stat.title}
                    <span className="text-muted-foreground/60"> · {stat.hint}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Message volume</CardTitle>
                  <CardDescription>
                    Inbound vs. outbound — last 14 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.isLoading ? (
                    <Skeleton className="h-48 w-full" />
                  ) : days.length === 0 ? (
                    <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                      No message activity yet
                    </div>
                  ) : (
                    <div className="flex h-48 items-end gap-1.5">
                      {days.map((d) => (
                        <div
                          key={d.day}
                          className="group flex flex-1 flex-col items-center gap-1.5"
                          title={`${d.day}: ${d.inbound} in / ${d.outbound} out`}
                        >
                          <div className="flex w-full flex-1 items-end gap-0.5">
                            <div
                              className="flex-1 rounded-t-sm bg-primary/80 transition-colors group-hover:bg-primary"
                              style={{ height: `${Math.max(4, (d.inbound / max) * 100)}%` }}
                            />
                            <div
                              className="flex-1 rounded-t-sm bg-primary/30 transition-colors group-hover:bg-primary/50"
                              style={{ height: `${Math.max(4, (d.outbound / max) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {d.day.slice(5)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent conversations</CardTitle>
                    <CardDescription>Latest WhatsApp activity</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    render={<Link href="/dashboard/inbox" />}
                  >
                    View all
                  </Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {conversations.isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton className="size-9 rounded-full" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 w-28" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      ))
                    : (conversations.data?.results ?? []).map((c) => {
                        const contact =
                          typeof c.contact === "object" ? c.contact : null
                        const name =
                          contact?.name || contact?.profile_name || contact?.phone_number || "Unknown"
                        return (
                          <Link
                            key={c.id}
                            href={`/dashboard/inbox/${c.id}`}
                            className="flex items-center gap-3 rounded-lg p-1 -m-1 transition-colors hover:bg-muted/50"
                          >
                            <Avatar>
                              <AvatarFallback>
                                {name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate text-sm font-medium">
                                {name}
                              </span>
                              <span className="truncate text-xs text-muted-foreground">
                                {c.last_message?.text || "No messages yet"}
                              </span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs text-muted-foreground">
                                {timeAgo(c.last_message_at)}
                              </span>
                              {c.unread_count > 0 && (
                                <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                  {c.unread_count}
                                </span>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                  {!conversations.isLoading &&
                    conversations.data?.results.length === 0 && (
                      <p className="py-6 text-center text-sm text-muted-foreground">
                        No conversations yet. They&apos;ll appear once your bot
                        starts chatting.
                      </p>
                    )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Your bots</CardTitle>
                  <CardDescription>Connection status at a glance</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link href="/dashboard/bots" />}
                >
                  View all
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col">
                {bots.isLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="mb-3 h-12 w-full" />
                    ))
                  : (bots.data?.results ?? []).map((b) => {
                      const meta = botStatusMeta(b.connection_status)
                      return (
                        <Link
                          key={b.id}
                          href={`/dashboard/bots/${b.id}`}
                          className="flex items-center gap-3 rounded-lg px-2 py-2.5 -mx-2 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                            <HugeiconsIcon
                              icon={Robot01Icon}
                              strokeWidth={2}
                              className="size-4.5 text-muted-foreground"
                            />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-sm font-medium">
                              {b.name}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {b.phone_number || "Not connected"}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn("gap-1.5", meta.className)}
                          >
                            <span className={cn("size-1.5 rounded-full", meta.dot)} />
                            {meta.label}
                          </Badge>
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            strokeWidth={2}
                            className="size-4 text-muted-foreground"
                          />
                        </Link>
                      )
                    })}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardShell>
  )
}
