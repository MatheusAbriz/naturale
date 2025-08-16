import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../Components/Loading/loading";
import type{ JSX } from "react";
import type{ PrivateRouteProps } from "../types/types";

const PrivateRoute = ({ children }: PrivateRouteProps): JSX.Element =>{
  const { user, loading } = useAuth();

  if (loading) {
    // Pode retornar um spinner, skeleton ou null enquanto autenticação carrega
    return <Loading/>
  }

  return user ? <>{children}</> : <Navigate to="/login" replace/>;
}

export default PrivateRoute;