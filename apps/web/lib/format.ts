import type { BotConnectionStatus } from "@/types/api"

export function timeAgo(iso?: string | null): string {
  if (!iso) return ""
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "now"
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d`
  return new Date(iso).toLocaleDateString()
}

export function botStatusMeta(status: BotConnectionStatus | string) {
  switch (status) {
    case "connected":
      return {
        label: "Connected",
        dot: "bg-primary",
        className: "border-primary/40 text-foreground",
      }
    case "connecting":
      return { label: "Connecting", dot: "bg-amber-400 animate-pulse", className: "" }
    case "qr_required":
      return { label: "QR required", dot: "bg-amber-400", className: "" }
    case "reconnecting":
      return { label: "Reconnecting", dot: "bg-amber-400 animate-pulse", className: "" }
    case "error":
      return {
        label: "Error",
        dot: "bg-destructive",
        className: "border-destructive/40 text-destructive",
      }
    case "logged_out":
      return { label: "Logged out", dot: "bg-muted-foreground", className: "" }
    default:
      return { label: "Disconnected", dot: "bg-muted-foreground/50", className: "" }
  }
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
