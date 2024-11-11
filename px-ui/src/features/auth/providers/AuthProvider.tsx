import { useLoginUser } from "@features/auth/api/loginUser";
import AuthContext from "@features/auth/context/AuthContext";
import useLoginUserByToken from "@features/auth/hooks/useLoginUserByToken";
import useLogoutUser from "@features/auth/hooks/useLogoutUser";
import useRefreshLogin from "@features/auth/hooks/useRefreshLogin";
import { useAuthStore } from "@features/auth/stores/authStore";
import {
  LoginUserByTokenMutationProps,
  LoginUserMutationProps,
} from "@features/auth/types/auth";
import Roles from "@features/auth/types/roles";
import { checkUserHasRolesOrPermissions } from "@features/auth/utils/authorization";
import {
  setAuthenticationByAccessToken,
  setUserByToken,
} from "@features/auth/utils/authUtils";
import { useGetCurrentUserQuery } from "@gql/generated";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { GraphqlApiResponse } from "@interfaces/api";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useInterval } from "usehooks-ts";

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    user,
    setUser,
    userLoading,
    accessToken,
    setAccessToken,
    tokenExpiry,
    setTokenExpiry,
    setUserLoading,
  } = useAuthStore();
  const queryClient = useQueryClient();

  // launch a query which retrieves initial user data
  const { isLoading } = useGetCurrentUserQuery(
    graphqlRequestClient,
    {},
    {
      onError: () => {
        // pass
      },
      retry: (failureCount, error) => {
        const err = error as GraphqlApiResponse;
        return (
          failureCount === 0 && err?.response?.status === 401 && !!accessToken
        );
      },
    },
  );

  const loading = (user === null || isLoading) && userLoading;

  const loadAuthenticationByToken = (accessToken: string) => {
    setAccessToken(accessToken);
    setAuthenticationByAccessToken(accessToken);
    setUserByToken(accessToken);
  };

  const { mutate: logIn } = useLoginUser({
    onSuccess: ({ access_token }) => loadAuthenticationByToken(access_token),
    onError: (err) => {
      const msg =
        err.response?.data.message ??
        "Unknown error encountered, please try again later";
      showNotification({
        title: "Authentication error",
        message: msg,
        autoClose: 5000,
        icon: <LockClosedIcon width={20} />,
      });
      setUser(null);
    },
  });

  const { mutate: loginByToken } = useLoginUserByToken({
    onSuccess: ({ access_token }) => loadAuthenticationByToken(access_token),
    onError: (err) => {
      const msg =
        err.response?.data.message ??
        "Unknown error encountered, please try again later";
      showNotification({
        title: "Authentication error",
        message: msg,
        autoClose: 5000,
        icon: <LockClosedIcon width={20} />,
      });
      if (
        err.response &&
        (err.response.status === 404 || err.response.status === 400)
      ) {
        // eslint-disable-next-line react-compiler/react-compiler
        window.location.href = "/login";
      }
      setUser(null);
    },
  });

  const { mutate: logOut } = useLogoutUser();

  const { mutate: refreshLogin } = useRefreshLogin({
    retry: 0,
  });

  const signIn = (
    { username, password }: LoginUserMutationProps,
    callback: VoidFunction,
  ) => {
    logIn(
      { username, password },
      {
        onSuccess: () => callback?.(),
      },
    );
  };

  const signInByToken = (
    { token }: LoginUserByTokenMutationProps,
    callback: VoidFunction,
  ) => {
    loginByToken({ token }, { onSuccess: () => callback?.() });
  };

  const signout = (callback: VoidFunction) => {
    logOut();
    setUser(null);
    setAccessToken(null);
    setTokenExpiry(null);
    setUserLoading(false);
    queryClient.clear();
    callback?.();
  };

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

  useInterval(() => {
    refreshLogin();
  }, tokenExpiry);

  const value = useMemo(
    () => ({
      user,
      signIn,
      signInByToken,
      signout,
      loading,
      setUser,
      isAuthorized,
      accessToken,
    }),
    [user, loading],
  );

  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
