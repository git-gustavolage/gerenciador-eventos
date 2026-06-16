import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// CT08 — Bloqueio na execução do script XXS inserido no campo de nome na página de cadastro
// ─────────────────────────────────────────────────────────────────────────────
test("CT08 - não deve executar script XSS inserido no campo nome do cadastro", async ({ page }) => {
  let xssExecutado = false; 
  page.on("dialog", async (dialog) => { 
    xssExecutado = true; 
    await dialog.dismiss(); 
  });

  await page.goto("/register");

  await page.fill("#nome", "<script>alert('xss')</script>"); 
  await page.fill("#email", `xss_${Date.now()}@teste.com`); 
  await page.fill("#password", "Senha@123"); 
  await page.fill("#password_confirmation", "Senha@123");

  await page.getByRole("button", { name: "Enviar" }).dispatchEvent("click");
  await page.waitForTimeout(2000);

  expect(xssExecutado).toBe(false);

  const htmlBruto = await page.content();
  expect(htmlBruto.includes("<script>alert(")).toBe(false);

  await expect(page).not.toHaveURL(/\/register/);
});

// ─────────────────────────────────────────────────────────────────────────────
// CT09 — Bloqueio na execução do XSS refletido via parâmetro de URL
// ─────────────────────────────────────────────────────────────────────────────
test('CT09 - não deve executar XSS refletido via parâmetro de URL', async ({ page }) => {
  let xssExecutado = false; 
  page.on('dialog', async (dialog) => { 
    xssExecutado = true; 
    await dialog.dismiss(); 
  });

  await page.goto('/eventos/explorar?q=<script>alert(1)</script>'); 
  await page.waitForTimeout(1500);

  expect(xssExecutado).toBe(false); await expect(page.locator('body')).not.toContainText('<script>alert(1)</script>');
});
