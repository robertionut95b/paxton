import { PermissionType, RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import { Navigate, useLocation } from "react-router-dom";

const isAllowed = (
  permission: PermissionType | string,
  permissions: string[]
) =>
  permissions
    .map((p) => p.toLowerCase())
    .includes(permission.toString().toLowerCase());

export const isAdmin = (permissions: string[]) =>
  permissions.some((p) => p === RoleType.ROLE_ADMINISTRATOR);

export const isRecruiter = (permissions: string[]) =>
  permissions.some((p) => p === RoleType.ROLE_RECRUITER);

type RequireProps = {
  children: JSX.Element;
  permission: PermissionType | string | (() => boolean);
  strict?: boolean;
  returnValue?: "navigate" | "null";
};

export function RequirePermission({
  children,
  permission,
  strict = false,
  returnValue = "navigate",
}: RequireProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const permissions = user?.permissions ?? [];

  const returnVal =
    returnValue === "navigate" ? (
      <Navigate to="/app/access-denied" state={{ from: location }} replace />
    ) : null;

  if (loading) return null;

  if (!strict) {
    if (isAdmin(permissions)) return children;
  }

  if (typeof permission === "function") {
    if (!permission()) {
      return returnVal;
    }
  } else {
    if (!isAllowed(permission, permissions)) {
      return returnVal;
    }
  }

  return children;
}
