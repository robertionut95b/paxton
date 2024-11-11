import { changeProfileCover } from "@features/auth/api/authApi";
import { FullAPiResponse } from "@interfaces/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useChangeProfileBanner(
  options: UseMutationOptions<
    void,
    AxiosError<FullAPiResponse, unknown>,
    FormData,
    null
  > = {
    mutationKey: ["changeProfileBanner"],
  },
) {
  return useMutation<
    void,
    AxiosError<FullAPiResponse, unknown>,
    FormData,
    null
  >({
    mutationFn: changeProfileCover,
    ...options,
  });
}
