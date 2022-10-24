import { resetPassword } from "@auth/authApi";
import { ResetPasswordProps } from "@interfaces/reset-password.types";
import { AxiosError } from "axios";
import { useMutation, UseMutationOptions } from "react-query";

export default function useResetPassword(
  options?:
    | Omit<
        UseMutationOptions<
          null,
          AxiosError<unknown, any>,
          ResetPasswordProps,
          null
        >,
        "mutationFn"
      >
    | undefined
) {
  return useMutation<null, AxiosError, ResetPasswordProps, null>(
    (data) =>
      resetPassword(
        {
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        data.token
      ),
    {
      ...options,
      mutationKey: "resetPassword",
    }
  );
}
