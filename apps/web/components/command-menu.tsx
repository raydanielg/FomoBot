"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  ApiIcon,
  Contact01Icon,
  Flowchart01Icon,
  Home01Icon,
  InboxIcon,
  Key01Icon,
  Loading03Icon,
  Robot01Icon,
  Settings05Icon,
} from "@hugeicons/core-free-icons"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@workspace/ui/components/command"

import { useBots } from "@/hooks/api"
import { useAuth } from "@/lib/auth"

const LINKS = [
  { label: "Overview", href: "/dashboard", icon: Home01Icon },
  { label: "Inbox", href: "/dashboard/inbox", icon: InboxIcon },
  { label: "Bots", href: "/dashboard/bots", icon: Robot01Icon },
  { label: "Contacts", href: "/dashboard/contacts", icon: Contact01Icon },
  { label: "Automations", href: "/dashboard/automations", icon: Flowchart01Icon },
  { label: "API keys", href: "/dashboard/api/keys", icon: Key01Icon },
  { label: "API playground", href: "/dashboard/api/playground", icon: ApiIcon },
  { label: "Settings", href: "/dashboard/settings", icon: Settings05Icon },
]

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { authenticated } = useAuth()
  const bots = useBots({ page_size: 5 })

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  if (!authenticated) return null

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
      >
        Search…
        <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search or jump to…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Go to">
          {LINKS.map((l) => (
            <CommandItem key={l.href} onSelect={() => go(l.href)}>
              <HugeiconsIcon icon={l.icon} strokeWidth={2} className="size-4" />
              {l.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Your bots">
          {(bots.data?.results ?? []).map((b) => (
            <CommandItem key={b.id} onSelect={() => go(`/dashboard/bots/${b.id}`)}>
              <HugeiconsIcon icon={Robot01Icon} strokeWidth={2} className="size-4" />
              {b.name}
              {b.connection_status !== "connected" && (
                <span className="ms-auto text-xs text-muted-foreground">
                  {b.connection_status}
                </span>
              )}
            </CommandItem>
          ))}
          {bots.isLoading && (
            <CommandItem disabled>
              <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
              Loading…
            </CommandItem>
          )}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => go("/dashboard/bots/new")}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-4" />
            Create bot
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/api/keys")}>
            <HugeiconsIcon icon={Key01Icon} strokeWidth={2} className="size-4" />
            Create API key
          </CommandItem>
        </CommandGroup>
      </CommandList>
      </CommandDialog>
    </>
  )
}
