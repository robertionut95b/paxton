import {
  LoginUserByTokenMutationProps,
  LoginUserMutationProps,
} from "@features/auth/types/auth";
import Roles from "@features/auth/types/roles";
import { User } from "@interfaces/user";
import { createContext } from "react";

interface AuthContextType {
  user: User | null;
  setUser: (userData: User | null) => void;
  signIn: (credentials: LoginUserMutationProps, callback: VoidFunction) => void;
  signInByToken: (
    tokenProps: LoginUserByTokenMutationProps,
    callback: VoidFunction,
  ) => void;
  signout: (callback: VoidFunction) => void;
  loading: boolean;
  isAuthorized: (
    roleNames?: Roles[] | string[],
    permissionsNames?: string[],
  ) => boolean;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType>(null!);

export default AuthContext;
