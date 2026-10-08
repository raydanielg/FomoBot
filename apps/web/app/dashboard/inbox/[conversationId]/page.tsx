import { DashboardShell } from "@/components/dashboard-shell"
import { InboxView } from "@/components/inbox-view"

export const metadata = { title: "Inbox — Fomobot" }

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = await params
  return (
    <DashboardShell crumb="Inbox">
      <InboxView initialId={conversationId} />
    </DashboardShell>
  )
}
