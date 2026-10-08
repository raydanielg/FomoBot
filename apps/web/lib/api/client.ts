const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

const ACCESS_KEY = "fomobot.access_token"
const REFRESH_KEY = "fomobot.refresh_token"
const ORG_KEY = "fomobot.org_id"

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, string[]>,
    public requestId?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const tokenStore = {
  getAccess: () =>
    typeof window === "undefined" ? null : localStorage.getItem(ACCESS_KEY),
  getRefresh: () =>
    typeof window === "undefined" ? null : localStorage.getItem(REFRESH_KEY),
  getOrg: () =>
    typeof window === "undefined" ? null : localStorage.getItem(ORG_KEY),
  setTokens(access: string, refresh: string) {
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  },
  setOrg(id: string) {
    localStorage.setItem(ORG_KEY, id)
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(ORG_KEY)
  },
}

let refreshPromise: Promise<boolean> | null = null

async function refreshTokens(): Promise<boolean> {
  const refresh = tokenStore.getRefresh()
  if (!refresh) return false
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })
    const body = await res.json().catch(() => null)
    const tokens = body?.data?.tokens
    if (!res.ok || !tokens?.access) return false
    tokenStore.setTokens(tokens.access, tokens.refresh ?? refresh)
    return true
  } catch {
    return false
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  params?: Record<string, string | number | boolean | undefined | null>
  auth?: boolean
}

export async function api<T = unknown>(
  path: string,
  options: RequestOptions = {},
  _retried = false
): Promise<T> {
  const { method = "GET", body, params, auth = true } = options

  const url = new URL(`${BASE_URL}/api/v1${path}`)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v))
    }
  }

  const headers: Record<string, string> = {}
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (auth) {
    const access = tokenStore.getAccess()
    if (access) headers["Authorization"] = `Bearer ${access}`
    const org = tokenStore.getOrg()
    if (org) headers["X-Organization-ID"] = org
  }

  let res: Response
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Cannot reach the server. Check your connection.")
  }

  if (res.status === 401 && auth && !_retried) {
    refreshPromise ??= refreshTokens().finally(() => {
      refreshPromise = null
    })
    if (await refreshPromise) {
      return api<T>(path, options, true)
    }
    tokenStore.clear()
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login"
    }
    throw new ApiError(401, "UNAUTHORIZED", "Your session has expired. Please sign in again.")
  }

  const payload = await res.json().catch(() => null)

  if (!res.ok || payload?.success === false) {
    const err = payload?.error ?? {}
    throw new ApiError(
      res.status,
      err.code ?? "ERROR",
      err.message || "Something went wrong. Please try again.",
      err.details,
      payload?.request_id
    )
  }

  return (payload?.data ?? payload) as T
}

export function fieldErrors(e: unknown): Record<string, string> {
  if (e instanceof ApiError && e.details) {
    const fields = (e.details.fields ?? e.details) as Record<string, unknown>
    const out: Record<string, string> = {}
    for (const [k, v] of Object.entries(fields)) {
      out[k] = Array.isArray(v) ? String(v[0]) : String(v)
    }
    return out
  }
  return {}
}

export function errorMessage(e: unknown, fallback = "Something went wrong. Please try again.") {
  return e instanceof ApiError ? e.message : fallback
}
