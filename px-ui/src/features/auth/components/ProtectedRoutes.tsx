import { Routes } from "@app/routes";
import { useAuth } from "@features/auth/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return user ? (
    <Outlet />
  ) : (
    <Navigate to={Routes.Login.path} state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
