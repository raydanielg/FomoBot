"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { adminApi } from "@/lib/api/admin"

type Params = Record<string, string | number | boolean | undefined | null>

function useInvalidate() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: ["admin"] })
}

export const useAdminOverview = () =>
  useQuery({ queryKey: ["admin", "overview"], queryFn: adminApi.overview, refetchInterval: 30_000 })
export const useAdminHealth = () =>
  useQuery({ queryKey: ["admin", "health"], queryFn: adminApi.health, refetchInterval: 30_000 })
export const useAdminQueues = () =>
  useQuery({ queryKey: ["admin", "queues"], queryFn: adminApi.queues, refetchInterval: 15_000 })

export const useAdminUsers = (params?: Params) =>
  useQuery({ queryKey: ["admin", "users", params], queryFn: () => adminApi.users(params) })
export const useAdminUser = (id: string) =>
  useQuery({ queryKey: ["admin", "users", id], queryFn: () => adminApi.user(id), enabled: !!id })
export const useAdminUserNotes = (id: string) =>
  useQuery({ queryKey: ["admin", "users", id, "notes"], queryFn: () => adminApi.userNotes(id), enabled: !!id })

export function useAdminUserActions(id?: string) {
  const invalidate = useInvalidate()
  const run = (action: string, userId?: string, body?: unknown) =>
    adminApi.userAction(userId ?? id!, action, body)
  return {
    suspend: useMutation({ mutationFn: (o: { id: string; reason?: string }) => run("suspend", o.id, { reason: o.reason }), onSuccess: invalidate }),
    activate: useMutation({ mutationFn: (id: string) => run("activate", id), onSuccess: invalidate }),
    verifyEmail: useMutation({ mutationFn: (id: string) => run("verify-email", id), onSuccess: invalidate }),
    forceLogout: useMutation({ mutationFn: (id: string) => run("force-logout", id), onSuccess: invalidate }),
    resetPassword: useMutation({ mutationFn: ({ id, password }: { id: string; password?: string }) => run("reset-password", id, { password }), onSuccess: invalidate }),
    impersonate: useMutation({ mutationFn: (id: string) => run("impersonate", id) }),
    addNote: useMutation({ mutationFn: ({ id, body }: { id: string; body: string }) => run("notes", id, { body }), onSuccess: invalidate }),
  }
}

export const useAdminOrgs = (params?: Params) =>
  useQuery({ queryKey: ["admin", "organizations", params], queryFn: () => adminApi.organizations(params) })
export function useAdminOrgActions() {
  const invalidate = useInvalidate()
  return {
    suspend: useMutation({ mutationFn: (id: string) => adminApi.orgAction(id, "suspend"), onSuccess: invalidate }),
    activate: useMutation({ mutationFn: (id: string) => adminApi.orgAction(id, "activate"), onSuccess: invalidate }),
    changePlan: useMutation({ mutationFn: ({ id, plan }: { id: string; plan: string }) => adminApi.orgAction(id, "change-plan", { plan }), onSuccess: invalidate }),
  }
}

export const useAdminBots = (params?: Params) =>
  useQuery({ queryKey: ["admin", "bots", params], queryFn: () => adminApi.bots(params) })
export function useAdminBotActions() {
  const invalidate = useInvalidate()
  return {
    disconnect: useMutation({ mutationFn: (id: string) => adminApi.botAction(id, "disconnect"), onSuccess: invalidate }),
    reconnect: useMutation({ mutationFn: (id: string) => adminApi.botAction(id, "reconnect"), onSuccess: invalidate }),
    logout: useMutation({ mutationFn: (id: string) => adminApi.botAction(id, "logout"), onSuccess: invalidate }),
    disable: useMutation({ mutationFn: (id: string) => adminApi.botAction(id, "disable"), onSuccess: invalidate }),
    enable: useMutation({ mutationFn: (id: string) => adminApi.botAction(id, "enable"), onSuccess: invalidate }),
  }
}

export const useAdminSessions = (params?: Params) =>
  useQuery({ queryKey: ["admin", "sessions", params], queryFn: () => adminApi.sessions(params), refetchInterval: 10_000 })
export const useAdminMessages = (params?: Params) =>
  useQuery({ queryKey: ["admin", "messages", params], queryFn: () => adminApi.messages(params) })
export const useAdminAudit = (params?: Params) =>
  useQuery({ queryKey: ["admin", "audit", params], queryFn: () => adminApi.auditLogs(params) })
export const useAdminLoginActivity = (params?: Params) =>
  useQuery({ queryKey: ["admin", "login-activity", params], queryFn: () => adminApi.loginActivity(params) })
export const useAdminSecurityEvents = (params?: Params) =>
  useQuery({ queryKey: ["admin", "security-events", params], queryFn: () => adminApi.securityEvents(params) })

export const useAdminOtps = (params?: Params) =>
  useQuery({ queryKey: ["admin", "otp", params], queryFn: () => adminApi.otps(params) })
export const useAdminOtpStats = () =>
  useQuery({ queryKey: ["admin", "otp", "stats"], queryFn: adminApi.otpStats })
export const useAdminOtpInvalidate = () => {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: adminApi.otpInvalidate, onSuccess: invalidate })
}

export const useAdminAnnouncements = () =>
  useQuery({ queryKey: ["admin", "announcements"], queryFn: adminApi.announcements })
export function useAdminAnnouncementActions() {
  const invalidate = useInvalidate()
  return {
    create: useMutation({ mutationFn: adminApi.createAnnouncement, onSuccess: invalidate }),
    publish: useMutation({ mutationFn: adminApi.publishAnnouncement, onSuccess: invalidate }),
  }
}

export const useAdminFlags = () =>
  useQuery({ queryKey: ["admin", "flags"], queryFn: adminApi.featureFlags })
export function useAdminFlagActions() {
  const invalidate = useInvalidate()
  return {
    create: useMutation({ mutationFn: adminApi.createFlag, onSuccess: invalidate }),
    update: useMutation({ mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) => adminApi.updateFlag(id, body), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: adminApi.deleteFlag, onSuccess: invalidate }),
  }
}

export const useAdminRoles = () =>
  useQuery({ queryKey: ["admin", "roles"], queryFn: adminApi.roles })
export function useAdminRoleActions() {
  const invalidate = useInvalidate()
  return {
    create: useMutation({ mutationFn: adminApi.createRole, onSuccess: invalidate }),
    update: useMutation({ mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) => adminApi.updateRole(id, body), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: adminApi.deleteRole, onSuccess: invalidate }),
  }
}

export const useAdminAdmins = () =>
  useQuery({ queryKey: ["admin", "admin-users"], queryFn: adminApi.adminUsers })
export const useAdminCreateAdmin = () => {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: adminApi.createAdmin, onSuccess: invalidate })
}

export const useAdminPlans = () =>
  useQuery({ queryKey: ["admin", "plans"], queryFn: adminApi.plans })
export const useAdminUpdatePlan = () => {
  const invalidate = useInvalidate()
  return useMutation({ mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) => adminApi.updatePlan(id, body), onSuccess: invalidate })
}

export const useAdminBroadcast = () =>
  useMutation({ mutationFn: adminApi.broadcast })
export const useAdminBroadcastEstimate = (audience: string) =>
  useQuery({
    queryKey: ["admin", "broadcast-estimate", audience],
    queryFn: () => adminApi.broadcastEstimate(audience),
    enabled: !!audience,
  })
