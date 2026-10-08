import { AnalyticsCharts } from "@/components/analytics-charts"
import { DashboardShell } from "@/components/dashboard-shell"

export const metadata = {
  title: "Analytics — Fomobot",
}

export default function AnalyticsPage() {
  return (
    <DashboardShell crumb="Analytics">
      <AnalyticsCharts />
    </DashboardShell>
  )
}
