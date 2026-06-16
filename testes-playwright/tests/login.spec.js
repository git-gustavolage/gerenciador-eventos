import { test, expect } from "@playwright/test";

const EMAIL_VALIDO = "teste@email.com";
const SENHA_VALIDA = "Senha@123";

// ─────────────────────────────────────────────────────────────────────────────
// CT01 — Login com credenciais válidas
// ─────────────────────────────────────────────────────────────────────────────
test("CT01 - deve permitir login com credenciais válidas", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("body")).toContainText("Acesse sua conta");

    await page.fill("#email", EMAIL_VALIDO);
    await page.fill("#password", SENHA_VALIDA);

    await page.getByRole("button", { name: "Entrar" }).press("Enter");
    await page.waitForURL((url) => !url.pathname.includes("/login"), {
        timeout: 15_000,
    });

    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator("body")).not.toContainText("Acesse sua conta");
});

// ─────────────────────────────────────────────────────────────────────────────
// CT02 — Login com senha inválida
// ─────────────────────────────────────────────────────────────────────────────
test("CT02 - não deve permitir login com senha incorreta", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("body")).toContainText("Acesse sua conta");

    await page.fill("#email", EMAIL_VALIDO);
    await page.fill("#password", "senhaerrada");

    await page.getByRole("button", { name: "Entrar" }).press("Enter");
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/\/login/);

    const body = page.locator("body");
    const temErro = (await body.getByText(/credenciais|inválid|senha|credentials|not match/i).count()) > 0;
    expect(temErro).toBe(true);
});

// ─────────────────────────────────────────────────────────────────────────────
// CT03 — Login com campos obrigatórios vazios
// ─────────────────────────────────────────────────────────────────────────────
test("CT03 - não deve permitir login com campos obrigatórios vazios", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Entrar" }).press("Enter");

    await expect(page.getByText("O campo email é obrigatório.")).toBeVisible();
    await expect(page.getByText("O campo email é obrigatório.")).toBeVisible();
});

// ─────────────────────────────────────────────────────────────────────────────
// CT04 — Acesso direto a rota protegida sem autenticação
// ─────────────────────────────────────────────────────────────────────────────
test("CT04 - deve redirecionar para login ao acessar rota protegida sem autenticação", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/, { timeout: 10_000 });

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("body")).toContainText("Acesse sua conta");
});
