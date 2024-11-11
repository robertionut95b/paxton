import { logoutUser } from "@features/auth/api/authApi";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useLogoutUser(
  options: UseMutationOptions<void, AxiosError> = {
    mutationKey: ["logoutUser"],
  },
) {
  return useMutation({ mutationFn: logoutUser, ...options });
}
