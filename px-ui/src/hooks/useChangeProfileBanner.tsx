import { changeProfileCover } from "@auth/authApi";
import { FullAPiResponse } from "@interfaces/api.resp.types";
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
  }
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
