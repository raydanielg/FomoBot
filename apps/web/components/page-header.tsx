import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-14 text-center">
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <div>
        <p className="font-medium">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}

export function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-primary",
    connected: "bg-primary",
    success: "bg-primary",
    enabled: "bg-primary",
    connecting: "bg-amber-400 animate-pulse",
    reconnecting: "bg-amber-400 animate-pulse",
    qr_required: "bg-amber-400",
    pending: "bg-amber-400",
    paused: "bg-muted-foreground",
    disabled: "bg-muted-foreground",
    disconnected: "bg-muted-foreground/50",
    logged_out: "bg-muted-foreground",
    failed: "bg-destructive",
    error: "bg-destructive",
  }
  return (
    <span
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        map[status] ?? "bg-muted-foreground/50"
      )}
    />
  )
}
