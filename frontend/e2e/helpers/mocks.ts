import { Page, Route } from "@playwright/test";
import { DEFAULT_USER, IS_REAL_API, PlanId } from "./auth";

export const API_BASE_PATTERN = /https:\/\/api-6yuvneknga-uc\.a\.run\.app/;

export interface SubscriptionResponse {
  plan: PlanId;
  status: "pending" | "active" | "canceled" | "expired" | null;
  paymentMethod: string | null;
  currentPeriodEnd: string | null;
  effectivePlan: PlanId;
}

export const DEFAULT_SUBSCRIPTION: SubscriptionResponse = {
  plan: "essential",
  status: null,
  paymentMethod: null,
  currentPeriodEnd: null,
  effectivePlan: "essential",
};

export const DEFAULT_POST = {
  postId: 101,
  title: "Salada Mediterrânea com Quinoa",
  text: "Uma deliciosa e nutritiva salada repleta de folhas verdes frescas, tomate cereja, pepino crocante e quinoa cozida.",
  ingredients: "Quinoa, Tomate cereja, Pepino, Azeite extra virgem, Limão, Rúcula",
  image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
  time: "25 min",
  likes_count: 12,
  isLiked: false,
  isFavorited: false,
  commentCount: 3,
  status: true,
  user: {
    id: DEFAULT_USER.id,
    name: DEFAULT_USER.name,
    username: DEFAULT_USER.username,
    avatar: DEFAULT_USER.avatar,
    type: DEFAULT_USER.role,
  },
};

export async function fulfillJson(
  route: Route,
  data: unknown,
  status = 200
) {
  await route.fulfill({
    status,
    contentType: "application/json",
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "access-control-allow-headers": "*",
    },
    body: JSON.stringify(data),
  });
}

export async function mockDefaultApis(page: Page, overrides?: {
  subscription?: Partial<SubscriptionResponse>;
  posts?: typeof DEFAULT_POST[];
}) {
  if (IS_REAL_API) return;
  const currentSub: SubscriptionResponse = {
    ...DEFAULT_SUBSCRIPTION,
    ...overrides?.subscription,
  };

  const postsList = overrides?.posts ?? [DEFAULT_POST];

  await page.route(/\/subscription\/me$/, async (route) => {
    if (route.request().method() === "GET") {
      await fulfillJson(route, currentSub);
    } else {
      await route.continue();
    }
  });

  await page.route(/\/posts(\?.*)?$/, async (route) => {
    if (route.request().method() === "GET") {
      await fulfillJson(route, {
        data: postsList,
        pagination: {
          page: 1,
          limit: 10,
          total: postsList.length,
          totalPages: 1,
        },
      });
    } else {
      await route.continue();
    }
  });

  await page.route(/\/user\/profile\/\d+/, async (route) => {
    await fulfillJson(route, {
      id: DEFAULT_USER.id,
      name: DEFAULT_USER.name,
      username: DEFAULT_USER.username,
      phone: "(11) 98765-4321",
      email: DEFAULT_USER.email,
      type: DEFAULT_USER.role,
      avatar: DEFAULT_USER.avatar,
    });
  });
}
