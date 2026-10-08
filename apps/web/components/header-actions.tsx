"use client"

import * as React from "react"
import Link from "next/link"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  BellIcon,
  BubbleChatIcon,
  CheckmarkBadgeIcon,
  CreditCardIcon,
  NotificationIcon,
  Robot01Icon,
  SparklesIcon,
  LogoutIcon,
  WebhookIcon,
  Key01Icon,
} from "@hugeicons/core-free-icons"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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

import { useAuth } from "@/lib/auth"
import { timeAgo, initials } from "@/lib/format"
import { useNotifications, useNotificationMutations, useUnreadCount } from "@/hooks/api"
import type { AppNotification } from "@/types/api"

const TYPE_ICONS: Record<string, typeof Robot01Icon> = {
  "bot.connected": Robot01Icon,
  "bot.disconnected": Robot01Icon,
  "webhook.failed": WebhookIcon,
  "api_key.created": Key01Icon,
  security: CheckmarkBadgeIcon,
  system: BellIcon,
}

export function HeaderActions() {
  const { user, logout } = useAuth()
  const notifications = useNotifications({ page_size: 8 })
  const unread = useUnreadCount()
  const mutations = useNotificationMutations()

  const items = notifications.data?.results ?? []
  const name = user?.full_name || user?.email || "Account"

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
          {(unread.data?.count ?? 0) > 0 && (
            <span className="absolute end-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
              {unread.data!.count > 9 ? "9+" : unread.data!.count}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 rounded-xl p-0">
          <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
            <span className="font-medium">Notifications</span>
            <button
              type="button"
              onClick={() => mutations.markAllRead.mutate()}
              className="text-xs font-normal text-muted-foreground transition-colors hover:text-foreground"
            >
              Mark all read
            </button>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-0" />
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          ) : (
            items.map((n: AppNotification) => {
              const isUnread = !n.read_at
              return (
                <DropdownMenuItem
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3"
                  onClick={() => isUnread && mutations.markRead.mutate(n.id)}
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <HugeiconsIcon
                      icon={TYPE_ICONS[n.type] ?? BellIcon}
                      strokeWidth={2}
                      className="size-4 text-primary-foreground"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className={cn("truncate text-sm", isUnread && "font-medium")}>
                        {n.title}
                      </span>
                      {isUnread && (
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                      {n.body}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                      {timeAgo(n.created_at)} ago
                    </span>
                  </div>
                </DropdownMenuItem>
              )
            })
          )}
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
            <AvatarImage src={user?.avatar_url ?? undefined} alt={name} />
            <AvatarFallback>{initials(name)}</AvatarFallback>
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
                  <AvatarImage src={user?.avatar_url ?? undefined} alt={name} />
                  <AvatarFallback>{initials(name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} />
              Upgrade plan
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <HugeiconsIcon icon={CheckmarkBadgeIcon} strokeWidth={2} />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <HugeiconsIcon icon={NotificationIcon} strokeWidth={2} />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => void logout()}>
            <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
