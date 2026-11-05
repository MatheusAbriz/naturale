import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/stores/auth-store";
import { useSubscription } from "@/stores/subscription-store";
import { GlobalLoading } from "@/Components/common/global-loading";

export function ProtectedRoute() {
  const hasHydrated = useAuth((state) => state.hasHydrated);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  // Garante que o plano local reflita o real assim que a sessão autentica
  // (login, refresh da página, nova aba) e não só no retorno do checkout do MP.
  useEffect(() => {
    if (isAuthenticated) {
      useSubscription.getState().syncPlan();
    }
  }, [isAuthenticated]);

  if (!hasHydrated) return <GlobalLoading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
