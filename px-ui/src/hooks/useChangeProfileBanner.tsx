import { changeProfileCover } from "@auth/authApi";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useChangeProfileBanner(
  options: UseMutationOptions<void, AxiosError, FormData, null> = {
    mutationKey: ["changeProfileBanner"],
  }
) {
  return useMutation<void, AxiosError, FormData, null>(
    changeProfileCover,
    options
  );
}
