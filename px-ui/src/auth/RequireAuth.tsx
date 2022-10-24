import { useAuth } from "@auth/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/app/login" state={{ from: location }} replace />;
  }

  return children;
}
