import { submitLogin } from "@auth/authApi";
import { FullAPiResponse } from "@interfaces/api.resp.types";
import {
  LoginUserMutationProps,
  LoginUserMutationResponseP,
} from "@interfaces/login.types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useLoginUser(
  options: UseMutationOptions<
    LoginUserMutationResponseP,
    AxiosError<FullAPiResponse>,
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
