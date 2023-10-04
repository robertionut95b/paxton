import AuthContext from "@auth/AuthContext";
import RoleType from "@auth/RoleType";
import { useAuthStore } from "@auth/authStore";
import {
  setAuthenticationByAccessToken,
  setUserByToken,
} from "@auth/authUtils";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import { useGetCurrentUserQuery } from "@gql/generated";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import useLoginUser from "@hooks/useLoginUser";
import useLoginUserByToken from "@hooks/useLoginUserByToken";
import useLogoutUser from "@hooks/useLogoutUser";
import useRefreshLogin from "@hooks/useRefreshLogin";
import { GraphqlApiResponse } from "@interfaces/api.resp.types";
import {
  LoginUserByTokenMutationProps,
  LoginUserMutationProps,
} from "@interfaces/login.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { CheckUserHasRolesOrPermissions } from "@utils/security";
import { useCallback, useMemo } from "react";
import { useInterval } from "usehooks-ts";
import { AuthErrorMessages } from "./messages";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
    }
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
      let msg = "Unknown error encountered, please try again later";
      if (err.response && err.response.status === 401) {
        msg =
          AuthErrorMessages[err.response.data.message] ??
          AuthErrorMessages["Unknown"];
      }
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
      let msg = "Unknown error encountered, please try again later";
      if (err.response && err.response.status === 401) {
        msg =
          AuthErrorMessages[err.response.data.message] ??
          AuthErrorMessages["Unknown"];
      }
      showNotification({
        title: "Authentication error",
        message: msg,
        autoClose: 5000,
        icon: <LockClosedIcon width={20} />,
      });
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.message ===
          "Token is expired, please re-submit login request"
      ) {
        window.location.href = "/login";
      }
      setUser(null);
    },
  });

  const { mutate: logOut } = useLogoutUser();

  const { mutate: refreshLogin } = useRefreshLogin({
    retry: 0,
  });

  const signin = (
    { username, password }: LoginUserMutationProps,
    callback: VoidFunction
  ) => {
    logIn(
      { username, password },
      {
        onSuccess: () => callback?.(),
      }
    );
  };

  const signInByToken = (
    { token }: LoginUserByTokenMutationProps,
    callback: VoidFunction
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
    (roleNames?: RoleType[] | string[], permissionNames?: string[]) => {
      let hasAuthorization = false;
      if (user) {
        hasAuthorization = CheckUserHasRolesOrPermissions(
          user,
          roleNames,
          permissionNames
        );
      }
      return hasAuthorization;
    },
    [user]
  );

  useInterval(() => {
    refreshLogin();
  }, tokenExpiry);

  const value = useMemo(
    () => ({
      user,
      signin,
      signInByToken,
      signout,
      loading,
      setUser,
      isAuthorized,
      accessToken,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading]
  );

  if (loading) return <ApplicationSpinner />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
