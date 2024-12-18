import { Routes } from "@app/routes";
import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const NonProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  return isAuthenticated ? (
    <Navigate to={Routes.Home.path} state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default NonProtectedRoutes;
