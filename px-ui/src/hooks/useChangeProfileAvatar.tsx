import { changeProfileAvatar } from "@auth/authApi";
import { FullAPiResponse } from "@interfaces/api.resp.types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useChangeProfileAvatar(
  options: UseMutationOptions<
    void,
    AxiosError<FullAPiResponse, unknown>,
    FormData,
    null
  > = {
    mutationKey: ["changeProfileAvatar"],
  },
) {
  return useMutation<
    void,
    AxiosError<FullAPiResponse, unknown>,
    FormData,
    null
  >({
    mutationFn: changeProfileAvatar,
    ...options,
  });
}
