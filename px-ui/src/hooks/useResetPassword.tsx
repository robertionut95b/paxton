import { resetPassword } from "@auth/authApi";
import { ResetPasswordProps } from "@interfaces/reset-password.types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useResetPassword(
  options: UseMutationOptions<void, AxiosError, ResetPasswordProps, null> = {
    mutationKey: ["resetPassword"],
  }
) {
  return useMutation<void, AxiosError, ResetPasswordProps, null>({
    mutationFn: resetPassword,
    ...options,
  });
}
