"use client"

import * as React from "react"
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  AnalyticsUpIcon,
  BubbleChatIcon,
  RoboticIcon,
  Megaphone01Icon,
  WhatsappIcon,
  Contact01Icon,
  Settings05Icon,
  BookOpen02Icon,
  HelpCircleIcon,
  SentIcon,
  Robot01Icon,
  Robot02Icon,
  AiChat01Icon,
} from "@hugeicons/core-free-icons"

const data = {
  user: {
    name: "Ezra",
    email: "ezra@fomobot.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: (
        <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />
      ),
      isActive: true,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: (
        <HugeiconsIcon icon={AnalyticsUpIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Conversations",
      url: "#",
      icon: (
        <HugeiconsIcon icon={BubbleChatIcon} strokeWidth={2} />
      ),
      items: [
        {
          title: "All chats",
          url: "#",
        },
        {
          title: "Assigned to me",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Bots",
      url: "#",
      icon: (
        <HugeiconsIcon icon={RoboticIcon} strokeWidth={2} />
      ),
      items: [
        {
          title: "All bots",
          url: "#",
        },
        {
          title: "Flows",
          url: "#",
        },
        {
          title: "AI settings",
          url: "#",
        },
      ],
    },
    {
      title: "Broadcasts",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Megaphone01Icon} strokeWidth={2} />
      ),
      items: [
        {
          title: "Campaigns",
          url: "#",
        },
        {
          title: "Templates",
          url: "#",
        },
        {
          title: "Scheduled",
          url: "#",
        },
      ],
    },
    {
      title: "WhatsApp",
      url: "#",
      icon: (
        <HugeiconsIcon icon={WhatsappIcon} strokeWidth={2} />
      ),
      items: [
        {
          title: "Numbers",
          url: "#",
        },
        {
          title: "Connect device",
          url: "#",
        },
      ],
    },
    {
      title: "Contacts",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Contact01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Settings",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
      ),
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "API keys",
          url: "#",
        },
        {
          title: "Webhooks",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Docs",
      url: "#",
      icon: (
        <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Support",
      url: "#",
      icon: (
        <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Feedback",
      url: "#",
      icon: (
        <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
      ),
    },
  ],
  bots: [
    {
      name: "Support Bot",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Robot01Icon} strokeWidth={2} />
      ),
    },
    {
      name: "Sales Bot",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Robot02Icon} strokeWidth={2} />
      ),
    },
    {
      name: "Reminder Bot",
      url: "#",
      icon: (
        <HugeiconsIcon icon={AiChat01Icon} strokeWidth={2} />
      ),
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/dashboard" />}>
              <Image
                src="/fomobot-logo.png"
                alt="Fomobot logo"
                width={32}
                height={35}
              />
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">Fomobot</span>
                <span className="truncate text-xs text-muted-foreground">
                  Workspace
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.bots} label="Your bots" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
