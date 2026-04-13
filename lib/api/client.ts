/**
 * Thin typed fetch wrapper for internal /api calls.
 *
 * - Normalises errors into `ApiError` with a status code
 * - JSON body + Content-Type handled automatically
 * - Throws on non-2xx so TanStack Query treats them as errors
 */

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

interface ApiRequestInit extends Omit<RequestInit, "body"> {
  body?: unknown
  searchParams?: Record<string, string | number | boolean | undefined>
}

function buildUrl(
  path: string,
  searchParams?: ApiRequestInit["searchParams"],
): string {
  if (!searchParams) return path
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue
    qs.set(key, String(value))
  }
  const s = qs.toString()
  return s ? `${path}?${s}` : path
}

export async function apiRequest<T = unknown>(
  path: string,
  { body, searchParams, headers, ...init }: ApiRequestInit = {},
): Promise<T> {
  const url = buildUrl(path, searchParams)
  const hasBody = body !== undefined

  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: hasBody ? JSON.stringify(body) : undefined,
    credentials: init.credentials ?? "same-origin",
  })

  const contentType = res.headers.get("content-type") ?? ""
  const isJson = contentType.includes("application/json")
  const payload = isJson ? await res.json().catch(() => null) : await res.text()

  if (!res.ok) {
    const message =
      (isJson && payload && typeof payload === "object" && "message" in (payload as object)
        ? String((payload as { message?: unknown }).message ?? "")
        : "") ||
      `Request failed: ${res.status} ${res.statusText}`
    throw new ApiError(message, res.status, payload)
  }

  return payload as T
}

export const api = {
  get: <T = unknown>(path: string, init?: Omit<ApiRequestInit, "body" | "method">) =>
    apiRequest<T>(path, { ...init, method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown, init?: Omit<ApiRequestInit, "body" | "method">) =>
    apiRequest<T>(path, { ...init, method: "POST", body }),
  put: <T = unknown>(path: string, body?: unknown, init?: Omit<ApiRequestInit, "body" | "method">) =>
    apiRequest<T>(path, { ...init, method: "PUT", body }),
  patch: <T = unknown>(path: string, body?: unknown, init?: Omit<ApiRequestInit, "body" | "method">) =>
    apiRequest<T>(path, { ...init, method: "PATCH", body }),
  delete: <T = unknown>(path: string, init?: Omit<ApiRequestInit, "body" | "method">) =>
    apiRequest<T>(path, { ...init, method: "DELETE" }),
}
