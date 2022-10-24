import AuthContext from "@auth/AuthContext";
import { useContext } from "react";

export function useAuth() {
  return useContext(AuthContext);
}
