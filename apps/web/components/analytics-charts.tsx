"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  AnalyticsUpIcon,
  BubbleChatIcon,
  ChartEvaluationIcon,
  ChartRingIcon,
  Robot01Icon,
  TimeQuarterIcon,
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

const volumeData = [
  { day: "Mon", received: 420, handled: 356 },
  { day: "Tue", received: 512, handled: 441 },
  { day: "Wed", received: 389, handled: 340 },
  { day: "Thu", received: 604, handled: 543 },
  { day: "Fri", received: 558, handled: 491 },
  { day: "Sat", received: 310, handled: 287 },
  { day: "Sun", received: 254, handled: 234 },
]

const volumeConfig = {
  received: { label: "Received", color: "var(--chart-1)" },
  handled: { label: "Bot handled", color: "var(--chart-3)" },
} satisfies ChartConfig

const outcomeData = [
  { name: "Resolved by bot", value: 64, fill: "var(--color-resolved)" },
  { name: "Human handoff", value: 21, fill: "var(--color-handoff)" },
  { name: "Escalated", value: 9, fill: "var(--color-escalated)" },
  { name: "Abandoned", value: 6, fill: "var(--color-abandoned)" },
]

const outcomeConfig = {
  resolved: { label: "Resolved by bot", color: "var(--chart-2)" },
  handoff: { label: "Human handoff", color: "var(--chart-4)" },
  escalated: { label: "Escalated", color: "var(--chart-5)" },
  abandoned: { label: "Abandoned", color: "var(--muted)" },
} satisfies ChartConfig

const botData = [
  { bot: "Support", messages: 1840, resolution: 91 },
  { bot: "Sales", messages: 1210, resolution: 78 },
  { bot: "Reminder", messages: 860, resolution: 96 },
]

const botConfig = {
  messages: { label: "Messages", color: "var(--chart-2)" },
  resolution: { label: "Resolution %", color: "var(--chart-4)" },
} satisfies ChartConfig

const responseData = [
  { week: "W1", seconds: 4.8 },
  { week: "W2", seconds: 4.1 },
  { week: "W3", seconds: 3.6 },
  { week: "W4", seconds: 3.9 },
  { week: "W5", seconds: 3.1 },
  { week: "W6", seconds: 2.7 },
  { week: "W7", seconds: 2.4 },
  { week: "W8", seconds: 2.0 },
  { week: "W9", seconds: 1.9 },
  { week: "W10", seconds: 1.6 },
  { week: "W11", seconds: 1.5 },
  { week: "W12", seconds: 1.4 },
]

const responseConfig = {
  seconds: { label: "Avg. seconds", color: "var(--chart-3)" },
} satisfies ChartConfig

const radarData = [
  { metric: "Accuracy", support: 92, sales: 74 },
  { metric: "Speed", support: 88, sales: 81 },
  { metric: "CSAT", support: 84, sales: 69 },
  { metric: "Coverage", support: 76, sales: 88 },
  { metric: "Handoff", support: 70, sales: 62 },
  { metric: "Uptime", support: 98, sales: 95 },
]

const radarConfig = {
  support: { label: "Support Bot", color: "var(--chart-2)" },
  sales: { label: "Sales Bot", color: "var(--chart-4)" },
} satisfies ChartConfig

const radialData = [{ name: "goal", value: 87, fill: "var(--color-goal)" }]

const radialConfig = {
  goal: { label: "Monthly goal", color: "var(--primary)" },
} satisfies ChartConfig

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
            <HugeiconsIcon
              icon={icon}
              strokeWidth={2}
              className="size-4 text-primary-foreground"
            />
          </span>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function AnalyticsCharts() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          icon={AnalyticsUpIcon}
          title="Message volume"
          description="Messages received vs. handled by bots — this week"
          className="lg:col-span-2"
        >
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
                dataKey="handled"
                stroke="var(--color-handled)"
                fill="var(--color-handled)"
                fillOpacity={0.45}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard
          icon={ChartRingIcon}
          title="Resolution rate"
          description="Monthly goal progress"
        >
          <ChartContainer config={radialConfig} className="mx-auto h-64 w-full">
            <RadialBarChart
              data={radialData}
              startAngle={90}
              endAngle={90 + (87 / 100) * 360}
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
                            87%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 24}
                            className="fill-muted-foreground text-xs"
                          >
                            of conversations
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          icon={Robot01Icon}
          title="Bot performance"
          description="Messages sent vs. resolution rate per bot"
        >
          <ChartContainer config={botConfig} className="h-64 w-full">
            <BarChart data={botData} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="bot" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="messages" fill="var(--color-messages)" radius={6} />
              <Bar dataKey="resolution" fill="var(--color-resolution)" radius={6} />
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard
          icon={BubbleChatIcon}
          title="Conversation outcomes"
          description="How chats were resolved this month"
        >
          <ChartContainer config={outcomeConfig} className="mx-auto h-64 w-full">
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="name" hideLabel />}
              />
              <Pie
                data={outcomeData}
                dataKey="value"
                nameKey="name"
                innerRadius={56}
                outerRadius={88}
                strokeWidth={4}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="flex-wrap"
              />
            </PieChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard
          icon={ChartEvaluationIcon}
          title="Bot skills radar"
          description="Support vs. Sales bot across 6 metrics"
        >
          <ChartContainer config={radarConfig} className="mx-auto h-64 w-full">
            <RadarChart data={radarData} accessibilityLayer>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Radar
                dataKey="support"
                stroke="var(--color-support)"
                fill="var(--color-support)"
                fillOpacity={0.35}
                strokeWidth={2}
              />
              <Radar
                dataKey="sales"
                stroke="var(--color-sales)"
                fill="var(--color-sales)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ChartContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4">
        <ChartCard
          icon={TimeQuarterIcon}
          title="Response time trend"
          description="Average bot reply time — last 12 weeks"
        >
          <ChartContainer config={responseConfig} className="h-56 w-full">
            <LineChart data={responseData} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v) => `${v}s`}
                domain={[0, "auto"]}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Line
                type="monotone"
                dataKey="seconds"
                stroke="var(--color-seconds)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--color-seconds)" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  )
}
