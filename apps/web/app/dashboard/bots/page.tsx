"use client"

import * as React from "react"
import Link from "next/link"

import { DashboardShell } from "@/components/dashboard-shell"
import { EmptyState, PageHeader, StatusDot } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  MoreHorizontalIcon,
  Robot01Icon,
  SearchIcon,
} from "@hugeicons/core-free-icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"
import { toast } from "sonner"

import { useBotMutations, useBots } from "@/hooks/api"
import { botStatusMeta, timeAgo } from "@/lib/format"
import { errorMessage } from "@/lib/api/client"
import type { Bot } from "@/types/api"

export default function BotsPage() {
  const [search, setSearch] = React.useState("")
  const [deleting, setDeleting] = React.useState<Bot | null>(null)
  const bots = useBots({ search: search || undefined })
  const mutations = useBotMutations()

  return (
    <DashboardShell crumb="Bots">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Bots"
          description="Each bot is one WhatsApp connection for your organization."
          actions={
            <>
              <div className="relative">
                <HugeiconsIcon
                  icon={SearchIcon}
                  strokeWidth={2}
                  className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bots…"
                  className="w-44 ps-8"
                />
              </div>
              <Button render={<Link href="/dashboard/bots/new" />}>
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                Create bot
              </Button>
            </>
          }
        />

        {bots.isLoading ? (
          <div className="rounded-xl border border-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="m-4 h-12" />
            ))}
          </div>
        ) : bots.data?.results.length === 0 ? (
          <EmptyState
            icon={<HugeiconsIcon icon={Robot01Icon} strokeWidth={2} className="size-6" />}
            title={search ? "No bots match your search" : "No bots yet"}
            description={
              search
                ? "Try a different name or phone number."
                : "Create a bot and connect your WhatsApp account using a QR code."
            }
            action={
              !search && (
                <Button render={<Link href="/dashboard/bots/new" />}>
                  <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                  Create bot
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last active</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {bots.data?.results.map((bot) => {
                  const meta = botStatusMeta(bot.connection_status)
                  return (
                    <TableRow key={bot.id} className="group">
                      <TableCell>
                        <Link
                          href={`/dashboard/bots/${bot.id}`}
                          className="flex items-center gap-3 font-medium hover:underline"
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                            <HugeiconsIcon
                              icon={Robot01Icon}
                              strokeWidth={2}
                              className="size-4 text-muted-foreground"
                            />
                          </div>
                          {bot.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {bot.phone_number || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("gap-1.5", meta.className)}>
                          <span className={cn("size-1.5 rounded-full", meta.dot)} />
                          {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {bot.last_seen_at ? timeAgo(bot.last_seen_at) + " ago" : "Never"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(bot.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon" aria-label="Bot actions" />
                            }
                          >
                            <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              render={<Link href={`/dashboard/bots/${bot.id}`} />}
                            >
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                mutations.reconnect.mutate(bot.id, {
                                  onSuccess: () => toast.success("Reconnecting…"),
                                  onError: (e) => toast.error(errorMessage(e)),
                                })
                              }
                            >
                              Reconnect
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleting(bot)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes the bot and disconnects its WhatsApp
                session. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() =>
                  deleting &&
                  mutations.remove.mutate(deleting.id, {
                    onSuccess: () => {
                      toast.success("Bot deleted")
                      setDeleting(null)
                    },
                    onError: (e) => toast.error(errorMessage(e)),
                  })
                }
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardShell>
  )
}
