import AuthContext from "@auth/AuthContext";
import AuthSpinner from "@components/spinners/AuthSpinner";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import useCurrentUser from "@hooks/useCurrentUser";
import useLoginUser from "@hooks/useLoginUser";
import useLogoutUser from "@hooks/useLogoutUser";
import { LoginUserMutationProps } from "@interfaces/login.types";
import { User } from "@interfaces/user.types";
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
    onError: (err) => {
      let msg = "Unknown error encountered, please try again later";
      if (
        err.response?.status === 401 &&
        // @ts-expect-error("types-error")
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
  const { refetch, isLoading: getUserIsLoading } = useCurrentUser({
    onSuccess: (data: User) => {
      setUser(data);
      queryClient.setQueryDefaults(["currentUser"], {
        staleTime: data?.sessionTime ?? 5 * 60 * 1000,
        refetchInterval: data?.sessionTime ?? 5 * 60 * 1000,
        refetchIntervalInBackground: true,
      });
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
        onSuccess: (data) => {
          setUser({
            sessionTime: data.sessionTime,
            username: data.username,
            permissions: data.permissions,
            firstName: data.firstName,
            lastName: data.lastName,
            profileSlugUrl: data.profileSlugUrl,
          });
          refetch();
        },
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
