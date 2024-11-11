import { submitLoginByToken } from "@features/auth/api/authApi";
import {
  LoginUserByTokenMutationProps,
  LoginUserMutationResponseP,
} from "@features/auth/types/auth";
import { FullAPiResponse } from "@interfaces/api";
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
  },
) {
  return useMutation({ mutationFn: submitLoginByToken, ...options });
}
