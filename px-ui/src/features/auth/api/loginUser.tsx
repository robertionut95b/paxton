import { submitLogin } from "@features/auth/api/authApi";
import {
  LoginUserMutationProps,
  LoginUserMutationResponseP,
} from "@features/auth/types/auth";
import { FullAPiResponse } from "@interfaces/api";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useLoginUser = (
  options: UseMutationOptions<
    LoginUserMutationResponseP,
    AxiosError<FullAPiResponse>,
    LoginUserMutationProps,
    null
  > = {
    mutationKey: ["loginUser"],
  },
) => useMutation({ mutationFn: submitLogin, ...options });
