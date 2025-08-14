import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type{ JSX } from "react";
import type{ PrivateRouteProps } from "../types/types";

const LoadingDemo = () =>{
  return(
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-(--cor-fundo)"></div>
    </div>
  )
}

const PrivateRoute = ({ children }: PrivateRouteProps): JSX.Element =>{
  const { user, loading } = useAuth();

  if (loading) {
    // Pode retornar um spinner, skeleton ou null enquanto autenticação carrega
    return <LoadingDemo/>
  }

  return user ? <>{children}</> : <Navigate to="/login" replace/>;
}

export default PrivateRoute;