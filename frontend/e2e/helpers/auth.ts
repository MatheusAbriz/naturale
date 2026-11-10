import { Page } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();
export const IS_REAL_API = process.env.E2E_USE_REAL_API === "true";

export const REAL_USER_CREDENTIALS = {
  email: "admin@test.com",
  password: "123456@Admin",
};

export const API_BASE_URL = "https://api-6yuvneknga-uc.a.run.app";

export interface MockUser {
  id: number;
  name: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  avatar: string;
  token: string;
}

export type PlanId = "essential" | "extra" | "deluxe";

export const DEFAULT_USER: MockUser = {
  id: 1,
  name: "Matheus Teste",
  email: "matheus@teste.com",
  username: "matheusteste",
  role: "USER",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
  token: "fake-jwt-token-123456",
};

let cachedRealUser: MockUser | null = null;

export async function getRealAuthenticatedUser(): Promise<MockUser> {
  if (cachedRealUser) return cachedRealUser;
  const res = await fetch(`${API_BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(REAL_USER_CREDENTIALS),
  });
  const data = await res.json();
  cachedRealUser = {
    id: data.id,
    name: data.name,
    email: data.email,
    username: data.username,
    role: data.type,
    avatar: data.avatar || "",
    token: data.token,
  };
  return cachedRealUser;
}

export function createAuthState(userOverrides?: Partial<MockUser>) {
  const user: MockUser = {
    ...DEFAULT_USER,
    ...userOverrides,
  };

  return {
    state: {
      user,
      isAuthenticated: true,
      hasHydrated: true,
    },
    version: 0,
  };
}

export function createSubscriptionState(plan: PlanId = "essential") {
  return {
    state: {
      plan,
      usageDay: new Date().toISOString().slice(0, 10),
      chatbotQuestionsUsed: 0,
    },
    version: 0,
  };
}

export interface SetupSessionOptions {
  user?: Partial<MockUser>;
  plan?: PlanId;
}

export async function setupAuthenticatedSession(
  page: Page,
  options: SetupSessionOptions = {}
) {
  let activeUser: MockUser;
  let activePlan: PlanId = options.plan ?? "essential";

  if (IS_REAL_API && !options.user) {
    activeUser = await getRealAuthenticatedUser();
    if (!options.plan) {
      activePlan = "extra";
    }
  } else {
    activeUser = {
      ...DEFAULT_USER,
      ...options.user,
    };
  }

  const authData = {
    state: {
      user: activeUser,
      isAuthenticated: true,
      hasHydrated: true,
    },
    version: 0,
  };
  const subData = createSubscriptionState(activePlan);

  await page.addInitScript(
    ({ auth, sub }) => {
      window.localStorage.setItem("auth-storage", JSON.stringify(auth));
      window.localStorage.setItem("subscription-storage", JSON.stringify(sub));

      let copiedText = "";
      (window as any).__lastCopiedText = "";

      if (!navigator.clipboard) {
        (navigator as any).clipboard = {};
      }
      navigator.clipboard.writeText = async (text: string) => {
        copiedText = text;
        (window as any).__lastCopiedText = text;
        return Promise.resolve();
      };
      navigator.clipboard.readText = async () => {
        return (window as any).__lastCopiedText || copiedText;
      };
    },
    { auth: authData, sub: subData }
  );
}
