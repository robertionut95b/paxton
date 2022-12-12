import AuthContext from "@auth/AuthContext";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import useInterval from "@hooks/useInterval";
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
import { useEffect, useState } from "react";
import { AuthErrorMessages } from "./messages";

const userDecodeToUser = (userDecode: AccessTokenDecode): User => {
  return {
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
  const [refreshIntervalInSec, setRefreshIntervalInSec] = useState(
    expToMillis(60)
  );

  const loadMetaFromToken = (accessToken: string) => {
    const bearer = `Bearer ${accessToken}`;
    // set authorization headers
    api.defaults.headers.Authorization = bearer;
    graphqlRequestClient.setHeader("Authorization", bearer);
    const decodedAccessToken = jwtDecode(accessToken) as AccessTokenDecode;
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
    onSuccess: ({ access_token }) => {
      loadMetaFromToken(access_token);
    },
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

  const { isLoading: refreshIsLoading, mutate: refreshLogin } = useRefreshLogin(
    {
      onSuccess: (data) => {
        loadMetaFromToken(data.data.access_token);
      },
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
          setRefreshIntervalInSec(Number.MAX_SAFE_INTEGER);
        }
        setUser(null);
      },
    }
  );

  const signin = (
    { username, password }: LoginUserMutationProps,
    callback: VoidFunction
  ) => {
    logIn({ username, password });
    callback?.();
  };

  const signout = (callback: VoidFunction) => {
    logOut();
    callback?.();
  };

  useInterval(() => refreshLogin(), refreshIntervalInSec);

  useEffect(() => refreshLogin(), []);

  const value = {
    user,
    signin,
    signout,
    loading: (!user || user === null) && refreshIsLoading,
    setUser,
  };

  if ((!user || user === null) && refreshIsLoading)
    return <ApplicationSpinner />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
