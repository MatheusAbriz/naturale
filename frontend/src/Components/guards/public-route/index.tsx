import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/stores/auth-store";
import { GlobalLoading } from "@/Components/common/global-loading";

export function PublicRoute() {
  const hasHydrated = useAuth((state) => state.hasHydrated);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  if (!hasHydrated) return <GlobalLoading />;
  if (isAuthenticated) return <Navigate to="/home" replace />;

  return <Outlet />;
}
