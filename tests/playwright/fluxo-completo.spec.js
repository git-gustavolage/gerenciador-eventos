import { test, expect } from "@playwright/test";

const EMAIL_VALIDO = "teste@email.com";
const SENHA_VALIDA = "Senha@123";

// ─────────────────────────────────────────────────────────────────────────────
// CT10 — Fluxo completo: home -> explorar eventos -> login -> área autenticada -> logout
// ─────────────────────────────────────────────────────────────────────────────
test("CT10 - fluxo completo: home → explorar eventos → login → área autenticada → logout", async ({ page }) => {
    // Acessa a página inicial pública
    await page.goto("/");
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator("body")).toContainText("E-IFRO");

    // Navega para a listagem pública de eventos
    await page.goto("/eventos/explorar");
    await expect(page.locator("body")).toContainText("Eventos Disponíveis");

    // Navega para o login
    await page.goto("/login");
    await expect(page.locator("body")).toContainText("Acesse sua conta");

    // Realiza o login
    await page.fill("#email", EMAIL_VALIDO);
    await page.fill("#password", SENHA_VALIDA);
    await page.click('button[type="submit"]');

    await page.waitForURL((url) => !url.pathname.includes("/login"));
    await expect(page).not.toHaveURL(/\/login/);

    // Acessa área autenticada
    await page.goto("/meus-eventos");
    await expect(page).not.toHaveURL(/\/login/);

    // Interage com a botão de sair na navbar
    await page.locator("nav button").filter({ visible: true }).first().click();
    await page.getByRole("button", { name: "Sair" }).first().click();
    await page.waitForURL("/");

    // Garante que deslogou
    await page.goto("/meus-eventos");
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
});
