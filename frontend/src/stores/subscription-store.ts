import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { API } from "@/services/api";

export type PlanId = "essential" | "extra" | "deluxe";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  description: string;
  features: string[];
};

export const PLANS: Record<PlanId, Plan> = {
  essential: {
    id: "essential",
    name: "Essencial",
    price: "Grátis",
    description: "O básico para compartilhar receitas e cuidar da sua rotina.",
    features: ["Feed e interações", "Publicar receitas", "5 perguntas diárias ao assistente", "Perfil básico"],
  },
  extra: {
    id: "extra",
    name: "Extra",
    price: "R$ 9,90/mês",
    description: "Mais organização e planejamento para a sua cozinha.",
    features: ["Assistente com uso ampliado", "Coleções de favoritos", "Busca avançada", "Lista de compras automática", "Selo Extra no perfil"],
  },
  deluxe: {
    id: "deluxe",
    name: "Deluxe",
    price: "R$ 19,90/mês",
    description: "Uma experiência personalizada para as suas escolhas.",
    features: ["Tudo do Extra", "Recomendações personalizadas", "Informação nutricional", "Exportar receita em PDF", "Destaque no feed e suporte prioritário"],
  },
};

export function hasPlan(plan: PlanId, required: "extra" | "deluxe") {
  return required === "extra" ? plan === "extra" || plan === "deluxe" : plan === "deluxe";
}

type SubscriptionStore = {
  plan: PlanId;
  usageDay: string;
  chatbotQuestionsUsed: number;
  setPlan: (plan: PlanId) => void;
  consumeChatbotQuestion: () => void;
  syncPlan: () => Promise<boolean>;
};

const today = () => new Date().toISOString().slice(0, 10);

export const useSubscription = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      plan: "essential",
      usageDay: today(),
      chatbotQuestionsUsed: 0,
      setPlan: (plan) => set({ plan }),
    syncPlan: async () => {
      try {
        const { data } = await API.get<{ effectivePlan: PlanId }>("/subscription/me");
        if (data?.effectivePlan) {
          set({ plan: data.effectivePlan });
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
      consumeChatbotQuestion: () => {
        const currentDay = today();
        const isNewDay = get().usageDay !== currentDay;
        set({
          usageDay: currentDay,
          chatbotQuestionsUsed: isNewDay ? 1 : get().chatbotQuestionsUsed + 1,
        });
      },
    }),
    { name: "subscription-storage", storage: createJSONStorage(() => localStorage) }
  )
);
