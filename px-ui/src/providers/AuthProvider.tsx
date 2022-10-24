import AuthContext from "@auth/AuthContext";
import useCurrentUser from "@hooks/useCurrentUser";
import useLoginUser from "@hooks/useLoginUser";
import useLogoutUser from "@hooks/useLogoutUser";
import { LoginUserMutationProps } from "@interfaces/login.types";
import { User } from "@interfaces/user.types";
import { useState } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const { mutate: logIn } = useLoginUser<User>();
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
