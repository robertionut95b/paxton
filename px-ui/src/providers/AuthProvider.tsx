import AuthContext from "@auth/AuthContext";
import RoleType from "@auth/RoleType";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import useLoginUser from "@hooks/useLoginUser";
import useLogoutUser from "@hooks/useLogoutUser";
import useRefreshLogin from "@hooks/useRefreshLogin";
import {
  AccessTokenDecode,
  LoginUserMutationProps,
} from "@interfaces/login.types";
import { User } from "@interfaces/user.types";
import { api } from "@lib/axiosClient";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { showNotification } from "@mantine/notifications";
import jwtDecode from "jwt-decode";
import { useMemo, useState } from "react";
import { useEffectOnce, useInterval } from "usehooks-ts";
import { AuthErrorMessages } from "./messages";

const userDecodeToUser = (userDecode: AccessTokenDecode): User => {
  return {
    userId: userDecode.userId,
    firstName: userDecode.firstName,
    lastName: userDecode.lastName,
    permissions: userDecode.authorities.split(","),
    profileSlugUrl: userDecode.profileSlugUrl,
    sessionTime: userDecode.exp,
    username: userDecode.sub,
    profileId: userDecode.profileId,
    isEmailConfirmed: userDecode.isEmailConfirmed,
  };
};

const expToMillis = (exp: number) => exp * 1000;

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [refreshIntervalInSec, setRefreshIntervalInSec] = useState<
    number | null
  >(expToMillis(60));
  const [loading, setLoading] = useState(true);

  const loadMetaFromToken = (accessToken: string) => {
    const bearer = `Bearer ${accessToken}`;
    // set authorization headers
    api.defaults.headers.Authorization = bearer;
    graphqlRequestClient.setHeader("Authorization", bearer);
    const decodedAccessToken: AccessTokenDecode = jwtDecode(accessToken);
    // set refresh interval
    setRefreshIntervalInSec(
      decodedAccessToken.exp < 1000
        ? expToMillis(decodedAccessToken.exp) - Date.now()
        : expToMillis(decodedAccessToken.exp) - 1000 - Date.now()
    );
    // set user instance
    setUser(userDecodeToUser(decodedAccessToken));
  };

  const { mutate: logIn } = useLoginUser({
    onSuccess: ({ access_token }) => loadMetaFromToken(access_token),
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

  const { mutate: logOut } = useLogoutUser();

  const { mutate: refreshLogin } = useRefreshLogin({
    onSuccess: (data) => loadMetaFromToken(data.data.access_token),
    onError: (err) => {
      if (
        err.response?.status === 400 &&
        err.response?.data?.message ===
          "Refresh token was expired. Please make a new sign-in request"
      ) {
        showNotification({
          title: "Authentication error",
          message: "Your session has expired, please log in again",
          autoClose: 5000,
          icon: <LockClosedIcon width={20} />,
        });
      }
      setRefreshIntervalInSec(null);
      setUser(null);
    },
    onSettled: () => setLoading(false),
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

  const signout = (callback: VoidFunction) => {
    logOut();
    setUser(null);
    setRefreshIntervalInSec(null);
    callback?.();
  };

  useInterval(() => refreshLogin(), refreshIntervalInSec);

  useEffectOnce(() => refreshLogin());

  const isInRole = (role: RoleType) =>
    (user?.permissions ?? []).some((p) => p === role);

  const value = useMemo(
    () => ({
      user,
      signin,
      signout,
      loading: (!user || user === null) && loading,
      setUser,
      isInRole,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading]
  );

  if ((!user || user === null) && loading) return <ApplicationSpinner />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
