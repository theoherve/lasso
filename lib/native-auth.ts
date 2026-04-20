"use client"

import { signIn as nextAuthSignIn } from "next-auth/react"
import { isNative, openBrowser } from "@/lib/platform"

type ProviderId = "google" | "apple"

type NativeSignInOptions = {
  callbackUrl?: string
}

/**
 * TODO (Phase 3) — cookie bridge between SFSafariViewController / Custom Tabs
 * and the Capacitor WebView is NOT automatic. After the OAuth redirect in the
 * system browser, NextAuth sets the session cookie on the system-browser
 * cookie jar, which the WKWebView / Android WebView cannot see.
 *
 * Full mobile flow requires:
 *  1. After OAuth callback, redirect to a Universal Link / App Link that
 *     NativeBootstrap receives via `appUrlOpen`.
 *  2. Include a short-lived exchange token in the redirect URL.
 *  3. In the WebView, call `/api/auth/mobile-exchange` with the token to set
 *     the session cookie inside the WebView's own cookie jar.
 *
 * This helper currently only opens the system browser. The session bridge
 * endpoint + NativeBootstrap URL handler upgrade are deferred.
 */
export async function nativeSignIn(
  providerId: ProviderId,
  options: NativeSignInOptions = {},
): Promise<void> {
  const callbackUrl = options.callbackUrl ?? "/feed"

  if (!isNative()) {
    await nextAuthSignIn(providerId, { callbackUrl })
    return
  }

  const origin = window.location.origin
  const signInUrl = new URL(`/api/auth/signin/${providerId}`, origin)
  signInUrl.searchParams.set("callbackUrl", new URL(callbackUrl, origin).toString())

  await openBrowser(signInUrl.toString())
}
