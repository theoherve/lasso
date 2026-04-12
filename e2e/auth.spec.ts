import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  const testEmail = `e2e-${Date.now()}@test.com`
  const testPassword = "TestPassword123!"
  const testFirstName = "TestUser"

  test("register a new account", async ({ page }) => {
    await page.goto("/register")

    await page.locator("#firstName").fill(testFirstName)
    await page.locator("#email").fill(testEmail)
    await page.locator("#password").fill(testPassword)

    await page.getByRole("button", { name: /parti/i }).click()

    // Should redirect to feed after successful registration
    await expect(page).toHaveURL(/\/feed/, { timeout: 15_000 })
  })

  test("login sends valid credentials and gets session", async ({ page }) => {
    await page.goto("/login")

    await page.locator("#email").fill("sophie@email.com")
    await page.locator("#password").fill("Benevole1!")

    // Click and intercept the auth callback
    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/auth/callback/credentials"),
        { timeout: 15_000 },
      ),
      page.getByRole("button", { name: /connecter/i }).click(),
    ])

    // The callback should succeed (200 = ok with redirect:false)
    expect(response.status()).toBe(200)

    // Verify we can access authenticated content by navigating directly
    await page.goto("/feed")
    await expect(page).toHaveURL(/\/feed/)
  })

  test("login with wrong password shows error", async ({ page }) => {
    await page.goto("/login")

    await page.locator("#email").fill("sophie@email.com")
    await page.locator("#password").fill("WrongPassword!")

    await page.getByRole("button", { name: /connecter/i }).click()

    // Should show error message
    await expect(page.getByText(/incorrect/i)).toBeVisible({ timeout: 10_000 })
    // Should stay on login page
    await expect(page).toHaveURL(/\/login/)
  })

  test("admin login gets session with admin role", async ({ page }) => {
    await page.goto("/login")
    await page.locator("#email").fill("admin@lasso.fr")
    await page.locator("#password").fill("Admin1234!")

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/auth/callback/credentials"),
        { timeout: 15_000 },
      ),
      page.getByRole("button", { name: /connecter/i }).click(),
    ])

    expect(response.status()).toBe(200)

    // Admin should be able to access /admin
    await page.goto("/admin")
    await expect(page).toHaveURL(/\/admin/)
  })
})
