import { submitLogin } from "@auth/authApi";
import { LoginUserMutationProps } from "@interfaces/login.types";
import { AxiosError } from "axios";
import { useMutation, UseMutationOptions } from "react-query";

export default function useLoginUser<U>(
  options?:
    | Omit<
        UseMutationOptions<
          U,
          AxiosError<unknown, any>,
          LoginUserMutationProps,
          null
        >,
        "mutationFn"
      >
    | undefined
) {
  return useMutation<U, AxiosError, LoginUserMutationProps, null>(
    (body) => submitLogin(body),
    {
      mutationKey: "loginUser",
      ...options,
    }
  );
}
