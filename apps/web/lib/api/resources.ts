import { api } from "@/lib/api/client"
import type {
  APIKey,
  APIKeyCreated,
  ApiRequestLog,
  AppEvent,
  AppNotification,
  Automation,
  AutomationRun,
  Bot,
  BotStatus,
  Contact,
  Conversation,
  DashboardOverview,
  Membership,
  Message,
  MessageStatPoint,
  MessageTemplate,
  Organization,
  Paginated,
  Plan,
  QRPayload,
  Subscription,
  Webhook,
  WebhookDelivery,
} from "@/types/api"

type Params = Record<string, string | number | boolean | undefined | null>

// --- Bots ---
export const botsApi = {
  list: (params?: Params) => api<Paginated<Bot>>("/bots/", { params }),
  get: (id: string) => api<Bot>(`/bots/${id}/`),
  create: (body: Partial<Bot>) =>
    api<Bot>("/bots/", { method: "POST", body }),
  update: (id: string, body: Partial<Bot>) =>
    api<Bot>(`/bots/${id}/`, { method: "PATCH", body }),
  remove: (id: string) => api(`/bots/${id}/`, { method: "DELETE" }),
  connect: (id: string) => api<QRPayload>(`/bots/${id}/connect/`, { method: "POST" }),
  disconnect: (id: string) => api<{ state: string }>(`/bots/${id}/disconnect/`, { method: "POST" }),
  reconnect: (id: string) => api<{ state: string }>(`/bots/${id}/reconnect/`, { method: "POST" }),
  logout: (id: string) => api<{ state: string }>(`/bots/${id}/logout/`, { method: "POST" }),
  status: (id: string) => api<BotStatus>(`/bots/${id}/status/`),
  qr: (id: string) => api<QRPayload>(`/bots/${id}/qr/`),
  simulateScan: (id: string, phone_number?: string) =>
    api<{ state: string }>(`/bots/${id}/qr/simulate-scan/`, {
      method: "POST",
      body: { phone_number },
    }),
}

// --- Conversations ---
export const conversationsApi = {
  list: (params?: Params) => api<Paginated<Conversation>>("/conversations/", { params }),
  get: (id: string) => api<Conversation>(`/conversations/${id}/`),
  messages: (id: string, params?: Params) =>
    api<Paginated<Message>>(`/conversations/${id}/messages/`, { params }),
  reply: (id: string, body: { text: string }) =>
    api<Message>(`/conversations/${id}/messages/send/`, { method: "POST", body }),
  markRead: (id: string) => api(`/conversations/${id}/read/`, { method: "POST" }),
  archive: (id: string) => api(`/conversations/${id}/archive/`, { method: "POST" }),
  close: (id: string) => api(`/conversations/${id}/close/`, { method: "POST" }),
  reopen: (id: string) => api(`/conversations/${id}/reopen/`, { method: "POST" }),
  assign: (id: string, user: string | null) =>
    api(`/conversations/${id}/assign/`, { method: "POST", body: { user } }),
}

// --- Messages ---
export const messagesApi = {
  list: (params?: Params) => api<Paginated<Message>>("/messages/", { params }),
  get: (id: string) => api<Message>(`/messages/${id}/`),
  send: (body: { bot?: string; contact?: string; to?: string; type?: string; text: string; [k: string]: unknown }) =>
    api<Message>("/messages/send/", { method: "POST", body }),
}

// --- Contacts ---
export const contactsApi = {
  list: (params?: Params) => api<Paginated<Contact>>("/contacts/", { params }),
  get: (id: string) => api<Contact>(`/contacts/${id}/`),
  create: (body: Partial<Contact>) => api<Contact>("/contacts/", { method: "POST", body }),
  update: (id: string, body: Partial<Contact>) =>
    api<Contact>(`/contacts/${id}/`, { method: "PATCH", body }),
  remove: (id: string) => api(`/contacts/${id}/`, { method: "DELETE" }),
}

// --- Automations ---
export const automationsApi = {
  list: (params?: Params) => api<Paginated<Automation>>("/automations/", { params }),
  get: (id: string) => api<Automation>(`/automations/${id}/`),
  create: (body: Partial<Automation>) =>
    api<Automation>("/automations/", { method: "POST", body }),
  update: (id: string, body: Partial<Automation>) =>
    api<Automation>(`/automations/${id}/`, { method: "PATCH", body }),
  remove: (id: string) => api(`/automations/${id}/`, { method: "DELETE" }),
  runs: (id: string) => api<Paginated<AutomationRun>>(`/automations/${id}/runs/`),
}

// --- Templates ---
export const templatesApi = {
  list: (params?: Params) => api<Paginated<MessageTemplate>>("/templates/", { params }),
  get: (id: string) => api<MessageTemplate>(`/templates/${id}/`),
  create: (body: Partial<MessageTemplate>) =>
    api<MessageTemplate>("/templates/", { method: "POST", body }),
  update: (id: string, body: Partial<MessageTemplate>) =>
    api<MessageTemplate>(`/templates/${id}/`, { method: "PATCH", body }),
  remove: (id: string) => api(`/templates/${id}/`, { method: "DELETE" }),
  render: (id: string, context: Record<string, string>) =>
    api<{ rendered: string }>(`/templates/${id}/render/`, { method: "POST", body: context }),
}

// --- API keys ---
export const apiKeysApi = {
  list: (params?: Params) => api<Paginated<APIKey>>("/api-keys/", { params }),
  create: (body: { name: string; environment?: string; scopes?: string[]; allowed_ips?: string[]; expires_at?: string | null }) =>
    api<APIKeyCreated>("/api-keys/", { method: "POST", body }),
  get: (id: string) => api<APIKey>(`/api-keys/${id}/`),
  remove: (id: string) => api(`/api-keys/${id}/`, { method: "DELETE" }),
  revoke: (id: string) => api(`/api-keys/${id}/revoke/`, { method: "POST" }),
  rotate: (id: string) => api<APIKeyCreated>(`/api-keys/${id}/rotate/`, { method: "POST" }),
}

// --- Webhooks ---
export const webhooksApi = {
  list: (params?: Params) => api<Paginated<Webhook>>("/webhooks/", { params }),
  get: (id: string) => api<Webhook>(`/webhooks/${id}/`),
  create: (body: Partial<Webhook>) => api<Webhook>("/webhooks/", { method: "POST", body }),
  update: (id: string, body: Partial<Webhook>) =>
    api<Webhook>(`/webhooks/${id}/`, { method: "PATCH", body }),
  remove: (id: string) => api(`/webhooks/${id}/`, { method: "DELETE" }),
  rotateSecret: (id: string) =>
    api<Webhook & { secret?: string }>(`/webhooks/${id}/rotate-secret/`, { method: "POST" }),
  deliveries: (id: string) => api<Paginated<WebhookDelivery>>(`/webhooks/${id}/deliveries/`),
  test: (id: string) => api(`/webhooks/${id}/test/`, { method: "POST" }),
  replayDelivery: (id: string, deliveryId: string) =>
    api(`/webhooks/${id}/deliveries/${deliveryId}/replay/`, { method: "POST" }),
  deliveriesList: (params?: Params) =>
    api<Paginated<WebhookDelivery>>("/webhook-deliveries/", { params }),
}

// --- Logs ---
export const logsApi = {
  apiRequests: (params?: Params) =>
    api<Paginated<ApiRequestLog>>("/logs/api-requests/", { params }),
  events: (params?: Params) => api<Paginated<AppEvent>>("/logs/events/", { params }),
}

// --- Notifications ---
export const notificationsApi = {
  list: (params?: Params) => api<Paginated<AppNotification>>("/notifications/", { params }),
  markRead: (id: string) => api(`/notifications/${id}/read/`, { method: "POST" }),
  markAllRead: () => api("/notifications/read-all/", { method: "POST" }),
  unreadCount: () => api<{ count: number }>("/notifications/unread_count/"),
}

// --- Dashboard ---
export const dashboardApi = {
  overview: () => api<DashboardOverview>("/dashboard/overview/"),
  messageStats: (days = 14) =>
    api<MessageStatPoint[]>("/dashboard/message-stats/", { params: { days } }),
}

// --- Organizations ---
export const organizationsApi = {
  list: () => api<Paginated<Organization>>("/organizations/"),
  get: (id: string) => api<Organization>(`/organizations/${id}/`),
  create: (body: { name: string; description?: string; timezone?: string; country?: string; currency?: string }) =>
    api<Organization>("/organizations/", { method: "POST", body }),
  update: (id: string, body: Partial<Organization>) =>
    api<Organization>(`/organizations/${id}/`, { method: "PATCH", body }),
  members: (id: string) => api<Paginated<Membership> | Membership[]>(`/organizations/${id}/members/`),
  invite: (id: string, body: { email: string; role: string }) =>
    api(`/organizations/${id}/members/invite/`, { method: "POST", body }),
  changeRole: (id: string, memberId: string, role: string) =>
    api(`/organizations/${id}/members/${memberId}/role/`, { method: "POST", body: { role } }),
  removeMember: (id: string, memberId: string) =>
    api(`/organizations/${id}/members/${memberId}/`, { method: "DELETE" }),
  invitations: (id: string) => api(`/organizations/${id}/invitations/`),
}

// --- Account ---
export const accountApi = {
  updateProfile: (body: { first_name?: string; last_name?: string; avatar_url?: string }) =>
    api("/auth/me/", { method: "PATCH", body }),
  changePassword: (body: { current_password: string; new_password: string }) =>
    api("/auth/password/change/", { method: "POST", body }),
  requestReset: (email: string) =>
    api("/auth/password/reset/", { method: "POST", body: { email }, auth: false }),
  confirmReset: (body: { uid: string; token: string; new_password: string }) =>
    api("/auth/password/reset/confirm/", { method: "POST", body, auth: false }),
  verifyEmail: (body: { uid: string; token: string }) =>
    api("/auth/verify-email/", { method: "POST", body, auth: false }),
  loginActivity: () =>
    api<{ result: string; ip_address: string; user_agent: string; created_at: string }[]>(
      "/auth/me/activity/"
    ),
  deactivate: () => api("/auth/me/deactivate/", { method: "POST" }),
}

// --- Billing ---
export const billingApi = {
  plans: () => api<Plan[]>("/plans/"),
  subscription: () => api<Subscription>("/subscription/"),
}
