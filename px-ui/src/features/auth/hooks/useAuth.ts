import AuthContext from "@features/auth/context/AuthContext";
import { useContext } from "react";

export function useAuth() {
  return useContext(AuthContext);
}
