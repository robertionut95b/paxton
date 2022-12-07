import AuthContext from "@auth/AuthContext";
import AuthSpinner from "@components/spinners/AuthSpinner";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import useCurrentUser from "@hooks/useCurrentUser";
import useLoginUser from "@hooks/useLoginUser";
import useLogoutUser from "@hooks/useLogoutUser";
import {
  AccessTokenDecode,
  LoginUserMutationProps,
} from "@interfaces/login.types";
import { User } from "@interfaces/user.types";
import { api } from "@lib/axiosClient";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { useState } from "react";

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
  const queryClient = useQueryClient();

  const { mutate: logIn } = useLoginUser({
    onSuccess: ({ access_token }) => {
      const bearer = `Bearer ${access_token}`;
      // set authorization headers
      api.defaults.headers.Authorization = bearer;
      graphqlRequestClient.setHeader("Authorization", bearer);
    },
    onError: (err) => {
      let msg = "Unknown error encountered, please try again later";
      if (
        err.response &&
        err.response.status === 401 &&
        err.response.data.message
      ) {
        msg = "Invalid username or password combination";
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

  const { refetch: getCurrentUser, isLoading: getUserIsLoading } =
    useCurrentUser({
      onSuccess: (data) => {
        if (data && data.config.headers) {
          // @ts-expect-error(types-error)
          const bearer = data.config.headers.get("Authorization");
          const accessToken = bearer.split("Bearer ")[1];
          const decodedAccessToken = jwtDecode(
            accessToken
          ) as AccessTokenDecode;

          // set user instance
          setUser(userDecodeToUser(decodedAccessToken));

          // set query client stale time and refetch
          queryClient.setQueryDefaults(["currentUser"], {
            staleTime: expToMillis(decodedAccessToken.exp) - Date.now(),
            refetchInterval: expToMillis(decodedAccessToken.exp) - Date.now(),
            refetchIntervalInBackground: true,
          });
        }
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
          setUser(null);
        }
      },
    });

  const signin = (
    { username, password }: LoginUserMutationProps,
    callback: VoidFunction
  ) => {
    logIn(
      { username, password },
      {
        onSuccess: () => getCurrentUser(),
      }
    );
    callback?.();
  };

  const signout = (callback: VoidFunction) => {
    logOut();
    callback?.();
  };

  const value = {
    user,
    signin,
    signout,
    loading: getUserIsLoading,
    setUser,
  };

  if (getUserIsLoading) return <AuthSpinner />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
