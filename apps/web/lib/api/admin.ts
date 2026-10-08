import { api } from "@/lib/api/client"
import type { Paginated } from "@/types/api"

const A = (p: string) => `/admin${p}`

export interface AdminOverview {
  users: { total: number; active_today: number; verified: number; new_today: number }
  organizations: { total: number }
  bots: { total: number; connected: number }
  sessions: { active: number }
  messages: { today: number; failed: number; total: number }
  webhooks: { failed: number }
  otp: { today: number }
  security: { open_events: number; failed_logins_today: number }
}

export interface AdminUser {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  is_active: boolean
  is_staff: boolean
  is_email_verified: boolean
  totp_enabled: boolean
  last_login_at: string | null
  last_login_ip: string | null
  failed_login_attempts: number
  locked_until: string | null
  date_joined: string
  organization_count: number
  bot_count: number
  organizations?: { id: string; name: string; role: string }[]
  bots?: { id: string; name: string; status: string }[]
}

export interface AdminOrg {
  id: string
  name: string
  slug: string
  status: string
  country: string
  currency: string
  timezone: string
  plan_code: string
  owner_email: string
  member_count: number
  bot_count: number
  created_at: string
}

export interface AdminBot {
  id: string
  name: string
  slug: string
  phone_number: string
  status: string
  connection_status: string
  organization_id: string
  organization_name: string
  session_state: string | null
  last_connected_at: string | null
  last_seen_at: string | null
  created_at: string
}

export interface AdminSession {
  id: string
  bot: string
  bot_name: string
  organization_name: string
  phone_number: string
  provider: string
  state: string
  last_heartbeat_at: string | null
  last_connected_at: string | null
  reconnect_attempts: number
  last_error: string
  created_at: string
  updated_at: string
}

export interface AdminMessage {
  id: string
  bot: string
  bot_name: string
  organization: string
  organization_name: string
  conversation: string
  contact: string
  direction: string
  message_type: string
  provider_message_id: string
  text: string
  status: string
  error_code: string | null
  error_message: string | null
  sent_at: string | null
  delivered_at: string | null
  read_at: string | null
  created_at: string
}

export interface AdminAuditEntry {
  id: string
  organization: string | null
  actor: string | null
  actor_email: string
  action: string
  target_type: string
  target_id: string
  metadata: Record<string, unknown>
  ip_address: string | null
  created_at: string
}

export interface AdminSecurityEvent {
  id: string
  kind: string
  user: string | null
  user_email: string
  detail: string
  metadata: Record<string, unknown>
  ip_address: string | null
  created_at: string
}

export interface AdminLoginActivity {
  id: number
  user: string
  email: string
  result: string
  ip_address: string | null
  user_agent: string
  created_at: string
}

export interface AdminOTP {
  id: string
  user: string | null
  user_email: string
  identifier: string
  purpose: string
  channel: string
  status: string
  attempts: number
  max_attempts: number
  expires_at: string
  verified_at: string | null
  ip_address: string | null
  created_at: string
}

export interface AdminRole {
  id: string
  name: string
  description: string
  permissions: string[]
  is_system: boolean
  admin_count: number
  created_at: string
}

export interface AdminAdminUser {
  id: string
  user: string
  email: string
  name: string
  status: string
  role_names: string[]
  created_at: string
}

export interface AdminAnnouncement {
  id: string
  title: string
  message: string
  severity: string
  audience: string
  channels: string[]
  starts_at: string | null
  ends_at: string | null
  status: string
  sent_count: number
  created_at: string
}

export interface AdminFeatureFlag {
  id: string
  key: string
  description: string
  enabled: boolean
  rollout_percent: number
  target_organizations: string[]
  target_plans: string[]
  created_at: string
  updated_at: string
}

export interface AdminPlan {
  id: string
  code: string
  name: string
  price_monthly: string
  price_yearly: string
  limits: Record<string, number>
  created_at: string
}

export interface AdminHealth {
  overall: string
  components: { name: string; key: string; status: string }[]
}

type Params = Record<string, string | number | boolean | undefined | null>

export const adminApi = {
  overview: () => api<AdminOverview>(A("/overview/")),
  health: () => api<AdminHealth>(A("/health/")),
  queues: () =>
    api<{ workers: { name: string; active: number; scheduled: number; reserved: number }[]; online: boolean }>(
      A("/queues/")
    ),
  broadcast: (body: { title: string; body: string; audience: string; channel: string }) =>
    api<{ detail: string; recipients: number }>(A("/broadcast/"), { method: "POST", body }),
  broadcastEstimate: (audience: string) =>
    api<{ recipients: number }>(A("/broadcast/"), { params: { audience } }),

  users: (params?: Params) => api<Paginated<AdminUser>>(A("/users/"), { params }),
  user: (id: string) => api<AdminUser>(A(`/users/${id}/`)),
  userAction: (id: string, action: string, body?: unknown) =>
    api(A(`/users/${id}/${action}/`), { method: "POST", body }),
  userNotes: (id: string) => api<{ id: string; body: string; author_email: string; created_at: string }[]>(A(`/users/${id}/notes/`)),

  organizations: (params?: Params) => api<Paginated<AdminOrg>>(A("/organizations/"), { params }),
  orgAction: (id: string, action: string, body?: unknown) =>
    api(A(`/organizations/${id}/${action}/`), { method: "POST", body }),

  bots: (params?: Params) => api<Paginated<AdminBot>>(A("/bots/"), { params }),
  botAction: (id: string, action: string) => api(A(`/bots/${id}/${action}/`), { method: "POST" }),

  sessions: (params?: Params) => api<Paginated<AdminSession>>(A("/sessions/"), { params }),
  messages: (params?: Params) => api<Paginated<AdminMessage>>(A("/messages/"), { params }),
  contacts: (params?: Params) => api<Paginated<unknown>>(A("/contacts/"), { params }),
  conversations: (params?: Params) => api<Paginated<unknown>>(A("/conversations/"), { params }),
  automations: (params?: Params) => api<Paginated<unknown>>(A("/automations/"), { params }),

  auditLogs: (params?: Params) => api<Paginated<AdminAuditEntry>>(A("/audit-logs/"), { params }),
  loginActivity: (params?: Params) =>
    api<Paginated<AdminLoginActivity> | AdminLoginActivity[]>(A("/login-activity/"), { params }),
  securityEvents: (params?: Params) => api<Paginated<AdminSecurityEvent>>(A("/security-events/"), { params }),

  otps: (params?: Params) => api<Paginated<AdminOTP>>(A("/otp/"), { params }),
  otpStats: () =>
    api<{ today: number; verified: number; failed: number; expired: number }>(A("/otp/stats/")),
  otpInvalidate: (id: string) => api(A(`/otp/${id}/invalidate/`), { method: "POST" }),

  announcements: () => api<Paginated<AdminAnnouncement>>(A("/announcements/")),
  createAnnouncement: (body: Partial<AdminAnnouncement>) =>
    api<AdminAnnouncement>(A("/announcements/"), { method: "POST", body }),
  publishAnnouncement: (id: string) =>
    api<{ detail: string }>(A(`/announcements/${id}/publish/`), { method: "POST" }),

  featureFlags: () => api<Paginated<AdminFeatureFlag>>(A("/feature-flags/")),
  createFlag: (body: Partial<AdminFeatureFlag>) =>
    api<AdminFeatureFlag>(A("/feature-flags/"), { method: "POST", body }),
  updateFlag: (id: string, body: Partial<AdminFeatureFlag>) =>
    api<AdminFeatureFlag>(A(`/feature-flags/${id}/`), { method: "PATCH", body }),
  deleteFlag: (id: string) => api(A(`/feature-flags/${id}/`), { method: "DELETE" }),

  roles: () => api<Paginated<AdminRole>>(A("/roles/")),
  createRole: (body: { name: string; description?: string; permissions: string[] }) =>
    api<AdminRole>(A("/roles/"), { method: "POST", body }),
  updateRole: (id: string, body: Partial<AdminRole>) =>
    api<AdminRole>(A(`/roles/${id}/`), { method: "PATCH", body }),
  deleteRole: (id: string) => api(A(`/roles/${id}/`), { method: "DELETE" }),

  adminUsers: () => api<Paginated<AdminAdminUser>>(A("/admin-users/")),
  createAdmin: (body: { email: string; role?: string }) =>
    api<AdminAdminUser>(A("/admin-users/"), { method: "POST", body }),

  plans: () => api<Paginated<AdminPlan>>(A("/plans/")),
  updatePlan: (id: string, body: Partial<AdminPlan>) =>
    api<AdminPlan>(A(`/plans/${id}/`), { method: "PATCH", body }),
}
