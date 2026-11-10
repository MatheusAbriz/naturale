import { Page } from "@playwright/test";

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
  const authData = createAuthState(options.user);
  const subData = createSubscriptionState(options.plan ?? "essential");

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
