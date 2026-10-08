"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { OrgSwitcher } from "@/components/org-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@workspace/ui/components/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  AnalyticsUpIcon,
  InboxIcon,
  Contact01Icon,
  RoboticIcon,
  Flowchart01Icon,
  DocumentCodeIcon,
  Key01Icon,
  CodeSquareIcon,
  WebhookIcon,
  File01Icon,
  ApiIcon,
  GroupIcon,
  Settings05Icon,
  BookOpen02Icon,
  HelpCircleIcon,
  Robot01Icon,
} from "@hugeicons/core-free-icons"

import { useBots } from "@/hooks/api"

const navMain = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />,
    isActive: true,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: <HugeiconsIcon icon={AnalyticsUpIcon} strokeWidth={2} />,
  },
  {
    title: "Inbox",
    url: "/dashboard/inbox",
    icon: <HugeiconsIcon icon={InboxIcon} strokeWidth={2} />,
  },
  {
    title: "Contacts",
    url: "/dashboard/contacts",
    icon: <HugeiconsIcon icon={Contact01Icon} strokeWidth={2} />,
  },
]

const navProduct = [
  {
    title: "Bots",
    url: "/dashboard/bots",
    icon: <HugeiconsIcon icon={RoboticIcon} strokeWidth={2} />,
  },
  {
    title: "Automations",
    url: "/dashboard/automations",
    icon: <HugeiconsIcon icon={Flowchart01Icon} strokeWidth={2} />,
  },
  {
    title: "Templates",
    url: "/dashboard/templates",
    icon: <HugeiconsIcon icon={DocumentCodeIcon} strokeWidth={2} />,
  },
]

const navDeveloper = [
  {
    title: "API Keys",
    url: "/dashboard/api/keys",
    icon: <HugeiconsIcon icon={Key01Icon} strokeWidth={2} />,
  },
  {
    title: "API Playground",
    url: "/dashboard/api/playground",
    icon: <HugeiconsIcon icon={CodeSquareIcon} strokeWidth={2} />,
  },
  {
    title: "Webhooks",
    url: "/dashboard/webhooks",
    icon: <HugeiconsIcon icon={WebhookIcon} strokeWidth={2} />,
  },
  {
    title: "Logs",
    url: "/dashboard/logs",
    icon: <HugeiconsIcon icon={File01Icon} strokeWidth={2} />,
  },
  {
    title: "Documentation",
    url: "/dashboard/api/docs",
    icon: <HugeiconsIcon icon={ApiIcon} strokeWidth={2} />,
  },
]

const navSecondary = [
  {
    title: "Team",
    url: "/dashboard/team",
    icon: <HugeiconsIcon icon={GroupIcon} strokeWidth={2} />,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
  },
  {
    title: "Documentation",
    url: "/dashboard/api/docs",
    icon: <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />,
  },
  {
    title: "Support",
    url: "#",
    icon: <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data } = useBots({ page_size: 4 })
  const bots =
    data?.results.map((b) => ({
      name: b.name,
      url: `/dashboard/bots/${b.id}`,
      icon: <HugeiconsIcon icon={Robot01Icon} strokeWidth={2} />,
    })) ?? []

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} label="Platform" />
        <NavMain items={navProduct} label="Product" />
        {bots.length > 0 && <NavProjects projects={bots} label="Your bots" />}
        <NavMain items={navDeveloper} label="Developer" />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
