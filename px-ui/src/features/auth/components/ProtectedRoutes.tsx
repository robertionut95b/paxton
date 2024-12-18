import { Routes } from "@app/routes";
import { useAuth, withAuthenticationRequired } from "react-oidc-context";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={Routes.Login.path} state={{ from: location }} replace />
  );
};

export default withAuthenticationRequired(ProtectedRoutes);
