"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { cn } from "cn"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Archive02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
  SearchIcon,
  SentIcon,
} from "@hugeicons/core-free-icons"

import {
  Avatar,
  AvatarFallback,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Textarea } from "@workspace/ui/components/textarea"

import {
  useConversationActions,
  useConversationMessages,
  useConversations,
} from "@/hooks/api"
import { errorMessage } from "@/lib/api/client"
import { initials, timeAgo } from "@/lib/format"
import { toast } from "sonner"
import type { Contact, Conversation, Message } from "@/types/api"

function contactOf(c: Conversation): Partial<Contact> {
  return typeof c.contact === "object" && c.contact ? c.contact : {}
}

function contactName(c: Conversation): string {
  const ct = contactOf(c)
  return ct.name || ct.profile_name || ct.phone_number || "Unknown"
}

function statusTicks(m: Message) {
  if (m.direction !== "outbound") return null
  switch (m.status) {
    case "read":
      return <span className="text-[10px] text-sky-500">✓✓</span>
    case "delivered":
      return <span className="text-[10px] text-muted-foreground">✓✓</span>
    case "sent":
      return <span className="text-[10px] text-muted-foreground">✓</span>
    case "failed":
      return <span className="text-[10px] text-destructive">failed</span>
    default:
      return <span className="text-[10px] text-muted-foreground">…</span>
  }
}

export function InboxView({ initialId }: { initialId?: string }) {
  const router = useRouter()
  const [selected, setSelected] = React.useState<string | undefined>(initialId)
  const [search, setSearch] = React.useState("")
  const [tab, setTab] = React.useState<"all" | "unread">("all")
  const [showDetails, setShowDetails] = React.useState(false)
  const [draft, setDraft] = React.useState("")

  const conversations = useConversations({ search: search || undefined })
  const list = conversations.data?.results ?? []
  const filtered =
    tab === "unread" ? list.filter((c) => c.unread_count > 0) : list

  const active = list.find((c) => c.id === selected)
  const messages = useConversationMessages(selected ?? "")
  const actions = useConversationActions(selected ?? "")
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.data])

  function openConversation(id: string) {
    setSelected(id)
    router.replace(`/dashboard/inbox/${id}`)
    actions.markRead.mutate()
  }

  async function send() {
    if (!draft.trim() || !selected) return
    const text = draft
    setDraft("")
    try {
      await actions.reply.mutateAsync(text)
    } catch (e) {
      setDraft(text)
      toast.error(errorMessage(e, "Message failed to send."))
    }
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Conversation list */}
      <aside className={cn(
        "flex w-full shrink-0 flex-col border-e border-border md:w-80",
        selected && "hidden md:flex"
      )}>
        <div className="flex flex-col gap-2 border-b border-border p-3">
          <div className="relative">
            <HugeiconsIcon
              icon={SearchIcon}
              strokeWidth={2}
              className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats…"
              className="ps-8"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "unread"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                  tab === t
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              {tab === "unread" ? "No unread chats" : "No conversations yet"}
            </p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => openConversation(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 p-3 text-start transition-colors hover:bg-muted/50",
                  selected === c.id && "bg-muted/60"
                )}
              >
                <Avatar>
                  <AvatarFallback>{initials(contactName(c))}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {contactName(c)}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {timeAgo(c.last_message_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted-foreground">
                      {c.last_message?.text || "No messages yet"}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      {c.status !== "open" && (
                        <Badge variant="outline" className="px-1.5 text-[10px]">
                          {c.status}
                        </Badge>
                      )}
                      {c.unread_count > 0 && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {c.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Conversation view */}
      <section className={cn("flex min-w-0 flex-1 flex-col", !selected && "hidden md:flex")}>
        {!selected ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Select a conversation to start messaging
          </div>
        ) : (
          <>
            <header className="flex items-center gap-3 border-b border-border px-4 py-3">
              <button
                type="button"
                className="text-sm text-muted-foreground md:hidden"
                onClick={() => {
                  setSelected(undefined)
                  router.replace("/dashboard/inbox")
                }}
              >
                ← Back
              </button>
              <Avatar className="size-9">
                <AvatarFallback>{initials(active ? contactName(active) : "?")}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">
                  {active ? contactName(active) : "Conversation"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {active && contactOf(active).phone_number}
                </span>
              </div>
              {active && (
                <Badge variant="outline" className="capitalize">
                  {active.status}
                </Badge>
              )}
              {active?.status === "open" ? (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Archive conversation"
                  onClick={() => actions.archive.mutate()}
                >
                  <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Reopen conversation"
                  onClick={() => actions.reopen.mutate()}
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Contact details"
                onClick={() => setShowDetails((v) => !v)}
              >
                <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
              </Button>
            </header>

            <div className="flex-1 space-y-2 overflow-y-auto bg-muted/30 p-4">
              {(messages.data?.results ?? []).map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex",
                    m.direction === "outbound" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm",
                      m.direction === "outbound"
                        ? "rounded-br-md bg-primary/20 text-foreground"
                        : "rounded-bl-md bg-card text-card-foreground ring-1 ring-border"
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                    <div className="mt-0.5 flex items-center justify-end gap-1">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(m.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {statusTicks(m)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
              {messages.isLoading && (
                <div className="flex justify-center py-4">
                  <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {!messages.isLoading && messages.data?.results.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No messages yet — say hello.
                </p>
              )}
            </div>

            <form
              className="flex items-end gap-2 border-t border-border p-3"
              onSubmit={(e) => {
                e.preventDefault()
                void send()
              }}
            >
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    void send()
                  }
                }}
                placeholder="Type a message…"
                rows={1}
                className="max-h-32 min-h-9 flex-1 resize-none"
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Send message"
                disabled={!draft.trim() || actions.reply.isPending}
              >
                {actions.reply.isPending ? (
                  <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="animate-spin" />
                ) : (
                  <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
                )}
              </Button>
            </form>
          </>
        )}
      </section>

      {/* Details panel */}
      {selected && showDetails && active && (
        <aside className="hidden w-72 shrink-0 flex-col gap-4 border-s border-border p-4 lg:flex">
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <Avatar className="size-16">
              <AvatarFallback className="text-lg">
                {initials(contactName(active))}
              </AvatarFallback>
            </Avatar>
            <p className="font-medium">{contactName(active)}</p>
            <p className="text-sm text-muted-foreground">
              {contactOf(active).phone_number}
            </p>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Labels</dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {active.labels.length === 0 ? (
                  <span className="text-muted-foreground">None</span>
                ) : (
                  active.labels.map((l) => (
                    <Badge key={l} variant="outline">
                      {l}
                    </Badge>
                  ))
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Assigned to</dt>
              <dd>{active.assigned_user_email || "Unassigned"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Unread</dt>
              <dd>{active.unread_count}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Created</dt>
              <dd>{new Date(active.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>
        </aside>
      )}
    </div>
  )
}
