import { NextResponse } from "next/server"

export const dynamic = "force-static"
export const revalidate = false

const ANDROID_PACKAGE = "fr.lasso.app"

export function GET() {
  const raw = process.env.ANDROID_SHA256_FINGERPRINTS ?? ""

  const fingerprints = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const body = fingerprints.length
    ? [
        {
          relation: [
            "delegate_permission/common.handle_all_urls",
            "delegate_permission/common.get_login_creds",
          ],
          target: {
            namespace: "android_app",
            package_name: ANDROID_PACKAGE,
            sha256_cert_fingerprints: fingerprints,
          },
        },
      ]
    : []

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
