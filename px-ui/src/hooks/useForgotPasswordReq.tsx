import { forgotPassword } from "@auth/authApi";
import { AxiosError } from "axios";
import { useMutation, UseMutationOptions } from "react-query";

export default function useForgotPasswordRequest(
  options?:
    | Omit<
        UseMutationOptions<
          null,
          AxiosError<unknown, any>,
          { email: string },
          unknown
        >,
        "mutationFn"
      >
    | undefined
) {
  return useMutation<null, AxiosError, { email: string }>(
    (body) => forgotPassword(body),
    {
      mutationKey: "forgotPassword",
      ...options,
    }
  );
}
