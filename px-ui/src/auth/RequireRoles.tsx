import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import { Navigate, useLocation } from "react-router-dom";

const isAllowed = (
  roles: RoleType | Array<RoleType> | string,
  permissions: string[]
) => {
  if (Array.isArray(roles))
    return permissions.some((p) =>
      roles.some((r) => r.toLocaleLowerCase() === p.toLowerCase())
    );
  else
    return permissions
      .map((p) => p.toLowerCase())
      .includes(roles.toString().toLowerCase());
};

export const isAdmin = (permissions: string[]) =>
  permissions.some((p) => p === RoleType.ROLE_ADMINISTRATOR);

export const isRecruiter = (permissions: string[]) =>
  permissions.some((p) => p === RoleType.ROLE_RECRUITER);

type RequireProps = {
  children: JSX.Element;
  roles: Array<RoleType> | RoleType;
  strict?: boolean;
  returnValue?: "navigate" | "null";
};

export function RequireRoles({
  children,
  roles,
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

  if (!isAllowed(roles, permissions)) {
    return returnVal;
  }

  return children;
}
