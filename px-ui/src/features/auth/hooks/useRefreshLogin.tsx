import { refreshLogin } from "@features/auth/api/authApi";
import { LoginUserMutationResponseP } from "@features/auth/types/auth";
import { FullAPiResponse } from "@interfaces/api";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export default function useRefreshLogin(
  options: UseMutationOptions<
    AxiosResponse<LoginUserMutationResponseP>,
    AxiosError<FullAPiResponse>,
    void,
    null
  > = {
    mutationKey: ["refreshLogin"],
  },
) {
  return useMutation({
    mutationFn: refreshLogin,
    ...options,
  });
}
