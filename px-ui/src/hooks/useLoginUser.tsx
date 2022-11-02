import { submitLogin } from "@auth/authApi";
import {
  LoginUserMutationProps,
  LoginUserMutationResponse,
} from "@interfaces/login.types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useLoginUser(
  options: UseMutationOptions<
    LoginUserMutationResponse,
    AxiosError,
    LoginUserMutationProps,
    null
  > = {
    mutationKey: ["loginUser"],
  }
) {
  return useMutation(submitLogin, {
    ...options,
  });
}
