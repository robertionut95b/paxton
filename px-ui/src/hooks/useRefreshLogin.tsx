import { refreshLogin } from "@auth/authApi";
import { FullAPiResponse } from "@interfaces/api.resp.types";
import { LoginUserMutationResponseP } from "@interfaces/login.types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export default function useRefreshLogin(
  options: UseMutationOptions<
    AxiosResponse<LoginUserMutationResponseP>,
    AxiosError<FullAPiResponse>,
    void,
    null
  > = {
    mutationKey: ["refreshLogin"],
  }
) {
  return useMutation<
    AxiosResponse<LoginUserMutationResponseP>,
    AxiosError<FullAPiResponse>,
    void,
    null
  >({
    mutationFn: refreshLogin,
    ...options,
  });
}
