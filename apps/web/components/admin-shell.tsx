"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  AnalyticsUpIcon,
  ApiIcon,
  Audit01Icon,
  BubbleChatIcon,
  Contact01Icon,
  File01Icon,
  Flowchart01Icon,
  GroupIcon,
  Home01Icon,
  InboxIcon,
  Key01Icon,
  LogoutIcon,
  MailCheckIcon,
  MessageLock01Icon,
  NotificationIcon,
  SearchIcon,
  SecurityCheckIcon as ProtectionIcon,
  Robot01Icon,
  SecurityCheckIcon,
  ShieldUserIcon,
  Task01Icon,
  WhatsappIcon,
  WifiConnected01Icon,
} from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"

import { useAuth } from "@/lib/auth"
import { useAdminHealth } from "@/hooks/admin"
import { RequireAdmin } from "@/components/require-admin"

const NAV: { label: string; items: { title: string; href: string; icon: typeof Home01Icon }[] }[] = [
  {
    label: "Monitor",
    items: [
      { title: "Overview", href: "/admin", icon: Home01Icon },
      { title: "Analytics", href: "/admin/analytics", icon: AnalyticsUpIcon },
      { title: "System health", href: "/admin/system", icon: SecurityCheckIcon },
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "Users", href: "/admin/users", icon: GroupIcon },
      { title: "Organizations", href: "/admin/organizations", icon: ShieldUserIcon },
      { title: "Bots", href: "/admin/bots", icon: Robot01Icon },
      { title: "WA Sessions", href: "/admin/sessions", icon: WhatsappIcon },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Messages", href: "/admin/messages", icon: BubbleChatIcon },
      { title: "Conversations", href: "/admin/conversations", icon: InboxIcon },
      { title: "OTP", href: "/admin/otp", icon: MessageLock01Icon },
      { title: "Notifications", href: "/admin/notifications", icon: NotificationIcon },
      { title: "Announcements", href: "/admin/announcements", icon: MailCheckIcon },
    ],
  },
  {
    label: "Platform",
    items: [
      { title: "API & Logs", href: "/admin/api", icon: ApiIcon },
      { title: "Automations", href: "/admin/automations", icon: Flowchart01Icon },
      { title: "Contacts", href: "/admin/contacts", icon: Contact01Icon },
    ],
  },
  {
    label: "Security",
    items: [
      { title: "Audit logs", href: "/admin/security/audit-logs", icon: Audit01Icon },
      { title: "Login activity", href: "/admin/security/login-activity", icon: Key01Icon },
      { title: "Security events", href: "/admin/security/events", icon: ProtectionIcon },
      { title: "Access control", href: "/admin/access-control", icon: Key01Icon },
    ],
  },
  {
    label: "Platform config",
    items: [
      { title: "Plans & limits", href: "/admin/platform/plans", icon: Task01Icon },
      { title: "Feature flags", href: "/admin/platform/feature-flags", icon: File01Icon },
      { title: "SEO", href: "/admin/seo", icon: SearchIcon },
      { title: "Queues", href: "/admin/system/queues", icon: WifiConnected01Icon },
    ],
  },
]

function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/admin" />}>
              <Image src="/fomobot-logo.png" alt="Fomobot" width={28} height={30} />
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">Fomobot</span>
                <span className="truncate text-xs text-destructive">Admin Control</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {NAV.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname.startsWith(item.href)
                      }
                    >
                      <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/dashboard" />}>
              <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />
              <span>Customer dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => void logout()}>
              <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
              <span className="truncate">Log out — {user?.email}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function HealthDot() {
  const health = useAdminHealth()
  const status = health.data?.overall ?? "unknown"
  return (
    <Link
      href="/admin/system"
      className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-xs transition-colors hover:bg-muted"
    >
      <span
        className={cn(
          "size-2 rounded-full",
          status === "operational"
            ? "bg-primary"
            : status === "degraded"
              ? "bg-amber-400"
              : "bg-destructive"
        )}
      />
      <span className="capitalize text-muted-foreground">{status}</span>
    </Link>
  )
}

export function AdminShell({
  crumbs,
  children,
}: {
  crumbs: string[]
  children: React.ReactNode
}) {
  return (
    <RequireAdmin>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ms-1" />
              <Separator orientation="vertical" className="me-2 data-vertical:h-4 data-vertical:self-auto" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  {crumbs.map((c, i) => (
                    <React.Fragment key={c}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        {i === crumbs.length - 1 ? (
                          <BreadcrumbPage>{c}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink>{c}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="ms-auto flex items-center gap-2 px-4">
              <HealthDot />
              <Badge variant="outline" className="border-destructive/30 text-destructive">
                <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-3" />
                Admin
              </Badge>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </RequireAdmin>
  )
}
