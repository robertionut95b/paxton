import { RoleType } from "@auth/permission.types";
import {
  LoginUserByTokenMutationProps,
  LoginUserMutationProps,
} from "@interfaces/login.types";
import { User } from "@interfaces/user.types";
import { createContext } from "react";

interface AuthContextType {
  user: User | null;
  setUser: (userData: User | null) => void;
  signin: (credentials: LoginUserMutationProps, callback: VoidFunction) => void;
  signInByToken: (
    tokenProps: LoginUserByTokenMutationProps,
    callback: VoidFunction,
  ) => void;
  signout: (callback: VoidFunction) => void;
  loading: boolean;
  isAuthorized: (
    roleNames?: RoleType[] | string[],
    permissionsNames?: string[],
  ) => boolean;
  accessToken: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const AuthContext = createContext<AuthContextType>(null!);

export default AuthContext;
