import { test, expect } from "@playwright/test";

const buildEmail = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

async function gotoAndWaitReady(page: Parameters<Parameters<typeof test>[1]>[0]["page"], path: string) {
  await page.goto(path);
  // Wait for page to load and ensure form is interactive before filling/submitting.
  await page.waitForLoadState("networkidle");
  // Give React time to fully hydrate and attach event handlers.
  await page.waitForTimeout(1000);
}

async function createUserViaApi(email: string, password: string, name = "E2E User") {
  const response = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      confirmPassword: password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create user: ${error.error}`);
  }

  return response.json();
}


test.describe("Authentication", () => {
  test.skip(!hasDatabaseUrl, "DATABASE_URL is required for authentication E2E tests.");

  test("registration happy flow creates account and signs in", async ({ page }) => {
    const email = buildEmail("register-happy");

    await gotoAndWaitReady(page, "/auth/register");
    await page.getByRole("textbox", { name: "Name" }).fill("Register Happy");
    await page.getByRole("textbox", { name: "Email" }).fill(email);

    const passwords = page.getByLabel(/password/i);
    await passwords.nth(0).fill("Password123");
    await passwords.nth(1).fill("Password123");

    // Submit the form and wait for navigation to home page.
    await page.getByRole("button", { name: "Create account" }).click();
    
    // Wait for the URL to change to home page (allows for RSC fallback delays).
    await page.waitForURL(/\/$/, { timeout: 30000 });

    // Verify signed-in state is rendered.
    await expect(page.getByText("Signed in as")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(email)).toBeVisible();
  });

  test("registration unhappy flow shows duplicate email error", async ({ page }) => {
    const email = buildEmail("register-duplicate");
    await createUserViaApi(email, "Password123", "Existing User");

    await gotoAndWaitReady(page, "/auth/register");
    await page.getByRole("textbox", { name: "Name" }).fill("Register Duplicate");
    await page.getByRole("textbox", { name: "Email" }).fill(email);

    const passwords = page.getByLabel(/password/i);
    await passwords.nth(0).fill("Password123");
    await passwords.nth(1).fill("Password123");

    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText("Email is already in use.")).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/register$/);
  });

  test("login happy flow authenticates and redirects home", async ({ page }) => {
    const email = buildEmail("login-happy");
    await createUserViaApi(email, "Password123", "Login Happy");

    await gotoAndWaitReady(page, "/auth/login");
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByLabel("Password").fill("Password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("Signed in as")).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();
  });

  test("login unhappy flow rejects invalid credentials", async ({ page }) => {
    const email = buildEmail("login-unhappy");
    await createUserViaApi(email, "Password123", "Login Unhappy");

    await gotoAndWaitReady(page, "/auth/login");
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByLabel("Password").fill("WrongPassword999");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid email or password.")).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login$/);
  });

  test("logout happy flow ends session and returns to login", async ({ page }) => {
    const email = buildEmail("logout-happy");
    await createUserViaApi(email, "Password123", "Logout Happy");

    await gotoAndWaitReady(page, "/auth/login");
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByLabel("Password").fill("Password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/$/);
    await page.getByRole("button", { name: "Log out" }).click();

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByText('Log in')).toBeVisible();
  });
});
