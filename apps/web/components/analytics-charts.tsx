"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  AnalyticsUpIcon,
  BubbleChatIcon,
  CheckmarkCircle02Icon,
  ChartEvaluationIcon,
  Contact01Icon,
  Robot01Icon,
  TimeQuarterIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"

import {
  useBotStats,
  useHourlyActivity,
  useMessageStats,
  useOverview,
  useStatusBreakdown,
} from "@/hooks/api"

const volumeConfig = {
  received: { label: "Received", color: "var(--chart-1)" },
  sent: { label: "Sent", color: "var(--chart-3)" },
} satisfies ChartConfig

const botConfig = {
  sent: { label: "Sent", color: "var(--chart-2)" },
  received: { label: "Received", color: "var(--chart-4)" },
} satisfies ChartConfig

const convConfig = {
  open: { label: "Open", color: "var(--chart-2)" },
  closed: { label: "Resolved", color: "var(--chart-4)" },
  archived: { label: "Archived", color: "var(--muted)" },
} satisfies ChartConfig

const deliveryConfig = {
  delivered: { label: "Delivered", color: "var(--chart-2)" },
  read: { label: "Read", color: "var(--chart-1)" },
  sent: { label: "Sent", color: "var(--chart-4)" },
  queued: { label: "Queued", color: "var(--muted)" },
  failed: { label: "Failed", color: "var(--destructive)" },
} satisfies ChartConfig

const hourlyConfig = {
  received: { label: "Received", color: "var(--chart-1)" },
  sent: { label: "Sent", color: "var(--chart-3)" },
} satisfies ChartConfig

const rateConfig = {
  rate: { label: "Delivery rate", color: "var(--primary)" },
} satisfies ChartConfig

const CONV_COLORS: Record<string, string> = {
  open: "var(--chart-2)",
  closed: "var(--chart-4)",
  archived: "var(--muted)",
}

const MSG_COLORS: Record<string, string> = {
  delivered: "var(--chart-2)",
  read: "var(--chart-1)",
  sent: "var(--chart-4)",
  queued: "var(--muted)",
  failed: "var(--destructive)",
}

function ChartCard({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  title: string
  description: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15">
            <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4 text-primary-foreground" />
          </span>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function ChartEmpty({ label }: { label: string }) {
  return (
    <Empty className="h-64 border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={AnalyticsUpIcon} strokeWidth={1.5} />
        </EmptyMedia>
        <EmptyTitle className="text-sm">No data yet</EmptyTitle>
        <EmptyDescription>{label}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  label: string
  value: React.ReactNode
  hint?: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15">
          <HugeiconsIcon icon={Icon} strokeWidth={2} className="size-5 text-primary-foreground" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="truncate text-2xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsCharts() {
  const overview = useOverview()
  const stats = useMessageStats(14)
  const botStats = useBotStats(30)
  const breakdown = useStatusBreakdown()
  const hourly = useHourlyActivity(30)

  const ov = overview.data

  const volumeData = (stats.data ?? []).map((d) => ({
    day: new Date(`${d.day}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    received: d.inbound,
    sent: d.outbound,
  }))
  const hasVolume = volumeData.some((d) => d.received > 0 || d.sent > 0)

  const deliveryRate = ov?.messages.delivery_rate ?? null

  const botData = (botStats.data ?? []).map((b) => ({
    bot: b.bot.length > 14 ? `${b.bot.slice(0, 14)}…` : b.bot,
    received: b.inbound,
    sent: b.outbound,
  }))

  const conv = breakdown.data?.conversations ?? {}
  const convData = Object.entries(conv)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({
      name: convConfig[k as keyof typeof convConfig]?.label ?? k,
      value: v,
      fill: CONV_COLORS[k] ?? "var(--muted)",
    }))

  const msgs = breakdown.data?.messages ?? {}
  const deliveryData = Object.entries(msgs)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({
      name: deliveryConfig[k as keyof typeof deliveryConfig]?.label ?? k,
      value: v,
      fill: MSG_COLORS[k] ?? "var(--muted)",
    }))

  const hourlyData = (hourly.data ?? []).map((h) => ({
    hour: `${String(h.hour).padStart(2, "0")}:00`,
    received: h.inbound,
    sent: h.outbound,
  }))
  const hasHourly = hourlyData.some((d) => d.received > 0 || d.sent > 0)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Headline stats — all real */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BubbleChatIcon}
          label="Messages"
          value={overview.isPending ? <Skeleton className="h-8 w-16" /> : (ov?.messages.total ?? 0).toLocaleString()}
          hint={`${ov?.messages.inbound ?? 0} in · ${ov?.messages.outbound ?? 0} out`}
        />
        <StatCard
          icon={CheckmarkCircle02Icon}
          label="Delivery rate"
          value={
            overview.isPending
              ? <Skeleton className="h-8 w-16" />
              : deliveryRate !== null ? `${deliveryRate}%` : "—"
          }
          hint={ov ? `${ov.messages.failed} failed` : undefined}
        />
        <StatCard
          icon={WhatsappIcon}
          label="Bots online"
          value={
            overview.isPending
              ? <Skeleton className="h-8 w-16" />
              : `${ov?.bots.connected ?? 0}/${ov?.bots.total ?? 0}`
          }
          hint="connected sessions"
        />
        <StatCard
          icon={Contact01Icon}
          label="Contacts"
          value={overview.isPending ? <Skeleton className="h-8 w-16" /> : (ov?.contacts ?? 0).toLocaleString()}
          hint={`${ov?.conversations.open ?? 0} open chats`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          icon={AnalyticsUpIcon}
          title="Message volume"
          description="Received vs. sent — last 14 days"
          className="lg:col-span-2"
        >
          {stats.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : !hasVolume ? (
            <ChartEmpty label="Send or receive a message to see volume here." />
          ) : (
            <ChartContainer config={volumeConfig} className="h-64 w-full">
              <AreaChart data={volumeData} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="received"
                  stroke="var(--color-received)"
                  fill="var(--color-received)"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="sent"
                  stroke="var(--color-sent)"
                  fill="var(--color-sent)"
                  fillOpacity={0.45}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </ChartCard>

        <ChartCard
          icon={CheckmarkCircle02Icon}
          title="Delivery rate"
          description="Delivered or read — all outbound"
        >
          {overview.isPending ? (
            <Skeleton className="mx-auto h-64 w-full" />
          ) : (
            <ChartContainer config={rateConfig} className="mx-auto h-64 w-full">
              <RadialBarChart
                data={[{ name: "rate", value: deliveryRate ?? 0, fill: "var(--color-rate)" }]}
                startAngle={90}
                endAngle={90 + ((deliveryRate ?? 0) / 100) * 360}
                innerRadius={80}
                outerRadius={120}
              >
                <PolarGrid gridType="circle" radialLines={false} stroke="none" />
                <RadialBar dataKey="value" cornerRadius={12} background />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                            >
                              {deliveryRate !== null ? `${deliveryRate}%` : "—"}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) + 24}
                              className="fill-muted-foreground text-xs"
                            >
                              of outbound messages
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          )}
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          icon={Robot01Icon}
          title="Bot activity"
          description="Sent vs. received per bot — last 30 days"
        >
          {botStats.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : botData.length === 0 ? (
            <ChartEmpty label="Connect a bot and exchange messages to compare bots." />
          ) : (
            <ChartContainer config={botConfig} className="h-64 w-full">
              <BarChart data={botData} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="bot" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="sent" fill="var(--color-sent)" radius={6} />
                <Bar dataKey="received" fill="var(--color-received)" radius={6} />
              </BarChart>
            </ChartContainer>
          )}
        </ChartCard>

        <ChartCard
          icon={BubbleChatIcon}
          title="Conversation status"
          description="Open vs. resolved chats — all time"
        >
          {breakdown.isPending ? (
            <Skeleton className="mx-auto h-64 w-full" />
          ) : convData.length === 0 ? (
            <ChartEmpty label="Conversations appear here once messages arrive." />
          ) : (
            <ChartContainer config={convConfig} className="mx-auto h-64 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie
                  data={convData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={88}
                  strokeWidth={4}
                />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} className="flex-wrap" />
              </PieChart>
            </ChartContainer>
          )}
        </ChartCard>

        <ChartCard
          icon={ChartEvaluationIcon}
          title="Delivery status"
          description="Status of all outbound messages"
        >
          {breakdown.isPending ? (
            <Skeleton className="mx-auto h-64 w-full" />
          ) : deliveryData.length === 0 ? (
            <ChartEmpty label="Outbound messages appear here once you send." />
          ) : (
            <ChartContainer config={deliveryConfig} className="mx-auto h-64 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie
                  data={deliveryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={88}
                  strokeWidth={4}
                />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} className="flex-wrap" />
              </PieChart>
            </ChartContainer>
          )}
        </ChartCard>
      </div>

      <div className="grid gap-4">
        <ChartCard
          icon={TimeQuarterIcon}
          title="Activity by hour"
          description="Message traffic by time of day — last 30 days"
        >
          {hourly.isPending ? (
            <Skeleton className="h-56 w-full" />
          ) : !hasHourly ? (
            <ChartEmpty label="Traffic heatmap appears once messages flow." />
          ) : (
            <ChartContainer config={hourlyConfig} className="h-56 w-full">
              <AreaChart data={hourlyData} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={2}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="received"
                  stroke="var(--color-received)"
                  fill="var(--color-received)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="sent"
                  stroke="var(--color-sent)"
                  fill="var(--color-sent)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </ChartCard>
      </div>
    </div>
  )
}
