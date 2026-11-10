import { test, expect } from "./fixtures";
import { setupAuthenticatedSession, IS_REAL_API } from "./helpers/auth";
import { fulfillJson, mockDefaultApis } from "./helpers/mocks";

test.describe("Fluxo 1 — Assinatura de plano (Mercado Pago + polling)", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page, { plan: "essential" });
    await mockDefaultApis(page, {
      subscription: {
        plan: "essential",
        status: null,
        paymentMethod: null,
        currentPeriodEnd: null,
        effectivePlan: "essential",
      },
    });
  });

  test("caminho feliz: gera link de pagamento, copia link, banner exibe e polling aprova o plano Extra", async ({ page }) => {
    test.setTimeout(35000);

    let getMeCalls = 0;
    const checkoutInitPoint = "https://www.mercadopago.com.br/checkout/extra-test-123";

    if (!IS_REAL_API) {
      await page.route(/\/subscription\/me$/, async (route) => {
        if (route.request().method() === "GET") {
          getMeCalls++;
          const effectivePlan = getMeCalls >= 3 ? "extra" : "essential";
          await fulfillJson(route, {
            plan: effectivePlan,
            status: effectivePlan === "extra" ? "active" : null,
            paymentMethod: effectivePlan === "extra" ? "credit_card" : null,
            currentPeriodEnd: effectivePlan === "extra" ? "2026-12-31T23:59:59Z" : null,
            effectivePlan,
          });
        } else {
          await route.continue();
        }
      });

      await page.route(/\/subscription\/checkout$/, async (route) => {
        const payload = route.request().postDataJSON();
        expect(payload).toEqual({ plan: "extra" });
        await fulfillJson(route, {
          preferenceId: "pref_extra_999",
          initPoint: checkoutInitPoint,
        });
      });
    }

    await page.goto("/plans");

    await expect(page.getByRole("heading", { name: "Escolha o jeito que combina com a sua rotina." })).toBeVisible();
    await expect(page.getByText("Seu plano")).toBeVisible();
    await expect(page.getByRole("button", { name: "Plano atual" })).toBeDisabled();

    const planToChoose = IS_REAL_API ? "Deluxe" : "Extra";
    const choosePlanBtn = page.getByRole("button", { name: `Escolher ${planToChoose}` });
    await expect(choosePlanBtn).toBeEnabled();
    await choosePlanBtn.click();

    await expect(page.getByRole("heading", { name: `Confirmar plano ${planToChoose}` })).toBeVisible();
    const generateLinkBtn = page.getByRole("button", { name: "Gerar link de pagamento" });
    await expect(generateLinkBtn).toBeVisible();

    await generateLinkBtn.click();

    await expect(page.getByRole("heading", { name: "Falta pouco!" })).toBeVisible();
    const linkInput = page.locator("input[readonly]");
    if (IS_REAL_API) {
      await expect(linkInput).toHaveValue(/mercadopago\.com\.br/);
    } else {
      await expect(linkInput).toHaveValue(checkoutInitPoint);
    }

    const copyBtn = page.getByRole("button", { name: /Copiar link de pagamento/i });
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    await expect(page.getByText(/Link copiado/i).first()).toBeVisible();

    const closeBtn = page.getByRole("button", { name: "Fechar" }).first();
    await closeBtn.click();
    await expect(page.getByRole("heading", { name: "Falta pouco!" })).not.toBeVisible();

    const banner = page.getByText(`Pagamento do plano ${planToChoose} em andamento`);
    await expect(banner).toBeVisible();

    const viewLinkBtn = page.getByRole("button", { name: "Ver link" });
    await expect(viewLinkBtn).toBeVisible();

    if (IS_REAL_API) {
      const dismissBtn = page.getByRole("button", { name: "Dispensar" });
      await dismissBtn.click();
      await expect(banner).not.toBeVisible();
    } else {
      await expect(page.getByText("Pagamento aprovado! Bem-vindo ao plano assinado")).toBeVisible({ timeout: 25000 });
      await expect(banner).not.toBeVisible();

      const extraCard = page.locator("article", { hasText: "Extra" });
      await expect(extraCard.getByText("Seu plano")).toBeVisible();
      await expect(extraCard.getByRole("button", { name: "Plano atual" })).toBeDisabled();
    }
  });

  test("botão 'X' do banner cancela o polling imediatamente", async ({ page }) => {
    test.setTimeout(25000);

    let getMeCallsAfterDismiss = 0;
    let dismissed = false;

    await page.route(/\/subscription\/me$/, async (route) => {
      if (dismissed) {
        getMeCallsAfterDismiss++;
      }
      await fulfillJson(route, {
        plan: "essential",
        status: null,
        paymentMethod: null,
        currentPeriodEnd: null,
        effectivePlan: "essential",
      });
    });

    await page.route(/\/subscription\/checkout$/, async (route) => {
      await fulfillJson(route, {
        preferenceId: "pref_extra_123",
        initPoint: "https://www.mercadopago.com.br/checkout/test",
      });
    });

    await page.goto("/plans");

    await page.getByRole("button", { name: "Escolher Extra" }).click();
    await page.getByRole("button", { name: "Gerar link de pagamento" }).click();
    await expect(page.getByRole("heading", { name: "Falta pouco!" })).toBeVisible();

    await page.getByRole("button", { name: "Fechar" }).first().click();
    const banner = page.getByText("Pagamento do plano Extra em andamento");
    await expect(banner).toBeVisible();

    const dismissBtn = page.getByRole("button", { name: "Dispensar" });
    await dismissBtn.click();
    dismissed = true;

    await expect(banner).not.toBeVisible();

    await page.waitForTimeout(5000);
    expect(getMeCallsAfterDismiss).toBeLessThanOrEqual(1);
  });

  test("retorno direto do Mercado Pago com ?status=approved dispara toast e limpa URL", async ({ page }) => {
    await page.route(/\/subscription\/me$/, async (route) => {
      await fulfillJson(route, {
        plan: "extra",
        status: "active",
        paymentMethod: "credit_card",
        currentPeriodEnd: "2026-12-31T23:59:59Z",
        effectivePlan: "extra",
      });
    });

    await page.goto("/plans?status=approved");

    await expect(
      page.getByText("Pagamento aprovado! Bem-vindo ao plano assinado")
    ).toBeVisible();

    await expect(page).toHaveURL(/\/plans$/);
  });

  test("bloqueio de downgrade no plano Deluxe: botões Essencial e Extra desabilitados", async ({ page }) => {
    await setupAuthenticatedSession(page, { plan: "deluxe" });
    await page.route(/\/subscription\/me$/, async (route) => {
      await fulfillJson(route, {
        plan: "deluxe",
        status: "active",
        paymentMethod: "credit_card",
        currentPeriodEnd: "2026-12-31T23:59:59Z",
        effectivePlan: "deluxe",
      });
    });

    await page.goto("/plans");

    const deluxeCard = page.locator("article", { hasText: "Deluxe" });
    await expect(deluxeCard.getByText("Seu plano")).toBeVisible();
    await expect(deluxeCard.getByRole("button", { name: "Plano atual" })).toBeDisabled();

    const essentialCard = page.locator("article", { hasText: "Essencial" });
    const essentialBtn = essentialCard.getByRole("button", { name: "Cancele o plano atual para trocar" });
    await expect(essentialBtn).toBeDisabled();

    const extraCard = page.locator("article", { hasText: "Extra" });
    const extraBtn = extraCard.getByRole("button", { name: "Cancele o plano atual para trocar" });
    await expect(extraBtn).toBeDisabled();

    await essentialBtn.click({ force: true });
    await expect(page.getByRole("heading", { name: /Confirmar plano/i })).not.toBeVisible();
  });

  test("cancelamento de assinatura em /settings via window.confirm e DELETE /subscription/me", async ({ page }) => {
    await setupAuthenticatedSession(page, { plan: "extra" });

    await page.route(/\/subscription\/me$/, async (route) => {
      if (route.request().method() === "GET") {
        await fulfillJson(route, {
          plan: "extra",
          status: "active",
          paymentMethod: "credit_card",
          currentPeriodEnd: "2026-12-31T23:59:59Z",
          effectivePlan: "extra",
        });
      } else if (route.request().method() === "DELETE") {
        await fulfillJson(route, {
          message: "Assinatura cancelada! Você mantém o plano até 31/12/2026.",
        });
      } else {
        await route.continue();
      }
    });

    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      expect(dialog.message()).toContain("Tem certeza que deseja cancelar sua assinatura?");
      await dialog.accept();
    });

    await page.goto("/settings");

    await expect(page.getByRole("heading", { name: "Sua assinatura" })).toBeVisible();
    await expect(page.getByText("Extra")).toBeVisible();

    const cancelBtn = page.getByRole("button", { name: "Cancelar assinatura" });
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    await expect(
      page.getByText("Assinatura cancelada! Você mantém o plano até 31/12/2026.")
    ).toBeVisible();
  });
});
