export interface Paginated<T> {
  results: T[]
  count: number
  page: number
  page_size: number
  total_pages: number
  next: string | null
  previous: string | null
}

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  avatar_url: string | null
  is_email_verified: boolean
  is_staff?: boolean
  is_platform_admin?: boolean
  admin_permissions?: string[]
  last_login_at: string | null
  date_joined: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  description: string
  logo: string | null
  timezone: string
  country: string
  currency: string
  status: string
  plan_code: string
  member_count: number
  created_at: string
  updated_at: string
}

export type OrgRole = "owner" | "admin" | "developer" | "agent" | "viewer"

export interface Membership {
  id: string
  user: string
  role: OrgRole
  status: "active" | "invited" | "suspended"
  joined_at: string | null
  invited_at: string | null
  created_at: string
}

export type BotConnectionStatus =
  | "disconnected"
  | "connecting"
  | "qr_required"
  | "connected"
  | "reconnecting"
  | "logged_out"
  | "error"

export interface Bot {
  id: string
  name: string
  slug: string
  description: string
  phone_number: string
  phone_country: string
  status: "active" | "paused" | "disabled" | "deleted"
  connection_status: BotConnectionStatus
  last_connected_at: string | null
  last_disconnected_at: string | null
  last_seen_at: string | null
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface BotStatus {
  bot_id: string
  connection_status: BotConnectionStatus
  session_state: string | null
  phone_number: string
  last_connected_at: string | null
  last_disconnected_at: string | null
  last_heartbeat_at: string | null
  reconnect_attempts: number
}

export interface QRPayload {
  state: string
  qr: string
  expires_at: string
}

export interface Contact {
  id: string
  phone_number: string
  name: string
  profile_name: string
  country: string
  avatar_url: string | null
  tags: string[]
  notes: string
  metadata: Record<string, unknown>
  first_seen_at: string | null
  last_seen_at: string | null
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  bot_id: string
  contact: Contact | string
  status: "open" | "closed" | "archived"
  labels: string[]
  last_message: Message | null
  last_message_at: string | null
  unread_count: number
  assigned_user: string | null
  assigned_user_email: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  bot: string
  conversation: string
  contact: string
  direction: "inbound" | "outbound"
  message_type: string
  provider_message_id: string
  text: string
  media_url: string | null
  media_type: string | null
  caption: string
  metadata: Record<string, unknown>
  status: "queued" | "sent" | "delivered" | "read" | "failed"
  error_code: string | null
  error_message: string | null
  sent_at: string | null
  delivered_at: string | null
  read_at: string | null
  created_at: string
}

export interface Automation {
  id: string
  name: string
  description: string
  bot: string | null
  trigger_type: string
  status: "active" | "paused" | "disabled"
  priority: number
  run_count: number
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  created_at: string
  updated_at: string
}

export interface AutomationCondition {
  id?: string
  field: string
  operator: string
  value: string
  case_insensitive: boolean
}

export interface AutomationAction {
  id?: string
  action_type: string
  config: Record<string, unknown>
  order: number
}

export interface AutomationRun {
  id: string
  automation: string
  event: string
  status: string
  log: string
  started_at: string | null
  finished_at: string | null
}

export interface MessageTemplate {
  id: string
  name: string
  content: string
  language: string
  variables: string[]
  status: string
  created_at: string
  updated_at: string
}

export interface APIKey {
  id: string
  name: string
  environment: "live" | "test"
  prefix: string
  scopes: string[]
  status: string
  allowed_ips: string[]
  expires_at: string | null
  last_used_at: string | null
  created_by_email: string | null
  created_at: string
}

export interface APIKeyCreated {
  id: string
  api_key: string
  prefix: string
  name: string
  environment: string
  scopes: string[]
}

export interface Webhook {
  id: string
  name: string
  url: string
  bot: string | null
  status: string
  subscribed_events: string[]
  consecutive_failures: number
  created_at: string
  updated_at: string
}

export interface WebhookDelivery {
  id: string
  webhook: string
  event: string
  status: string
  attempt_count: number
  response_status: number | null
  error: string
  next_retry_at: string | null
  delivered_at: string | null
  created_at: string
}

export interface ApiRequestLog {
  id: string
  request_id: string
  api_key: string | null
  endpoint: string
  method: string
  status_code: number
  ip_address: string | null
  user_agent: string
  response_ms: number | null
  error_code: string | null
  created_at: string
}

export interface AppEvent {
  id: string
  bot: string | null
  event_type: string
  payload: Record<string, unknown>
  processing_status: string
  retry_count: number
  created_at: string
}

export interface AppNotification {
  id: string
  type: string
  title: string
  body: string
  data: Record<string, unknown>
  read_at: string | null
  created_at: string
}

export interface DashboardOverview {
  messages: {
    total: number
    inbound: number
    outbound: number
    failed: number
    delivered: number
    delivery_rate: number | null
  }
  bots: { total: number; connected: number }
  contacts: number
  conversations: { total: number; open: number; unread: number }
}

export interface MessageStatPoint {
  day: string
  inbound: number
  outbound: number
}

export interface Plan {
  id: string
  code: string
  name: string
  price: number | string
  currency: string
  limits?: Record<string, number>
  [key: string]: unknown
}

export interface Subscription {
  plan?: Plan
  status?: string
  [key: string]: unknown
}
