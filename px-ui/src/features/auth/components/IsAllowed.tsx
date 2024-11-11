import AccessDenied from "@components/errors/AccessDenied";
import ApplicationSpinner from "@components/ui/spinners/ApplicationSpinner";
import { useAuth } from "@features/auth/hooks/useAuth";
import Roles from "@features/auth/types/roles";
import React, { useEffect, useState } from "react";

interface IsAllowedProps {
  roles?: Roles[] | string[];
  permissions?: string[];
  isLoading?: React.ReactElement;
  renderAuthFailed?: React.ReactElement | null;
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
        roles.includes(Roles[role as keyof typeof Roles]),
      );
      if (
        intersection.length > 0 ||
        (adminCheck && userRoles.includes(Roles.ROLE_ADMINISTRATOR))
      )
        setHasAccess(true);
    }
    // permission check
    if (permissions && userPermissions && userPermissions.length > 0) {
      const intersection = userPermissions.filter((permission: string) =>
        permissions.includes(permission),
      );
      if (intersection.length > 0) setHasAccess(true);
    }

    setChecking(false);
  }, [roles, permissions, adminCheck, user]);

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
