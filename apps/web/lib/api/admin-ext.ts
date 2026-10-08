/** Loose row types for read-only admin explorers. */

export interface AdminAutomation {
  id: string
  name: string
  description: string
  organization_name: string
  bot: string | null
  trigger_type: string
  status: string
  run_count: number
  created_at: string
}

export interface AdminContact {
  id: string
  organization_name: string
  phone_number: string
  name: string
  profile_name: string
  country: string
  tags: string[]
  last_seen_at: string | null
  created_at: string
}

export interface AdminConversation {
  id: string
  bot: string
  bot_name: string
  organization_name: string
  contact: string
  status: string
  unread_count: number
  last_message_at: string | null
  assigned_user: string | null
  created_at: string
}
