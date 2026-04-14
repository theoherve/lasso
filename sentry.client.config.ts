// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

function getReplayIntegration() {
  try {
    return Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    })
  } catch {
    // Vercel toolbar may already have a Replay instance — skip silently
    return null
  }
}

const replay = getReplayIntegration()

Sentry.init({
  dsn: "https://4fabb0dd2befa2a981c1f8fe9988be58@o4504759198220288.ingest.us.sentry.io/4511206978486272",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1,

  // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
  tracePropagationTargets: ["localhost", /^\/api\//],

  integrations: replay ? [replay] : [],

  // Session Replay sample rates
  replaysSessionSampleRate: replay ? 0.1 : 0,
  replaysOnErrorSampleRate: replay ? 1.0 : 0,

  // Enable sending user PII
  sendDefaultPii: true,
})
