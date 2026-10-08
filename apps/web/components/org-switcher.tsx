"use client"

import * as React from "react"
import Image from "next/image"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Building02Icon,
  Tick02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"

import { useAuth } from "@/lib/auth"

export function OrgSwitcher() {
  const { organization, organizations, selectOrganization } = useAuth()
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" />}
          >
            <Image
              src="/fomobot-logo.png"
              alt="Fomobot logo"
              width={32}
              height={35}
              className="shrink-0"
            />
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-semibold">
                {organization?.name ?? "Fomobot"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {organization?.plan_code
                  ? `${organization.plan_code.toUpperCase()} plan`
                  : "Workspace"}
              </span>
            </div>
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              strokeWidth={2}
              className="ms-auto size-4 text-muted-foreground"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-60 rounded-xl"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => selectOrganization(org.id)}
                className="gap-2.5"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <HugeiconsIcon
                    icon={Building02Icon}
                    strokeWidth={2}
                    className="size-4 text-muted-foreground"
                  />
                </div>
                <div className="grid flex-1 leading-tight">
                  <span className="truncate text-sm font-medium">{org.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {org.plan_code?.toUpperCase() || "FREE"} · {org.member_count}{" "}
                    {org.member_count === 1 ? "member" : "members"}
                  </span>
                </div>
                {org.id === organization?.id && (
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    strokeWidth={2.5}
                    className="size-4 text-primary-foreground"
                  />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="gap-2.5">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-dashed border-border">
                <HugeiconsIcon
                  icon={Add01Icon}
                  strokeWidth={2}
                  className="size-4 text-muted-foreground"
                />
              </div>
              <span className="text-sm">Create organization</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
