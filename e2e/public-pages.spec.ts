import { test, expect } from "@playwright/test"

test.describe("Public pages", () => {
  test("landing redirects to /feed", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/feed/)
  })

  test("feed page loads and shows missions", async ({ page }) => {
    await page.goto("/feed")
    // Should have a title/heading
    await expect(page.locator("h2").first()).toBeVisible()
    // Wait for missions or empty state
    await page.waitForResponse((r) => r.url().includes("/api/missions") && r.status() === 200)
  })

  test("feed filters work (category chips)", async ({ page }) => {
    await page.goto("/feed")
    await page.waitForResponse((r) => r.url().includes("/api/missions"))

    // Click a category filter
    const chip = page.getByText("Aide a la personne").or(page.getByText("Education"))
    if (await chip.first().isVisible()) {
      await chip.first().click()
      // URL should update with category param
      await expect(page).toHaveURL(/category=/)
    }
  })

  test("associations page loads", async ({ page }) => {
    await page.goto("/associations")
    await expect(page.getByText("Associations partenaires")).toBeVisible()
  })

  test("association detail page loads via slug", async ({ page }) => {
    await page.goto("/associations")
    // Click first association link if any
    const firstCard = page.locator("a[href^='/associations/']").first()
    if (await firstCard.isVisible()) {
      await firstCard.click()
      await expect(page).toHaveURL(/\/associations\//)
      // Should show association name heading
      await expect(page.locator("h1").first()).toBeVisible()
    }
  })

  test("login page loads", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByText("Connexion")).toBeVisible()
    await expect(page.locator("input[type='email']")).toBeVisible()
    await expect(page.locator("input[type='password']")).toBeVisible()
  })

  test("register page loads", async ({ page }) => {
    await page.goto("/register")
    await expect(page.getByText("Inscription")).toBeVisible()
    await expect(page.locator("input[name='firstName']").or(page.locator("#firstName"))).toBeVisible()
  })
})
