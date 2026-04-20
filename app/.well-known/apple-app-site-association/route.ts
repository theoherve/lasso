import { NextResponse } from "next/server"

export const dynamic = "force-static"
export const revalidate = false

const APP_BUNDLE_ID = "fr.lasso.app"

export function GET() {
  const teamId = process.env.APPLE_TEAM_ID

  const appIDs = teamId ? [`${teamId}.${APP_BUNDLE_ID}`] : []

  const body = {
    applinks: {
      apps: [],
      details: appIDs.map((appID) => ({
        appID,
        paths: ["/*"],
      })),
    },
    webcredentials: {
      apps: appIDs,
    },
  }

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
