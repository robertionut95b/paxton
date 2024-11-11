import { Routes } from "@app/routes";
import { useAuth } from "@features/auth/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const NonProtectedRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return user ? (
    <Navigate to={Routes.Home.path} state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default NonProtectedRoutes;
