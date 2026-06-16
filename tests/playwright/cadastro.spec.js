import { test, expect } from "@playwright/test";

// ─────────────────────────────────────────────────────────────────────────────
// CT05 — Cadastro de um usuário com e-mail inválido
// ─────────────────────────────────────────────────────────────────────────────
test("CT05 - não deve cadastrar usuário com e-mail inválido", async ({ page }) => {
    await page.goto("/register");

    await expect(page.locator("body")).toContainText("Criar conta");

    await page.fill("#nome", "Teste E-mail Inválido");
    await page.fill("#email", "emailinvalido");

    await page.fill("#password", "Senha@123");
    await page.fill("#password_confirmation", "Senha@123");

    await page.getByRole("button", { name: "Enviar" }).dispatchEvent("click");

    await expect(page).toHaveURL(/\/register/);

    const emailValido = await page.locator("#email").evaluate((el) => el.validity.valid);
    expect(emailValido).toBe(false);
});

// ─────────────────────────────────────────────────────────────────────────────
// CT06 — Cadastro com confirmação de senha divergente
// ─────────────────────────────────────────────────────────────────────────────
test("CT06 - não deve cadastrar usuário com confirmação de senha divergente", async ({ page }) => {
    await page.goto("/register");

    await page.fill("#nome", "Teste Senha Divergente");
    await page.fill("#email", "divergente@teste.com");
    await page.fill("#password", "Senha@123");
    await page.fill("#password_confirmation", "OutraSenha@456");

    await page.getByRole("button", { name: "Enviar" }).dispatchEvent("click");

    await expect(page).toHaveURL(/\/register/);

    const body = page.locator("body");
    const temErro = (await body.getByText(/confirma|confirmation|senha|password/i).count()) > 0;
    expect(temErro).toBe(true);
});

// ─────────────────────────────────────────────────────────────────────────────
// CT07 — Cadastro com campo de e-mail vazio
// ─────────────────────────────────────────────────────────────────────────────
test("CT07 - não deve cadastrar usuário com campo de email vazio", async ({ page }) => {
    await page.goto("/register");

    await page.fill("#nome", "Usuário Teste");
    await page.fill("#password", "Senha@123");
    await page.fill("#password_confirmation", "Senha@123");

    await page.getByRole("button", { name: "Enviar" }).dispatchEvent("click");

    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByText(/O campo email é obrigatório/i)).toBeVisible();
});
