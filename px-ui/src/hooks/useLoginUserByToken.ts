import { submitLoginByToken } from "@auth/authApi";
import { FullAPiResponse } from "@interfaces/api.resp.types";
import {
  LoginUserByTokenMutationProps,
  LoginUserMutationResponseP,
} from "@interfaces/login.types";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useLoginUserByToken(
  options: UseMutationOptions<
    LoginUserMutationResponseP,
    AxiosError<FullAPiResponse>,
    LoginUserByTokenMutationProps,
    null
  > = {
    mutationKey: ["loginUserByToken"],
  }
) {
  return useMutation({ mutationFn: submitLoginByToken, ...options });
}
