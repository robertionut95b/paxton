import Roles from "@features/auth//types/roles";
import { User } from "@interfaces/user";

export const checkUserHasRolesOrPermissions = (
  user: User,
  roles?: Roles[] | string[],
  permissions?: string[],
): boolean => {
  let hasRoles = false;
  let hasPermissions = false;
  // role checking
  if (user.roles && roles && user.roles.length > 0) {
    const userRoles = user.roles;
    const intersection = userRoles.filter((role) => roles.includes(role));
    hasRoles = intersection.length > 0;
  }
  // permission checking
  if (user.permissions && permissions && user.permissions.length > 0) {
    const userPermissions = user.permissions;
    const intersection = userPermissions.filter((permission) =>
      permissions.includes(permission),
    );
    hasPermissions = intersection.length > 0;
  }
  return hasRoles || hasPermissions;
};
