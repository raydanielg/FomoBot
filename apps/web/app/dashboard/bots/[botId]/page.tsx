"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"

import { DashboardShell } from "@/components/dashboard-shell"
import { StatusDot } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  Loading03Icon,
  Refresh01Icon,
  Robot01Icon,
  Settings05Icon,
  WhatsappIcon,
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { toast } from "sonner"

import { botsApi } from "@/lib/api/resources"
import { errorMessage } from "@/lib/api/client"
import { botStatusMeta, timeAgo } from "@/lib/format"
import { useBot, useBotMutations, useBotStatus } from "@/hooks/api"
import type { QRPayload } from "@/types/api"

function Countdown({ expiresAt }: { expiresAt: string }) {
  const [left, setLeft] = React.useState(0)
  React.useEffect(() => {
    const tick = () =>
      setLeft(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [expiresAt])
  const m = Math.floor(left / 60)
  const s = left % 60
  return (
    <span className={cn("text-xs tabular-nums", left === 0 ? "text-destructive" : "text-muted-foreground")}>
      {left === 0 ? "QR expired" : `Expires in ${m}:${String(s).padStart(2, "0")}`}
    </span>
  )
}

export default function BotDetailPage() {
  const { botId } = useParams<{ botId: string }>()
  const bot = useBot(botId)
  const status = useBotStatus(botId)
  const mutations = useBotMutations()

  const [qr, setQr] = React.useState<QRPayload | null>(null)
  const [confirmDisconnect, setConfirmDisconnect] = React.useState(false)
  const [busy, setBusy] = React.useState<"connect" | "refresh" | null>(null)

  const state = qr?.state ?? status.data?.session_state ?? bot.data?.connection_status ?? "disconnected"
  const isConnected = state === "connected" || state === "authenticated"

  // When status polling reports connected while we're waiting on a QR, sync up.
  React.useEffect(() => {
    const s = status.data?.session_state
    if (s === "connected" || s === "authenticated") {
      setQr(null)
    }
  }, [status.data?.session_state])

  // Keep the QR fresh — real providers rotate the code every ~20s, so a
  // stale QR always shows "invalid QR code" in the WhatsApp scanner.
  React.useEffect(() => {
    if (state !== "qr_required") return
    const refresh = async () => {
      try {
        const payload = await botsApi.qr(botId)
        if (payload.qr) setQr(payload)
      } catch {
        /* keep the last QR on transient errors */
      }
    }
    const t = setInterval(refresh, 12_000)
    return () => clearInterval(t)
  }, [state, botId])

  async function handleConnect() {
    setBusy("connect")
    try {
      const payload = await mutations.connect.mutateAsync(botId)
      setQr(payload)
      status.refetch()
    } catch (e) {
      toast.error(errorMessage(e, "Could not start the connection."))
    } finally {
      setBusy(null)
    }
  }

  async function handleRefreshQr() {
    setBusy("refresh")
    try {
      const payload = await botsApi.qr(botId)
      setQr(payload)
    } catch (e) {
      toast.error(errorMessage(e, "Could not refresh the QR code."))
    } finally {
      setBusy(null)
    }
  }

  if (bot.isLoading) {
    return (
      <DashboardShell crumb="Bot">
        <div className="flex flex-col gap-4 p-6">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardShell>
    )
  }

  if (!bot.data) {
    return (
      <DashboardShell crumb="Bot">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          <p className="font-medium">Bot not found</p>
          <Button variant="outline" render={<Link href="/dashboard/bots" />}>
            Back to bots
          </Button>
        </div>
      </DashboardShell>
    )
  }

  const b = bot.data
  const meta = botStatusMeta(b.connection_status)

  return (
    <DashboardShell crumb={b.name}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
              <HugeiconsIcon icon={Robot01Icon} strokeWidth={1.5} className="size-6 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-semibold tracking-tight">{b.name}</h1>
                <Badge variant="outline" className={cn("gap-1.5", meta.className)}>
                  <span className={cn("size-1.5 rounded-full", meta.dot)} />
                  {meta.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {b.phone_number || "No phone linked"}
                {b.last_connected_at && ` · Last connected ${timeAgo(b.last_connected_at)} ago`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Button variant="outline" onClick={() => setConfirmDisconnect(true)}>
                Disconnect
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() =>
                  mutations.reconnect.mutate(botId, {
                    onError: (e) => toast.error(errorMessage(e)),
                  })
                }
                disabled={mutations.reconnect.isPending}
              >
                Reconnect
              </Button>
            )}
            <Button variant="outline" disabled>
              <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* --- Connection card --- */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={WhatsappIcon} strokeWidth={2} className="size-4 text-primary-foreground" />
                WhatsApp connection
              </CardTitle>
              <CardDescription>
                Link a WhatsApp account to this bot.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state === "qr_required" && qr?.qr ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-xl border border-border bg-white p-4">
                    <QRCodeSVG value={qr.qr} size={208} level="M" />
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <p className="text-sm font-medium">Scan this QR code with WhatsApp</p>
                    <p className="text-xs text-muted-foreground">
                      Open WhatsApp → Settings → Linked devices → Link a device
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <Countdown expiresAt={qr.expires_at} />
                      <button
                        type="button"
                        onClick={handleRefreshQr}
                        disabled={busy === "refresh"}
                        className="inline-flex items-center gap-1 text-xs text-foreground underline underline-offset-4"
                      >
                        <HugeiconsIcon
                          icon={Refresh01Icon}
                          strokeWidth={2}
                          className={cn("size-3", busy === "refresh" && "animate-spin")}
                        />
                        Refresh QR
                      </button>
                    </div>
                    {(qr?.provider ?? "mock") === "mock" && (
                      <button
                        type="button"
                        className="mt-2 text-xs text-muted-foreground underline underline-offset-4"
                        onClick={() =>
                          mutations.simulateScan.mutate(
                            { id: botId },
                            {
                              onSuccess: () => {
                                toast.success("Scan simulated — connecting…")
                                status.refetch()
                              },
                              onError: (e) => toast.error(errorMessage(e)),
                            }
                          )
                        }
                      >
                        Dev: simulate scan
                      </button>
                    )}
                  </div>
                </div>
              ) : state === "connected" ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary/15">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-7 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp connected</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {status.data?.phone_number || b.phone_number || "Session active"}
                    </p>
                  </div>
                </div>
              ) : state === "connecting" || state === "authenticated" || state === "reconnecting" ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-8 animate-spin text-primary-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {state === "reconnecting"
                      ? "Trying to reconnect…"
                      : state === "authenticated"
                        ? "Connecting your WhatsApp…"
                        : "Preparing your WhatsApp connection…"}
                  </p>
                </div>
              ) : state === "error" ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
                    <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-7 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium">We couldn&apos;t connect your WhatsApp</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      The session needs to be reconnected.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleConnect} disabled={busy === "connect"}>
                      {busy === "connect" && (
                        <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                      )}
                      Generate new QR
                    </Button>
                    <Button variant="outline" onClick={() => status.refetch()}>
                      Retry
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                    <HugeiconsIcon icon={WhatsappIcon} strokeWidth={2} className="size-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Your WhatsApp is not connected</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Connect it to start sending and receiving messages.
                    </p>
                  </div>
                  <Button onClick={handleConnect} disabled={busy === "connect"}>
                    {busy === "connect" && (
                      <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                    )}
                    Connect WhatsApp
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* --- Details card --- */}
          <Card>
            <CardHeader>
              <CardTitle>Bot details</CardTitle>
              <CardDescription>How this bot is configured.</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                {[
                  ["Bot ID", b.id],
                  ["Slug", b.slug],
                  ["Phone", b.phone_number || "—"],
                  ["Status", b.status],
                  ["Last seen", b.last_seen_at ? `${timeAgo(b.last_seen_at)} ago` : "Never"],
                  ["Created", new Date(b.created_at).toLocaleDateString()],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-0.5">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="truncate font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              {b.description && (
                <p className="mt-4 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                  {b.description}
                </p>
              )}
              {status.data && (
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <StatusDot status={status.data.session_state ?? "disconnected"} />
                  Session: {status.data.session_state ?? "none"}
                  {status.data.reconnect_attempts > 0 &&
                    ` · ${status.data.reconnect_attempts} reconnect attempts`}
                  {status.data.last_heartbeat_at &&
                    ` · heartbeat ${timeAgo(status.data.last_heartbeat_at)} ago`}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={confirmDisconnect} onOpenChange={setConfirmDisconnect}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect WhatsApp?</AlertDialogTitle>
            <AlertDialogDescription>
              Your bot will stop sending and receiving messages until you
              reconnect it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() =>
                mutations.disconnect.mutate(botId, {
                  onSuccess: () => {
                    toast.success("WhatsApp disconnected")
                    status.refetch()
                  },
                  onError: (e) => toast.error(errorMessage(e)),
                })
              }
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
