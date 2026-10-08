"use client"

import * as React from "react"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Button } from "@workspace/ui/components/button"
import { EmptyState } from "@/components/page-header"

interface Column<T> {
  header: string
  render: (row: T) => React.ReactNode
  className?: string
}

export function AdminTable<T extends { id: string | number }>({
  columns,
  data,
  loading,
  empty,
  page,
  totalPages,
  onPage,
}: {
  columns: Column<T>[]
  data?: T[]
  loading?: boolean
  empty?: { title: string; description?: string }
  page?: number
  totalPages?: number
  onPage?: (p: number) => void
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="m-4 h-10" />
        ))}
      </div>
    )
  }
  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={empty?.title ?? "Nothing here yet"}
        description={empty?.description}
      />
    )
  }
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.header} className={c.className}>
                  {c.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c) => (
                  <TableCell key={c.header} className={c.className}>
                    {c.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {onPage && (totalPages ?? 1) > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={(page ?? 1) <= 1} onClick={() => onPage((page ?? 1) - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={(page ?? 1) >= (totalPages ?? 1)} onClick={() => onPage((page ?? 1) + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export function AdminStat({
  label,
  value,
  sub,
}: {
  label: string
  value: React.ReactNode
  sub?: string
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}
