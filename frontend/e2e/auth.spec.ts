import { test, expect } from "@playwright/test";
import { setupAuthenticatedSession, DEFAULT_USER } from "./helpers/auth";
import { fulfillJson, mockDefaultApis } from "./helpers/mocks";

test.describe("Fluxo 3 — Login, cadastro e sessão", () => {
  test.beforeEach(async ({ page }) => {
    await mockDefaultApis(page);
  });

  test("login: validação de email e erro de credenciais inválidas (401)", async ({ page }) => {
    let loginCalled = false;
    await page.route(/\/user\/login$/, async (route) => {
      loginCalled = true;
      await fulfillJson(route, { message: "Credenciais inválidas" }, 401);
    });

    await page.goto("/login");

    const emailInput = page.locator("#email");
    const passwordInput = page.locator("#password");
    const submitBtn = page.getByRole("button", { name: "Entrar" });

    await emailInput.fill("invalid-email");
    await passwordInput.fill("123456");
    await submitBtn.click();

    await expect(page.getByText("Preencha os campos corretamente!")).toBeVisible();
    expect(loginCalled).toBe(false);

    await emailInput.fill("user@example.com");
    await submitBtn.click();

    await expect(page.getByText("Login inválido!")).toBeVisible();
    expect(loginCalled).toBe(true);
  });

  test("login caminho feliz: autentica, grava sessão no localStorage e redireciona para /home", async ({ page }) => {
    await page.route(/\/user\/login$/, async (route) => {
      const data = route.request().postDataJSON();
      expect(data).toEqual({ email: "matheus@teste.com", password: "password123" });

      await fulfillJson(route, {
        id: DEFAULT_USER.id,
        name: DEFAULT_USER.name,
        email: DEFAULT_USER.email,
        username: DEFAULT_USER.username,
        type: "USER",
        avatar: DEFAULT_USER.avatar,
        token: "fake-jwt-token-login-test",
      });
    });

    await page.goto("/login");

    await page.locator("#email").fill("matheus@teste.com");
    await page.locator("#password").fill("password123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Login realizado com sucesso, seja bem-vindo!")).toBeVisible();
    await expect(page).toHaveURL(/\/home$/);

    const authStorage = await page.evaluate(() => window.localStorage.getItem("auth-storage"));
    expect(authStorage).toBeTruthy();
    const parsed = JSON.parse(authStorage!);
    expect(parsed.state.isAuthenticated).toBe(true);
    expect(parsed.state.user.email).toBe("matheus@teste.com");
  });

  test("persistência de sessão: acessa /home direto com dados no localStorage sem redirecionar para /login", async ({ page }) => {
    await setupAuthenticatedSession(page);

    await page.goto("/home");

    await expect(page).toHaveURL(/\/home$/);
    await expect(page.getByRole("heading", { name: "Receitas que cuidam de você" })).toBeVisible();
  });

  test("rota pública bloqueada para usuário autenticado: /login redireciona para /home", async ({ page }) => {
    await setupAuthenticatedSession(page);

    await page.goto("/login");

    await expect(page).toHaveURL(/\/home$/);
  });

  test("logout: menu do avatar -> Sair limpa a sessão e redireciona para /login", async ({ page }) => {
    await setupAuthenticatedSession(page);
    await page.goto("/home");

    const avatarButton = page.locator("header button:has(img)");
    await expect(avatarButton).toBeVisible();
    await avatarButton.click();

    const logoutMenuItem = page.getByRole("menuitem", { name: "Sair" });
    await expect(logoutMenuItem).toBeVisible();
    await logoutMenuItem.click();

    await expect(page).toHaveURL(/\/login$/);

    const authStorage = await page.evaluate(() => window.localStorage.getItem("auth-storage"));
    const parsed = JSON.parse(authStorage!);
    expect(parsed.state.isAuthenticated).toBe(false);
    expect(parsed.state.user).toBeNull();
  });

  test("cadastro: validação de telefone e CPF inválido, e caminho feliz com CPF 111.444.777-35", async ({ page }) => {
    let registerCalled = false;

    await page.route(/\/user$/, async (route) => {
      if (route.request().method() === "POST") {
        registerCalled = true;
        const payload = route.request().postDataJSON();
        expect(payload).toMatchObject({
          name: "Novo Usuário",
          email: "novo@teste.com",
          username: "novousuario",
          phone: "(11) 98765-4321",
          cpf: "111.444.777-35",
          type: "USER",
        });

        await fulfillJson(route, {
          id: 50,
          name: payload.name,
          email: payload.email,
          username: payload.username,
          type: "USER",
          token: "new-user-token",
          avatar: "",
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/register");

    const nameInput = page.locator("#name");
    const usernameInput = page.locator("#username");
    const emailInput = page.locator("#email");
    const passwordInput = page.locator("#password");
    const phoneInput = page.locator("#phone");
    const cpfInput = page.locator("#cpf");
    const submitBtn = page.getByRole("button", { name: "Criar conta" });

    await nameInput.fill("Novo Usuário");
    await usernameInput.fill("novousuario");
    await emailInput.fill("novo@teste.com");
    await passwordInput.fill("senha12345");

    await phoneInput.fill("119999");
    await cpfInput.fill("11144477735");
    await submitBtn.click();
    await expect(page.getByText("Informe um telefone válido com DDD.")).toBeVisible();

    await phoneInput.fill("11987654321");
    await cpfInput.fill("12345678900");
    await submitBtn.click();
    await expect(page.getByText("Informe um CPF válido.")).toBeVisible();

    await cpfInput.fill("11144477735");
    await submitBtn.click();

    await expect(page.getByText("Cadastro realizado com sucesso!")).toBeVisible();
    await expect(page).toHaveURL(/\/home$/);
    expect(registerCalled).toBe(true);
  });

  test("esqueci minha senha: fluxo em 2 passos, botão tentar de novo e erro de código", async ({ page }) => {
    let forgotCalled = false;
    let resetAttempts = 0;

    await page.route(/\/user\/forgot-password$/, async (route) => {
      forgotCalled = true;
      const data = route.request().postDataJSON();
      expect(data).toEqual({ email: "recuperar@teste.com" });
      await fulfillJson(route, { message: "Código enviado com sucesso" });
    });

    await page.route(/\/user\/reset-password$/, async (route) => {
      resetAttempts++;
      const data = route.request().postDataJSON();
      if (data.code === "000000") {
        await fulfillJson(route, { message: "Código inválido ou expirado." }, 400);
      } else {
        expect(data).toEqual({
          email: "recuperar@teste.com",
          code: "123456",
          newPassword: "novaSenhaForte123",
        });
        await fulfillJson(route, { message: "Senha redefinida com sucesso" });
      }
    });

    await page.goto("/forgot-password");

    await expect(page.getByRole("heading", { name: "Recupere seu acesso." })).toBeVisible();
    await page.locator("#email").fill("recuperar@teste.com");
    await page.getByRole("button", { name: "Enviar código" }).click();

    await expect(page.getByText("Se o e-mail existir, um código foi enviado.")).toBeVisible();
    expect(forgotCalled).toBe(true);

    await expect(page.getByRole("heading", { name: "Crie uma nova senha." })).toBeVisible();

    forgotCalled = false;
    const retryBtn = page.getByRole("button", { name: "Não recebeu o código? Tentar de novo" });
    await retryBtn.click();
    await expect(page.getByRole("heading", { name: "Recupere seu acesso." })).toBeVisible();
    expect(forgotCalled).toBe(false);

    await page.getByRole("button", { name: "Enviar código" }).click();
    await expect(page.getByRole("heading", { name: "Crie uma nova senha." })).toBeVisible();

    await page.locator("#code").fill("000000");
    await page.locator("#newPassword").fill("novaSenhaForte123");
    await page.getByRole("button", { name: "Redefinir senha" }).click();

    await expect(page.getByText("Código inválido ou expirado.")).toBeVisible();

    await page.locator("#code").fill("123456");
    await page.getByRole("button", { name: "Redefinir senha" }).click();

    await expect(page.getByText("Senha redefinida com sucesso! Faça login.")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
    expect(resetAttempts).toBe(2);
  });
});
