import AuthContext from "@auth/AuthContext";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import useCurrentUser from "@hooks/useCurrentUser";
import useLoginUser from "@hooks/useLoginUser";
import useLogoutUser from "@hooks/useLogoutUser";
import { LoginUserMutationProps } from "@interfaces/login.types";
import { User } from "@interfaces/user.types";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const { mutate: logIn } = useLoginUser<User>({
    onError: (err) => {
      if (
        err.response?.status === 401 &&
        // @ts-expect-error("types-error")
        err.response.data.message
      ) {
        showNotification({
          title: "Authentication error",
          message: "Invalid username or password combination",
          autoClose: 5000,
          icon: <LockClosedIcon width={20} />,
        });
      }
    },
  });
  const { mutate: logOut } = useLogoutUser();
  const { refetch, isLoading: getUserIsLoading } = useCurrentUser<User>({
    setUser,
  });

  const signin = (
    { username, password }: LoginUserMutationProps,
    callback: VoidFunction
  ) => {
    logIn(
      { username, password },
      {
        onSuccess: (data) => {
          setUser(data);
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
  };

  if (getUserIsLoading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
