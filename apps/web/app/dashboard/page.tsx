import { DashboardShell } from "@/components/dashboard-shell"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AnalyticsUpIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  BubbleChatIcon,
  Robot01Icon,
  SentIcon,
  TimeQuarterIcon,
} from "@hugeicons/core-free-icons"
import {
  Avatar,
  AvatarFallback,
} from "@workspace/ui/components/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

const stats = [
  {
    title: "Messages today",
    value: "2,847",
    delta: "+18.2%",
    trend: "up",
    icon: SentIcon,
  },
  {
    title: "Active conversations",
    value: "342",
    delta: "+12",
    trend: "up",
    icon: BubbleChatIcon,
  },
  {
    title: "Bot resolution",
    value: "87.4%",
    delta: "+3.1%",
    trend: "up",
    icon: Robot01Icon,
  },
  {
    title: "Avg. response time",
    value: "1.4s",
    delta: "-0.3s",
    trend: "down",
    icon: TimeQuarterIcon,
  },
]

const weeklyVolume = [
  { day: "Mon", value: 62 },
  { day: "Tue", value: 78 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 84 },
  { day: "Sat", value: 45 },
  { day: "Sun", value: 38 },
]

const conversations = [
  {
    name: "Amina Juma",
    message: "Asante! Order yangu imefika 👌",
    time: "2m",
    unread: 2,
    bot: true,
  },
  {
    name: "Brian Otieno",
    message: "Nataka kujua bei ya package ya biashara…",
    time: "14m",
    unread: 0,
    bot: true,
  },
  {
    name: "Neema Kape",
    message: "When is my appointment confirmed?",
    time: "32m",
    unread: 1,
    bot: false,
  },
  {
    name: "David Mushi",
    message: "Sent you the payment receipt",
    time: "1h",
    unread: 0,
    bot: true,
  },
  {
    name: "Zuhura Salim",
    message: "Can the bot send reminders weekly?",
    time: "3h",
    unread: 0,
    bot: false,
  },
]

export default function Page() {
  return (
    <DashboardShell crumb="Overview">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl bg-muted/40 p-5 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
                    <HugeiconsIcon
                      icon={stat.icon}
                      strokeWidth={2}
                      className="size-5 text-primary-foreground"
                    />
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                      stat.trend === "up"
                        ? "bg-primary/15 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <HugeiconsIcon
                      icon={
                        stat.trend === "up" ? ArrowUp01Icon : ArrowDown01Icon
                      }
                      strokeWidth={2.5}
                      className="size-3"
                    />
                    {stat.delta}
                  </span>
                </div>
                <div className="mt-5 text-2xl font-semibold tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-sm text-muted-foreground">
                  {stat.title}
                  <span className="text-muted-foreground/60">
                    {" "}
                    · vs. yesterday
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={AnalyticsUpIcon}
                    strokeWidth={2}
                    className="size-4 text-primary"
                  />
                  Message volume
                </CardTitle>
                <CardDescription>
                  Messages handled this week — bot vs. human
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-48 items-end gap-3">
                  {weeklyVolume.map((d) => (
                    <div
                      key={d.day}
                      className="flex flex-1 flex-col items-center gap-2"
                    >
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary"
                          style={{ height: `${d.value}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {d.day}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent conversations</CardTitle>
                <CardDescription>Latest WhatsApp activity</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {conversations.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {c.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium">
                          {c.name}
                        </span>
                        {c.bot && (
                          <HugeiconsIcon
                            icon={Robot01Icon}
                            strokeWidth={2}
                            className="size-3.5 shrink-0 text-primary"
                          />
                        )}
                      </div>
                      <span className="truncate text-xs text-muted-foreground">
                        {c.message}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">
                        {c.time}
                      </span>
                      {c.unread > 0 && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
    </DashboardShell>
  )
}
