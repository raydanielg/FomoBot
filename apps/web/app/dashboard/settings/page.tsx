"use client"

import * as React from "react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageHeader } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { toast } from "sonner"

import { useAuth } from "@/lib/auth"
import { accountApi, billingApi } from "@/lib/api/resources"
import { errorMessage } from "@/lib/api/client"
import { useOrgMutations } from "@/hooks/api"
import { timeAgo } from "@/lib/format"
import type { Plan, Subscription } from "@/types/api"
import { useQuery } from "@tanstack/react-query"

export default function SettingsPage() {
  const { user, organization, refreshUser } = useAuth()
  const orgMutations = useOrgMutations()

  const [firstName, setFirstName] = React.useState(user?.first_name ?? "")
  const [lastName, setLastName] = React.useState(user?.last_name ?? "")
  const [savingProfile, setSavingProfile] = React.useState(false)

  const [orgName, setOrgName] = React.useState(organization?.name ?? "")
  const [tz, setTz] = React.useState(organization?.timezone ?? "UTC")

  const [currentPw, setCurrentPw] = React.useState("")
  const [newPw, setNewPw] = React.useState("")
  const [changingPw, setChangingPw] = React.useState(false)

  const activity = useQuery({
    queryKey: ["login-activity"],
    queryFn: accountApi.loginActivity,
  })
  const subscription = useQuery({
    queryKey: ["subscription"],
    queryFn: billingApi.subscription,
    retry: false,
  })
  const plans = useQuery({ queryKey: ["plans"], queryFn: billingApi.plans, retry: false })

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await accountApi.updateProfile({ first_name: firstName, last_name: lastName })
      await refreshUser()
      toast.success("Profile updated")
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setSavingProfile(false)
    }
  }

  async function saveOrg(e: React.FormEvent) {
    e.preventDefault()
    if (!organization) return
    orgMutations.update.mutate(
      { id: organization.id, name: orgName, timezone: tz },
      {
        onSuccess: () => toast.success("Organization updated"),
        onError: (err) => toast.error(errorMessage(err)),
      }
    )
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    setChangingPw(true)
    try {
      await accountApi.changePassword({
        current_password: currentPw,
        new_password: newPw,
      })
      toast.success("Password changed")
      setCurrentPw("")
      setNewPw("")
    } catch (err) {
      toast.error(errorMessage(err, "Could not change password."))
    } finally {
      setChangingPw(false)
    }
  }

  const sub = subscription.data as Subscription | undefined
  const planList = Array.isArray(plans.data) ? plans.data : []

  return (
    <DashboardShell crumb="Settings">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader title="Settings" description="Manage your account and workspace." />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle className="text-base">Profile</CardTitle>
                <CardDescription>Your name and account details.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveProfile} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="fn">First name</FieldLabel>
                      <Input id="fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="ln">Last name</FieldLabel>
                      <Input id="ln" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="em">Email</FieldLabel>
                    <Input id="em" value={user?.email ?? ""} disabled />
                  </Field>
                  <Button type="submit" className="self-start" disabled={savingProfile}>
                    {savingProfile && (
                      <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                    )}
                    Save changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organization" className="mt-4">
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle className="text-base">Organization</CardTitle>
                <CardDescription>Workspace name and regional settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveOrg} className="flex flex-col gap-4">
                  <Field>
                    <FieldLabel htmlFor="on">Organization name</FieldLabel>
                    <Input id="on" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel>Timezone</FieldLabel>
                    <Select value={tz} onValueChange={(v) => setTz(v ?? tz)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["UTC", "Africa/Dar_es_Salaam", "Africa/Nairobi", "Europe/London", "America/New_York"].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Button type="submit" className="self-start" disabled={orgMutations.update.isPending}>
                    {orgMutations.update.isPending && (
                      <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                    )}
                    Save changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-4">
            <div className="flex max-w-lg flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Password</CardTitle>
                  <CardDescription>Change the password you sign in with.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={changePassword} className="flex flex-col gap-4">
                    <Field>
                      <FieldLabel htmlFor="cp">Current password</FieldLabel>
                      <Input id="cp" type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="np">New password</FieldLabel>
                      <Input id="np" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} required minLength={8} />
                    </Field>
                    <Button type="submit" className="self-start" disabled={changingPw}>
                      {changingPw && (
                        <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                      )}
                      Change password
                    </Button>
                  </form>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Login activity</CardTitle>
                  <CardDescription>Recent authentication events on your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  {(activity.data ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Result</TableHead>
                          <TableHead>IP</TableHead>
                          <TableHead>When</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(activity.data ?? []).slice(0, 8).map((a, i) => (
                          <TableRow key={i}>
                            <TableCell className="capitalize">{a.result}</TableCell>
                            <TableCell className="font-mono text-xs">{a.ip_address}</TableCell>
                            <TableCell className="text-muted-foreground">{timeAgo(a.created_at)} ago</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-4">
            <div className="grid max-w-3xl gap-4 md:grid-cols-2 xl:grid-cols-3">
              {planList.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Free</CardTitle>
                    <CardDescription>
                      FomoBot is free while in beta.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                planList.map((p: Plan) => {
                  const current = sub?.plan?.code === p.code
                  return (
                    <Card key={p.id} className={current ? "border-primary" : ""}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-base">
                          {p.name}
                          {current && <span className="text-xs font-normal text-primary-foreground">Current plan</span>}
                        </CardTitle>
                        <CardDescription>
                          {Number(p.price) === 0 ? "Free" : `${p.price} ${p.currency}`}
                        </CardDescription>
                      </CardHeader>
                      {p.limits && (
                        <CardContent className="text-sm text-muted-foreground">
                          <ul className="space-y-1">
                            {Object.entries(p.limits).map(([k, v]) => (
                              <li key={k}>
                                {k.replace(/_/g, " ")}: {v === -1 ? "unlimited" : v}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      )}
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
