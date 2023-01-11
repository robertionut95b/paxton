import { RoleType } from "@auth/permission.types";
import { LoginUserMutationProps } from "@interfaces/login.types";
import { User } from "@interfaces/user.types";
import { createContext } from "react";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signin: (credentials: LoginUserMutationProps, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
  loading: boolean;
  isInRole: (role: RoleType) => boolean;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const AuthContext = createContext<AuthContextType>(null!);

export default AuthContext;
