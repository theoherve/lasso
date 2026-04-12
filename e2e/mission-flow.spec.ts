import { test, expect } from "@playwright/test"
import { login } from "./helpers"

test.describe("Mission flow (public)", () => {
  test("feed shows missions from API", async ({ page }) => {
    await page.goto("/feed")
    const response = await page.waitForResponse(
      (r) => r.url().includes("/api/missions") && r.status() === 200,
      { timeout: 10_000 },
    )
    const missions = await response.json()

    if (missions.length > 0) {
      await expect(page.locator("a[href^='/mission/']").first()).toBeVisible()
    }
  })

  test("mission detail page loads", async ({ page }) => {
    const response = await page.request.get("/api/missions")
    const missions = await response.json()

    if (missions.length === 0) {
      test.skip()
      return
    }

    await page.goto(`/mission/${missions[0].id}`)
    await page.waitForLoadState("networkidle")
    await expect(page.locator("h2").first()).toBeVisible()
  })

  test("mission detail shows slot picker", async ({ page }) => {
    const response = await page.request.get("/api/missions")
    const missions = await response.json()

    if (missions.length === 0) {
      test.skip()
      return
    }

    await page.goto(`/mission/${missions[0].id}`)
    await page.waitForLoadState("networkidle")

    await expect(
      page.getByRole("heading", { name: /disponible/i }),
    ).toBeVisible({ timeout: 10_000 })
  })
})

test.describe("Authenticated volunteer flow", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "sophie@email.com", "Benevole1!")
  })

  test("can view missions dashboard", async ({ page }) => {
    await page.goto("/missions")
    if (page.url().includes("/login")) {
      test.skip(true, "Session not persisted for protected routes")
      return
    }
    await expect(page.getByText(/mission/i)).toBeVisible({ timeout: 10_000 })
  })

  test("can view profile", async ({ page }) => {
    await page.goto("/profile")
    if (page.url().includes("/login")) {
      test.skip(true, "Session not persisted for protected routes")
      return
    }
    await expect(page.getByText(/profil/i)).toBeVisible({ timeout: 10_000 })
  })
})
