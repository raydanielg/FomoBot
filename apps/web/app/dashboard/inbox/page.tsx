import { DashboardShell } from "@/components/dashboard-shell"
import { InboxView } from "@/components/inbox-view"

export const metadata = { title: "Inbox — Fomobot" }

export default function InboxPage() {
  return (
    <DashboardShell crumb="Inbox">
      <InboxView />
    </DashboardShell>
  )
}
