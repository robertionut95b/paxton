import AuthContext from "@auth/AuthContext";
import AuthSpinner from "@components/spinners/AuthSpinner";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import useCurrentUser from "@hooks/useCurrentUser";
import useLoginUser from "@hooks/useLoginUser";
import useLogoutUser from "@hooks/useLogoutUser";
import { LoginUserMutationProps } from "@interfaces/login.types";
import { User } from "@interfaces/user.types";
import { api } from "@lib/axiosClient";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const { mutate: logIn } = useLoginUser({
    onSuccess: (data) => {
      const bearer = `Bearer ${data.access_token}`;
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
    },
  });
  const { mutate: logOut } = useLogoutUser();
  const { refetch: getCurrentUser, isLoading: getUserIsLoading } =
    useCurrentUser({
      onSuccess: (data) => {
        setUser(data);
        if (data) {
          queryClient.setQueryDefaults(["currentUser"], {
            staleTime: data.sessionTime,
            refetchInterval: data.sessionTime,
            refetchIntervalInBackground: true,
          });
        }
      },
      onError: (err) => {
        if (
          err.response?.status === 400 &&
          err.response?.data?.message === "Token not found"
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
