import { registerUser } from "@auth/authApi";
import { FullAPiResponse } from "@interfaces/api.resp.types";
import { RegisterUserMutationProps } from "@interfaces/signup.types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useRegisterUser(
  options: UseMutationOptions<
    void,
    AxiosError<FullAPiResponse, unknown>,
    RegisterUserMutationProps,
    null
  > = {
    mutationKey: ["registerUser"],
  },
) {
  return useMutation<
    void,
    AxiosError<FullAPiResponse, unknown>,
    RegisterUserMutationProps,
    null
  >({
    mutationFn: registerUser,
    ...options,
  });
}
