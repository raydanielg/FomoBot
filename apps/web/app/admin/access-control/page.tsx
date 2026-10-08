"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { toast } from "sonner"

import { errorMessage } from "@/lib/api/client"
import {
  useAdminAdmins,
  useAdminCreateAdmin,
  useAdminRoleActions,
  useAdminRoles,
} from "@/hooks/admin"

const PERM_GROUPS: Record<string, string[]> = {
  users: ["view", "create", "update", "suspend", "delete", "impersonate"],
  organizations: ["view", "update", "suspend"],
  bots: ["view", "update", "disconnect", "reconnect", "delete"],
  sessions: ["view", "manage"],
  messages: ["view", "send", "delete"],
  contacts: ["view", "update"],
  automations: ["view", "create", "update", "delete"],
  templates: ["view", "create", "update"],
  otp: ["view", "manage"],
  notifications: ["view", "send"],
  webhooks: ["view", "manage"],
  api: ["view", "manage"],
  logs: ["view"],
  analytics: ["view"],
  settings: ["view", "manage"],
  roles: ["view", "manage"],
  audit: ["view"],
  security: ["manage"],
  announcements: ["manage"],
  flags: ["manage"],
  plans: ["manage"],
}

export default function AccessControlPage() {
  const roles = useAdminRoles()
  const admins = useAdminAdmins()
  const roleActions = useAdminRoleActions()
  const createAdmin = useAdminCreateAdmin()

  const [roleDialog, setRoleDialog] = React.useState(false)
  const [adminDialog, setAdminDialog] = React.useState(false)
  const [roleName, setRoleName] = React.useState("")
  const [roleDesc, setRoleDesc] = React.useState("")
  const [perms, setPerms] = React.useState<Set<string>>(new Set())
  const [adminEmail, setAdminEmail] = React.useState("")
  const [adminRole, setAdminRole] = React.useState("")

  const togglePerm = (p: string) =>
    setPerms((prev) => {
      const next = new Set(prev)
      next.has(p) ? next.delete(p) : next.add(p)
      return next
    })

  return (
    <AdminShell crumbs={["Access control"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Access control"
          description="Platform roles, permissions and administrators."
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAdminDialog(true)}>
                Add admin
              </Button>
              <Button size="sm" onClick={() => setRoleDialog(true)}>
                New role
              </Button>
            </div>
          }
        />

        <Tabs defaultValue="roles">
          <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="admins">Admin users</TabsTrigger>
            <TabsTrigger value="matrix">Permission matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="mt-4">
            <AdminTable
              loading={roles.isLoading}
              data={roles.data?.results}
              empty={{ title: "No roles" }}
              columns={[
                { header: "Role", render: (r) => (
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="max-w-96 truncate text-xs text-muted-foreground">{r.description}</p>
                  </div>
                )},
                { header: "Permissions", render: (r) =>
                  r.permissions.includes("*") ? (
                    <Badge>All {`(${r.permissions.length} wildcard)`}</Badge>
                  ) : (
                    <Badge variant="outline">{r.permissions.length}</Badge>
                  )},
                { header: "Admins", render: (r) => r.admin_count },
                { header: "Type", render: (r) =>
                  r.is_system ? <Badge variant="secondary">system</Badge> : <Badge variant="outline">custom</Badge>},
                { header: "", className: "w-28", render: (r) =>
                  !r.is_system && (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={roleActions.remove.isPending}
                      onClick={() =>
                        roleActions.remove.mutate(r.id, {
                          onSuccess: () => toast.success("Role deleted"),
                          onError: (e) => toast.error(errorMessage(e)),
                        })
                      }
                    >
                      Delete
                    </Button>
                  )},
              ]}
            />
          </TabsContent>

          <TabsContent value="admins" className="mt-4">
            <AdminTable
              loading={admins.isLoading}
              data={admins.data?.results}
              empty={{ title: "No admin users" }}
              columns={[
                { header: "Admin", render: (a) => (
                  <div>
                    <p className="font-medium">{a.name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{a.email}</p>
                  </div>
                )},
                { header: "Roles", render: (a) => (
                  <span className="flex flex-wrap gap-1">
                    {a.role_names.map((r) => (
                      <Badge key={r} variant="outline" className="font-mono text-[10px]">{r}</Badge>
                    ))}
                  </span>
                )},
                { header: "Status", render: (a) => (
                  <Badge variant={a.status === "active" ? "outline" : "destructive"} className="capitalize">{a.status}</Badge>
                )},
              ]}
            />
          </TabsContent>

          <TabsContent value="matrix" className="mt-4">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40 text-start text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-start font-medium">Resource</th>
                    <th className="px-4 py-2 text-start font-medium">view</th>
                    <th className="px-4 py-2 text-start font-medium">create</th>
                    <th className="px-4 py-2 text-start font-medium">update</th>
                    <th className="px-4 py-2 text-start font-medium">delete</th>
                    <th className="px-4 py-2 text-start font-medium">manage / other</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.data?.results.map((role) => (
                    <React.Fragment key={role.id}>
                      <tr className="bg-muted/20">
                        <td colSpan={6} className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {role.name}
                        </td>
                      </tr>
                      {Object.entries(PERM_GROUPS).map(([resource, actions]) => {
                        const has = (a: string) =>
                          role.permissions.includes("*") ||
                          role.permissions.includes(`${resource}.*`) ||
                          role.permissions.includes(`${resource}.${a}`)
                        const other = actions.filter((a) => !["view", "create", "update", "delete"].includes(a) && has(a))
                        return (
                          <tr key={role.id + resource} className="border-b border-border/50 last:border-0">
                            <td className="px-4 py-1.5 capitalize">{resource}</td>
                            {(["view", "create", "update", "delete"] as const).map((a) => (
                              <td key={a} className="px-4 py-1.5">
                                {has(a) ? (
                                  <span className="text-primary-foreground">●</span>
                                ) : (
                                  <span className="text-muted-foreground/40">—</span>
                                )}
                              </td>
                            ))}
                            <td className="px-4 py-1.5 text-xs text-muted-foreground">
                              {other.length ? other.join(", ") : "—"}
                            </td>
                          </tr>
                        )
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              {roles.isLoading && <Skeleton className="m-4 h-40" />}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* new role */}
      <Dialog open={roleDialog} onOpenChange={setRoleDialog}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create role</DialogTitle>
            <DialogDescription>Choose which actions this role can perform.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Name</Label>
              <Input value={roleName} onChange={(e) => setRoleName(e.target.value.toUpperCase().replace(/\s+/g, "_"))} placeholder="SUPPORT_AGENT" />
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Input value={roleDesc} onChange={(e) => setRoleDesc(e.target.value)} placeholder="What this role can do" />
            </div>
            <div className="grid gap-3">
              {Object.entries(PERM_GROUPS).map(([resource, actions]) => (
                <div key={resource} className="grid gap-1.5">
                  <p className="text-xs font-medium capitalize">{resource}</p>
                  <div className="flex flex-wrap gap-3">
                    {actions.map((a) => {
                      const p = `${resource}.${a}`
                      return (
                        <label key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Checkbox checked={perms.has(p)} onCheckedChange={() => togglePerm(p)} />
                          {a}
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialog(false)}>Cancel</Button>
            <Button
              disabled={!roleName.trim() || perms.size === 0 || roleActions.create.isPending}
              onClick={() =>
                roleActions.create.mutate(
                  { name: roleName, description: roleDesc, permissions: [...perms] },
                  {
                    onSuccess: () => {
                      toast.success(`Role ${roleName} created`)
                      setRoleDialog(false)
                      setRoleName(""); setRoleDesc(""); setPerms(new Set())
                    },
                    onError: (e) => toast.error(errorMessage(e)),
                  }
                )
              }
            >
              Create role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* add admin */}
      <Dialog open={adminDialog} onOpenChange={setAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make user an admin</DialogTitle>
            <DialogDescription>They must already have a FomoBot account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>User email</Label>
              <Input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@company.com" />
            </div>
            <div className="grid gap-1.5">
              <Label>Role</Label>
              <select
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value)}
                className="h-9 rounded-lg border border-border bg-transparent px-3 text-sm"
              >
                <option value="">— pick a role —</option>
                {roles.data?.results.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdminDialog(false)}>Cancel</Button>
            <Button
              disabled={!adminEmail.trim() || createAdmin.isPending}
              onClick={() =>
                createAdmin.mutate(
                  { email: adminEmail, role: adminRole || undefined },
                  {
                    onSuccess: () => {
                      toast.success("Admin added")
                      setAdminDialog(false)
                      setAdminEmail("")
                    },
                    onError: (e) => toast.error(errorMessage(e)),
                  }
                )
              }
            >
              Grant admin access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
