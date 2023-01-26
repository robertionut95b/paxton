import RoleType from "@auth/RoleType";
import { useAuth } from "@auth/useAuth";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import AccessDenied from "@routes/AccessDenied";
import React, { useEffect, useState } from "react";

export interface IsAllowedProps {
  roles?: RoleType[] | string[];
  permissions?: string[];
  isLoading?: React.ReactElement;
  renderAuthFailed?: React.ReactElement;
  adminCheck?: boolean;
  children: React.ReactElement;
}

const IsAllowed = ({
  roles,
  permissions,
  isLoading = <ApplicationSpinner variant="dots" />,
  renderAuthFailed = <AccessDenied />,
  adminCheck = true,
  children,
}: IsAllowedProps) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      console.log("Invalid user, please provide user instance");
      return;
    }

    const { roles: userRoles, permissions: userPermissions } = user;
    setChecking(true);
    // role check
    if (roles && userRoles && userRoles.length > 0) {
      const intersection = userRoles.filter((role: string) =>
        roles.includes(RoleType[role as keyof typeof RoleType])
      );
      if (
        intersection.length > 0 ||
        (adminCheck && userRoles.includes(RoleType.ROLE_ADMINISTRATOR))
      )
        setHasAccess(true);
    }
    // permission check
    if (permissions && userPermissions && userPermissions.length > 0) {
      const intersection = userPermissions.filter((permission: string) =>
        permissions.includes(permission)
      );
      if (intersection.length > 0) setHasAccess(true);
    }

    setChecking(false);
  }, [roles, permissions]);

  if (!hasAccess && checking) {
    return isLoading;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (renderAuthFailed) {
    return renderAuthFailed;
  }

  return null;
};

export default IsAllowed;
