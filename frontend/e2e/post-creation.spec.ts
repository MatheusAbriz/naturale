import { test, expect } from "@playwright/test";
import { setupAuthenticatedSession, DEFAULT_USER } from "./helpers/auth";
import { fulfillJson, mockDefaultApis, DEFAULT_POST } from "./helpers/mocks";

test.describe("Fluxo 2 — Criação e edição de receita", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page);
    await mockDefaultApis(page);
  });

  test("validação client-side: campos obrigatórios e imagem obrigatória na criação", async ({ page }) => {
    await page.goto("/home");

    const fab = page.getByRole("button", { name: "Nova receita" });
    await expect(fab).toBeVisible();
    await fab.click();

    await expect(page).toHaveURL(/\/postForm$/);
    await expect(page.getByRole("heading", { name: "Compartilhe uma receita" })).toBeVisible();

    const publishBtn = page.getByRole("button", { name: "Publicar" });

    await publishBtn.click();
    await expect(page.getByText("Preencha todos os campos.")).toBeVisible();

    await page.getByPlaceholder("Título").fill("Bolo de Cenoura Fit");
    await page.getByPlaceholder("Tempo de preparo (ex: 30 min)").fill("45 min");
    await page.getByPlaceholder("Ingredientes (separados por vírgula)").fill("Cenoura, Ovos, Aveia, Cacau");
    await page.getByPlaceholder("Modo de preparo").fill("Bata tudo no liquidificador e asse por 40 min.");

    await publishBtn.click();
    await expect(page.getByText("Selecione uma imagem para a receita.")).toBeVisible();
  });

  test("criação de receita: upload de imagem, envio do post e redirecionamento para /home", async ({ page }) => {
    let imageUploaded = false;
    let postCreated = false;

    await page.route(/\/images$/, async (route) => {
      imageUploaded = true;
      await fulfillJson(route, {
        path: "uploads/posts/receita-fit.jpg",
        publicUrl: "https://images.unsplash.com/receita-fit.jpg",
      });
    });

    await page.route(/\/posts$/, async (route) => {
      if (route.request().method() === "POST") {
        postCreated = true;
        const payload = route.request().postDataJSON();
        expect(payload).toMatchObject({
          userId: DEFAULT_USER.id,
          title: "Bolo de Cenoura Fit",
          time: "45 min",
          ingredients: "Cenoura, Ovos, Aveia, Mel",
          text: "Bata a cenoura com os ovos, adicione aveia e asse por 35 minutos.",
          image: "https://images.unsplash.com/receita-fit.jpg",
          status: true,
        });
        await fulfillJson(route, { message: "Receita criada com sucesso!", postId: 202 });
      } else {
        await route.continue();
      }
    });

    await page.goto("/postForm");

    await page.locator('input[type="file"]').setInputFiles({
      name: "receita.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-image-bytes"),
    });

    const previewImg = page.locator('img[alt="Pré-visualização"]');
    await expect(previewImg).toBeVisible();

    await page.getByPlaceholder("Título").fill("Bolo de Cenoura Fit");
    await page.getByPlaceholder("Tempo de preparo (ex: 30 min)").fill("45 min");
    await page.getByPlaceholder("Ingredientes (separados por vírgula)").fill("Cenoura, Ovos, Aveia, Mel");
    await page.getByPlaceholder("Modo de preparo").fill("Bata a cenoura com os ovos, adicione aveia e asse por 35 minutos.");

    await page.getByRole("button", { name: "Publicar" }).click();

    await expect(page.getByText("Receita publicada com sucesso!")).toBeVisible();
    await expect(page).toHaveURL(/\/home$/);

    expect(imageUploaded).toBe(true);
    expect(postCreated).toBe(true);
  });

  test("modo de edição: pré-popula campos e atualiza sem reenviar imagem quando não alterada", async ({ page }) => {
    const existingPost = {
      ...DEFAULT_POST,
      postId: 101,
      title: "Salada Mediterrânea Especial",
      time: "20 min",
      ingredients: "Alface, Tomate, Pepino, Azeite",
      text: "Misture todos os ingredientes numa tigela grande.",
      image: "https://images.unsplash.com/original-image.jpg",
    };

    let imageUploadCalled = false;
    let postUpdated = false;

    await page.route(/\/posts\/101$/, async (route) => {
      if (route.request().method() === "GET") {
        await fulfillJson(route, existingPost);
      } else if (route.request().method() === "PUT") {
        postUpdated = true;
        const payload = route.request().postDataJSON();
        expect(payload).toEqual({
          title: "Salada Mediterrânea Especial Turbinada",
          text: "Misture todos os ingredientes e acrescente sementes de chia.",
          ingredients: "Alface, Tomate, Pepino, Azeite",
          image: "https://images.unsplash.com/original-image.jpg",
          time: "20 min",
        });
        await fulfillJson(route, { message: "Receita atualizada com sucesso!" });
      } else {
        await route.continue();
      }
    });

    await page.route(/\/images$/, async (route) => {
      imageUploadCalled = true;
      await fulfillJson(route, { path: "new.jpg", publicUrl: "https://images.unsplash.com/new.jpg" });
    });

    await page.goto("/postForm/101");

    await expect(page.getByRole("heading", { name: "Editar receita" })).toBeVisible();
    await expect(page.getByPlaceholder("Título")).toHaveValue(existingPost.title);
    await expect(page.getByPlaceholder("Tempo de preparo (ex: 30 min)")).toHaveValue(existingPost.time);
    await expect(page.getByPlaceholder("Ingredientes (separados por vírgula)")).toHaveValue(existingPost.ingredients);
    await expect(page.getByPlaceholder("Modo de preparo")).toHaveValue(existingPost.text);

    await page.getByPlaceholder("Título").fill("Salada Mediterrânea Especial Turbinada");
    await page.getByPlaceholder("Modo de preparo").fill("Misture todos os ingredientes e acrescente sementes de chia.");

    await page.getByRole("button", { name: "Salvar alterações" }).click();

    await expect(page.getByText("Receita atualizada com sucesso!")).toBeVisible();
    await expect(page).toHaveURL(/\/post\/101$/);

    expect(postUpdated).toBe(true);
    expect(imageUploadCalled).toBe(false);
  });

  test("detalhe da receita: botões de editar e excluir para o autor da receita", async ({ page }) => {
    const userPost = {
      ...DEFAULT_POST,
      postId: 101,
      user: {
        id: DEFAULT_USER.id,
        name: DEFAULT_USER.name,
        username: DEFAULT_USER.username,
        avatar: DEFAULT_USER.avatar,
        type: DEFAULT_USER.role,
      },
    };

    let postDeleted = false;

    await page.route(/\/posts\/101$/, async (route) => {
      if (route.request().method() === "GET") {
        await fulfillJson(route, userPost);
      } else if (route.request().method() === "DELETE") {
        postDeleted = true;
        await fulfillJson(route, { message: "Post excluído com sucesso!" });
      } else {
        await route.continue();
      }
    });

    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      expect(dialog.message()).toContain("Tem certeza que deseja excluir esta receita?");
      await dialog.accept();
    });

    await page.goto("/post/101");

    await expect(page.getByRole("heading", { name: userPost.title })).toBeVisible();

    const editBtn = page.locator("button:has(svg.lucide-pencil)");
    const deleteBtn = page.locator("button:has(svg.lucide-trash-2)");

    await expect(editBtn).toBeVisible();
    await expect(deleteBtn).toBeVisible();

    await deleteBtn.click();

    await expect(page.getByText("Post excluído com sucesso!")).toBeVisible();
    await expect(page).toHaveURL(/\/home$/);
    expect(postDeleted).toBe(true);
  });
});
