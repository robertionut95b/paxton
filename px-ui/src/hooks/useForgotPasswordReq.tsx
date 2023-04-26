import { forgotPassword } from "@auth/authApi";
import { ResetPasswordRequestProps } from "@interfaces/reset-password.types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useForgotPasswordRequest(
  options: UseMutationOptions<
    void,
    AxiosError,
    ResetPasswordRequestProps,
    null
  > = {
    mutationKey: ["forgotPasswordRequest"],
  }
) {
  return useMutation<void, AxiosError, ResetPasswordRequestProps, null>({
    mutationFn: forgotPassword,
    ...options,
  });
}
