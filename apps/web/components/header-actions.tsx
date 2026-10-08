"use client"

import * as React from "react"
import Link from "next/link"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  BellIcon,
  BubbleChatIcon,
  CheckmarkBadgeIcon,
  CreditCardIcon,
  Megaphone01Icon,
  NotificationIcon,
  Robot01Icon,
  SparklesIcon,
  LogoutIcon,
} from "@hugeicons/core-free-icons"

import {
  Avatar,
  AvatarFallback,
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"

const user = {
  name: "Ezra",
  email: "ezra@fomobot.com",
}

const notifications = [
  {
    icon: BubbleChatIcon,
    title: "New conversation",
    description: "Amina Juma started a chat on WhatsApp",
    time: "2m ago",
    unread: true,
  },
  {
    icon: Robot01Icon,
    title: "Bot handled 12 chats",
    description: "Support Bot resolved chats while you were away",
    time: "26m ago",
    unread: true,
  },
  {
    icon: Megaphone01Icon,
    title: "Broadcast delivered",
    description: "\"Weekend offer\" reached 1,240 contacts",
    time: "1h ago",
    unread: true,
  },
  {
    icon: CreditCardIcon,
    title: "Invoice paid",
    description: "Pro plan — $29.00 charged successfully",
    time: "Yesterday",
    unread: false,
  },
]

export function HeaderActions() {
  const [items, setItems] = React.useState(notifications)
  const unreadCount = items.filter((n) => n.unread).length
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="ms-auto flex items-center gap-1 px-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            />
          }
        >
          <HugeiconsIcon icon={BellIcon} strokeWidth={2} />
          {unreadCount > 0 && (
            <span className="absolute end-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 rounded-xl p-0">
          <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
            <span className="font-medium">Notifications</span>
            <button
              type="button"
              onClick={() =>
                setItems((prev) => prev.map((n) => ({ ...n, unread: false })))
              }
              className="text-xs font-normal text-muted-foreground transition-colors hover:text-foreground"
            >
              Mark all read
            </button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-0" />
          {items.map((n) => (
            <DropdownMenuItem
              key={n.title}
              className="flex items-start gap-3 px-4 py-3"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <HugeiconsIcon
                  icon={n.icon}
                  strokeWidth={2}
                  className="size-4 text-primary-foreground"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "truncate text-sm",
                      n.unread && "font-medium"
                    )}
                  >
                    {n.title}
                  </span>
                  {n.unread && (
                    <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <span className="truncate text-xs text-muted-foreground">
                  {n.description}
                </span>
                <span className="text-xs text-muted-foreground/70">
                  {n.time}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="my-0" />
          <DropdownMenuItem className="justify-center py-2.5 text-sm text-muted-foreground">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Account menu"
            />
          }
        >
          <Avatar className="size-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="min-w-56 rounded-xl"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2.5 px-2 py-2 text-start text-sm">
                <Avatar className="size-9">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <HugeiconsIcon icon={CheckmarkBadgeIcon} strokeWidth={2} />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon icon={NotificationIcon} strokeWidth={2} />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/login" />}>
            <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
