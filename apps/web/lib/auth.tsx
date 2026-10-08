"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { api, tokenStore } from "@/lib/api/client"
import type { Organization, OrgRole, User } from "@/types/api"

interface AuthState {
  user: User | null
  organizations: Organization[]
  organization: Organization | null
  membership: { role: OrgRole } | null
  ready: boolean
  authenticated: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (input: {
    email: string
    password: string
    first_name?: string
    last_name?: string
    organization_name?: string
  }) => Promise<void>
  logout: () => Promise<void>
  selectOrganization: (id: string) => void
  refreshUser: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [state, setState] = React.useState<AuthState>({
    user: null,
    organizations: [],
    organization: null,
    membership: null,
    ready: false,
    authenticated: false,
  })

  const bootstrap = React.useCallback(async () => {
    if (!tokenStore.getAccess()) {
      setState((s) => ({ ...s, ready: true }))
      return
    }
    try {
      const [user, orgs] = await Promise.all([
        api<User>("/auth/me/"),
        api<{ results: Organization[] } | Organization[]>("/organizations/"),
      ])
      const list = Array.isArray(orgs) ? orgs : orgs.results
      const savedOrg = tokenStore.getOrg()
      const org = list.find((o) => o.id === savedOrg) ?? list[0] ?? null
      if (org) tokenStore.setOrg(org.id)
      setState({
        user,
        organizations: list,
        organization: org,
        membership: null,
        ready: true,
        authenticated: true,
      })
    } catch {
      tokenStore.clear()
      setState((s) => ({ ...s, ready: true }))
    }
  }, [])

  React.useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  const login = React.useCallback(
    async (email: string, password: string) => {
      const res = await api<{ user: User; tokens: { access: string; refresh: string } }>(
        "/auth/login/",
        { method: "POST", body: { email, password }, auth: false }
      )
      tokenStore.setTokens(res.tokens.access, res.tokens.refresh)
      await bootstrap()
    },
    [bootstrap]
  )

  const register = React.useCallback(
    async (input: {
      email: string
      password: string
      first_name?: string
      last_name?: string
      organization_name?: string
    }) => {
      await api("/auth/register/", { method: "POST", body: input, auth: false })
      await login(input.email, input.password)
    },
    [login]
  )

  const logout = React.useCallback(async () => {
    const refresh = tokenStore.getRefresh()
    if (refresh) {
      try {
        await api("/auth/logout/", { method: "POST", body: { refresh }, auth: false })
      } catch {
        // ignore — local logout proceeds regardless
      }
    }
    tokenStore.clear()
    setState({
      user: null,
      organizations: [],
      organization: null,
      membership: null,
      ready: true,
      authenticated: false,
    })
    router.push("/login")
  }, [router])

  const selectOrganization = React.useCallback(
    (id: string) => {
      const org = state.organizations.find((o) => o.id === id) ?? null
      if (!org) return
      tokenStore.setOrg(org.id)
      setState((s) => ({ ...s, organization: org }))
      router.refresh()
    },
    [state.organizations, router]
  )

  const refreshUser = React.useCallback(async () => {
    const user = await api<User>("/auth/me/")
    setState((s) => ({ ...s, user }))
  }, [])

  const value = React.useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      selectOrganization,
      refreshUser,
    }),
    [state, login, register, logout, selectOrganization, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
