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

const isAdmin = (permissions: string[]) =>
  permissions.some(
    (p) =>
      p === RoleType.ROLE_ADMINISTRATOR.toString() ||
      (p === PermissionType.READ_PRIVILEGE.toString() &&
        p === PermissionType.WRITE_PRIVILEGE.toString())
  );

export function RequirePermission({
  children,
  permission,
}: {
  children: JSX.Element;
  permission: PermissionType | string;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const permissions = user?.permissions ?? [];

  if (loading) return null;

  if (!isAdmin(permissions) || !isAllowed(permission, permissions)) {
    return (
      <Navigate to="/app/access-denied" state={{ from: location }} replace />
    );
  }

  return children;
}

export function RequirePermissionOrNull({
  children,
  permission,
}: {
  children: JSX.Element;
  permission: PermissionType | string;
}) {
  const { user, loading } = useAuth();
  const permissions = user?.permissions ?? [];

  if (loading || !isAdmin(permissions) || !isAllowed(permission, permissions))
    return null;

  return children;
}
