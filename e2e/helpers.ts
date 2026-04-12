import type { Page } from "@playwright/test"
import { expect } from "@playwright/test"

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login")
  await page.locator("#email").fill(email)
  await page.locator("#password").fill(password)

  // Submit and wait for the auth callback
  const [response] = await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes("/api/auth/callback/credentials"),
      { timeout: 15_000 },
    ),
    page.getByRole("button", { name: /connecter/i }).click(),
  ])

  expect(response.status()).toBe(200)

  // Wait for client-side redirect or force navigate
  try {
    await expect(page).toHaveURL(/\/feed/, { timeout: 5_000 })
  } catch {
    await page.goto("/feed")
  }
}

export async function loginAndVerify(page: Page, email: string, password: string) {
  await login(page, email, password)

  // Verify the session is valid by checking an auth-protected API
  const sessionRes = await page.request.get("/api/users/me")
  return sessionRes.status() === 200
}
