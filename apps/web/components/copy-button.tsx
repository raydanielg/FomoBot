"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, Copy01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"

export function CopyButton({
  value,
  label = "Copy",
  variant = "outline",
  size = "sm",
}: {
  value: string
  label?: string
  variant?: "outline" | "ghost" | "secondary"
  size?: "sm" | "xs" | "icon-sm"
}) {
  const [copied, setCopied] = React.useState(false)

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      }}
    >
      <HugeiconsIcon
        icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
        strokeWidth={2}
        className="size-3.5"
      />
      {size !== "icon-sm" && (copied ? "Copied" : label)}
    </Button>
  )
}
