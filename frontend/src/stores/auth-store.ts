import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/auth";

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  setHasHydrated: (value: boolean) => void;
  signIn: (data: User) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },

      signIn: async (data) => {
        set({
          user: data,
          isAuthenticated: true,
        });
      },

      updateUser: (data) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...data } });
      },

      logout: async () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.error("Erro ao restaurar sessão:", error);
        // setTimeout(0): localStorage é síncrono, então esse callback pode
        // disparar ainda durante a criação da store — antes de `useAuth`
        // terminar de ser atribuído (TDZ). Adiar pro próximo tick evita isso.
        setTimeout(() => {
          useAuth.getState().setHasHydrated(true);
        }, 0);
      },
    }
  )
);
