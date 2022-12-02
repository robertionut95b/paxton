import { PermissionType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { RoleType } from "./permission.types";

const isAllowed = (
  permission: PermissionType | string,
  permissions: string[]
) =>
  permissions
    .map((p) => p.toLowerCase())
    .includes(permission.toString().toLowerCase());

export const isAdmin = (permissions: string[]) =>
  permissions.some((p) => p === RoleType.ROLE_ADMINISTRATOR);

export function RequirePermission({
  children,
  permission,
}: {
  children: JSX.Element;
  permission: PermissionType | string | (() => boolean);
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const permissions = user?.permissions ?? [];

  if (loading) return null;

  if (isAdmin(permissions)) return children;

  if (typeof permission === "function") {
    if (!permission()) {
      return (
        <Navigate to="/app/access-denied" state={{ from: location }} replace />
      );
    }
  } else {
    if (!isAllowed(permission, permissions)) {
      return (
        <Navigate to="/app/access-denied" state={{ from: location }} replace />
      );
    }
  }

  return children;
}

export function RequirePermissionOrNull({
  children,
  permission,
}: {
  children: JSX.Element;
  permission: PermissionType | string | (() => boolean);
}) {
  const { user, loading } = useAuth();
  const permissions = user?.permissions ?? [];

  if (loading) return null;

  if (isAdmin(permissions)) return children;

  if (typeof permission === "function") {
    if (permission()) return children;
  } else {
    if (isAllowed(permission, permissions)) return children;
  }

  return null;
}
