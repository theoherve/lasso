"use client"

import { useEffect } from "react"
import posthog from "posthog-js"
import { useSession } from "next-auth/react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (!key) return

    posthog.init(key, {
      api_host: host ?? "https://eu.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    })

    return () => {
      posthog.reset()
    }
  }, [])

  useEffect(() => {
    if (session?.user?.id) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
      })
    }
  }, [session])

  return <>{children}</>
}
