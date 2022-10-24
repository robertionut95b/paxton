import { logoutUser } from "@auth/authApi";
import { useMutation } from "react-query";

export default function useLogoutUser<T>() {
  return useMutation<T>(logoutUser);
}
