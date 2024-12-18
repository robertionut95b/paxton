import { useAuthStore } from "@features/auth/stores/authStore";
import Roles from "@features/auth/types/roles";
import { checkUserHasRolesOrPermissions } from "@features/auth/utils/authorization";
import { User } from "@interfaces/user";
import { useCallback } from "react";
import { useAuth as useAuthOidc } from "react-oidc-context";

type AuthType = {
  user: User | null;
  setUser: (userData: User | null) => void;
  signout: (callback: VoidFunction) => void;
  loading: boolean;
  isAuthorized: (
    roleNames?: Roles[] | string[],
    permissionsNames?: string[],
  ) => boolean;
  accessToken: string | null;
};

export function useAuth(): AuthType {
  const auth = useAuthOidc();
  const {
    user,
    setUser,
    setUserLoading,
    userLoading: loading,
  } = useAuthStore();

  const signout = useCallback(
    (callback: VoidFunction) => {
      void auth.signoutRedirect();
      setUser(null);
      setUserLoading(false);
      callback?.();
    },
    [auth, setUser, setUserLoading],
  );

  const isAuthorized = useCallback(
    (roleNames?: Roles[] | string[], permissionNames?: string[]) => {
      let hasAuthorization = false;
      if (user) {
        hasAuthorization = checkUserHasRolesOrPermissions(
          user,
          roleNames,
          permissionNames,
        );
      }
      return hasAuthorization;
    },
    [user],
  );

  return {
    user,
    setUser,
    signout,
    loading,
    isAuthorized,
    accessToken: auth.user?.access_token ?? null,
  };
}
