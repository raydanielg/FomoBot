"use client"

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  apiKeysApi,
  automationsApi,
  contactsApi,
  conversationsApi,
  dashboardApi,
  logsApi,
  messagesApi,
  notificationsApi,
  organizationsApi,
  templatesApi,
  webhooksApi,
  botsApi,
} from "@/lib/api/resources"

type Params = Record<string, string | number | boolean | undefined | null>

function useInvalidate() {
  const qc = useQueryClient()
  return (key: string) => qc.invalidateQueries({ queryKey: [key] })
}

// --- Dashboard ---
export const useOverview = () =>
  useQuery({ queryKey: ["overview"], queryFn: dashboardApi.overview, refetchInterval: 30_000 })
export const useMessageStats = (days = 14) =>
  useQuery({ queryKey: ["message-stats", days], queryFn: () => dashboardApi.messageStats(days) })
export const useBotStats = (days = 30) =>
  useQuery({ queryKey: ["bot-stats", days], queryFn: () => dashboardApi.botStats(days) })
export const useStatusBreakdown = () =>
  useQuery({ queryKey: ["status-breakdown"], queryFn: dashboardApi.statusBreakdown, refetchInterval: 60_000 })
export const useHourlyActivity = (days = 30) =>
  useQuery({ queryKey: ["hourly-activity", days], queryFn: () => dashboardApi.hourlyActivity(days) })

// --- Bots ---
export const useBots = (params?: Params) =>
  useQuery({ queryKey: ["bots", params], queryFn: () => botsApi.list(params) })
export const useBot = (id: string) =>
  useQuery({ queryKey: ["bots", id], queryFn: () => botsApi.get(id) })
export const useBotStatus = (id: string, enabled = true) =>
  useQuery({
    queryKey: ["bots", id, "status"],
    queryFn: () => botsApi.status(id),
    refetchInterval: enabled ? 4000 : false,
  })
export const useBotQr = (id: string, enabled = false) =>
  useQuery({
    queryKey: ["bots", id, "qr"],
    queryFn: () => botsApi.qr(id),
    enabled,
  })
export function useBotMutations() {
  const invalidate = useInvalidate()
  return {
    create: useMutation({
      mutationFn: botsApi.create,
      onSuccess: () => invalidate("bots"),
    }),
    update: useMutation({
      mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) =>
        botsApi.update(id, body),
      onSuccess: () => invalidate("bots"),
    }),
    remove: useMutation({
      mutationFn: botsApi.remove,
      onSuccess: () => invalidate("bots"),
    }),
    connect: useMutation({ mutationFn: botsApi.connect }),
    disconnect: useMutation({
      mutationFn: botsApi.disconnect,
      onSuccess: () => invalidate("bots"),
    }),
    reconnect: useMutation({
      mutationFn: botsApi.reconnect,
      onSuccess: () => invalidate("bots"),
    }),
    simulateScan: useMutation({ mutationFn: ({ id, phone }: { id: string; phone?: string }) => botsApi.simulateScan(id, phone) }),
  }
}

// --- Conversations ---
export const useConversations = (params?: Params) =>
  useQuery({ queryKey: ["conversations", params], queryFn: () => conversationsApi.list(params) })
export const useConversationMessages = (id: string) =>
  useQuery({
    queryKey: ["conversations", id, "messages"],
    queryFn: () => conversationsApi.messages(id, { page_size: 100 }),
    refetchInterval: 5000,
  })
export function useConversationActions(id: string) {
  const qc = useQueryClient()
  const done = () => {
    qc.invalidateQueries({ queryKey: ["conversations"] })
  }
  return {
    reply: useMutation({
      mutationFn: (text: string) => conversationsApi.reply(id, { text }),
      onSuccess: done,
    }),
    markRead: useMutation({ mutationFn: () => conversationsApi.markRead(id), onSuccess: done }),
    archive: useMutation({ mutationFn: () => conversationsApi.archive(id), onSuccess: done }),
    close: useMutation({ mutationFn: () => conversationsApi.close(id), onSuccess: done }),
    reopen: useMutation({ mutationFn: () => conversationsApi.reopen(id), onSuccess: done }),
  }
}

// --- Contacts ---
export const useContacts = (params?: Params) =>
  useQuery({ queryKey: ["contacts", params], queryFn: () => contactsApi.list(params) })
export function useContactMutations() {
  const invalidate = useInvalidate()
  return {
    create: useMutation({ mutationFn: contactsApi.create, onSuccess: () => invalidate("contacts") }),
    update: useMutation({
      mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) =>
        contactsApi.update(id, body),
      onSuccess: () => invalidate("contacts"),
    }),
    remove: useMutation({ mutationFn: contactsApi.remove, onSuccess: () => invalidate("contacts") }),
  }
}

// --- Automations ---
export const useAutomations = (params?: Params) =>
  useQuery({ queryKey: ["automations", params], queryFn: () => automationsApi.list(params) })
export const useAutomation = (id: string) =>
  useQuery({ queryKey: ["automations", id], queryFn: () => automationsApi.get(id) })
export const useAutomationRuns = (id: string) =>
  useQuery({ queryKey: ["automations", id, "runs"], queryFn: () => automationsApi.runs(id) })
export function useAutomationMutations() {
  const invalidate = useInvalidate()
  return {
    create: useMutation({ mutationFn: automationsApi.create, onSuccess: () => invalidate("automations") }),
    update: useMutation({
      mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) =>
        automationsApi.update(id, body),
      onSuccess: () => invalidate("automations"),
    }),
    remove: useMutation({ mutationFn: automationsApi.remove, onSuccess: () => invalidate("automations") }),
  }
}

// --- Templates ---
export const useTemplates = (params?: Params) =>
  useQuery({ queryKey: ["templates", params], queryFn: () => templatesApi.list(params) })
export function useTemplateMutations() {
  const invalidate = useInvalidate()
  return {
    create: useMutation({ mutationFn: templatesApi.create, onSuccess: () => invalidate("templates") }),
    update: useMutation({
      mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) =>
        templatesApi.update(id, body),
      onSuccess: () => invalidate("templates"),
    }),
    remove: useMutation({ mutationFn: templatesApi.remove, onSuccess: () => invalidate("templates") }),
  }
}

// --- API keys ---
export const useApiKeys = (params?: Params) =>
  useQuery({ queryKey: ["api-keys", params], queryFn: () => apiKeysApi.list(params) })
export function useApiKeyMutations() {
  const invalidate = useInvalidate()
  return {
    create: useMutation({ mutationFn: apiKeysApi.create, onSuccess: () => invalidate("api-keys") }),
    revoke: useMutation({ mutationFn: apiKeysApi.revoke, onSuccess: () => invalidate("api-keys") }),
    rotate: useMutation({ mutationFn: apiKeysApi.rotate, onSuccess: () => invalidate("api-keys") }),
    remove: useMutation({ mutationFn: apiKeysApi.remove, onSuccess: () => invalidate("api-keys") }),
  }
}

// --- Webhooks ---
export const useWebhooks = (params?: Params) =>
  useQuery({ queryKey: ["webhooks", params], queryFn: () => webhooksApi.list(params) })
export const useWebhook = (id: string) =>
  useQuery({ queryKey: ["webhooks", id], queryFn: () => webhooksApi.get(id) })
export const useWebhookDeliveries = (id: string) =>
  useQuery({ queryKey: ["webhooks", id, "deliveries"], queryFn: () => webhooksApi.deliveries(id) })
export function useWebhookMutations() {
  const invalidate = useInvalidate()
  return {
    create: useMutation({ mutationFn: webhooksApi.create, onSuccess: () => invalidate("webhooks") }),
    update: useMutation({
      mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) =>
        webhooksApi.update(id, body),
      onSuccess: () => invalidate("webhooks"),
    }),
    remove: useMutation({ mutationFn: webhooksApi.remove, onSuccess: () => invalidate("webhooks") }),
    test: useMutation({ mutationFn: webhooksApi.test }),
    rotateSecret: useMutation({ mutationFn: webhooksApi.rotateSecret }),
    replayDelivery: useMutation({
      mutationFn: ({ id, deliveryId }: { id: string; deliveryId: string }) =>
        webhooksApi.replayDelivery(id, deliveryId),
    }),
  }
}

// --- Logs ---
export const useApiRequestLogs = (params?: Params) =>
  useQuery({ queryKey: ["logs", "api-requests", params], queryFn: () => logsApi.apiRequests(params) })
export const useEventLogs = (params?: Params) =>
  useQuery({ queryKey: ["logs", "events", params], queryFn: () => logsApi.events(params) })

// --- Notifications ---
export const useNotifications = (params?: Params) =>
  useQuery({ queryKey: ["notifications", params], queryFn: () => notificationsApi.list(params) })
export const useUnreadCount = () =>
  useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: notificationsApi.unreadCount,
    refetchInterval: 20_000,
  })
export function useNotificationMutations() {
  const invalidate = useInvalidate()
  return {
    markRead: useMutation({ mutationFn: notificationsApi.markRead, onSuccess: () => invalidate("notifications") }),
    markAllRead: useMutation({ mutationFn: notificationsApi.markAllRead, onSuccess: () => invalidate("notifications") }),
  }
}

// --- Messages ---
export const useSendMessage = () =>
  useMutation({ mutationFn: messagesApi.send })

// --- Organizations ---
export const useOrgMembers = (orgId?: string) =>
  useQuery({
    queryKey: ["organizations", orgId, "members"],
    queryFn: () => organizationsApi.members(orgId!),
    enabled: !!orgId,
  })
export function useOrgMutations() {
  const invalidate = useInvalidate()
  return {
    create: useMutation({ mutationFn: organizationsApi.create, onSuccess: () => invalidate("organizations") }),
    update: useMutation({
      mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) =>
        organizationsApi.update(id, body),
      onSuccess: () => invalidate("organizations"),
    }),
    invite: useMutation({
      mutationFn: ({ id, ...body }: { id: string; email: string; role: string }) =>
        organizationsApi.invite(id, body),
      onSuccess: () => invalidate("organizations"),
    }),
    changeRole: useMutation({
      mutationFn: ({ id, memberId, role }: { id: string; memberId: string; role: string }) =>
        organizationsApi.changeRole(id, memberId, role),
      onSuccess: () => invalidate("organizations"),
    }),
    removeMember: useMutation({
      mutationFn: ({ id, memberId }: { id: string; memberId: string }) =>
        organizationsApi.removeMember(id, memberId),
      onSuccess: () => invalidate("organizations"),
    }),
  }
}
