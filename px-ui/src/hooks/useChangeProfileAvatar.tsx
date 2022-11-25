import { changeProfileAvatar } from "@auth/authApi";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useChangeProfileAvatar(
  options: UseMutationOptions<void, AxiosError, FormData, null> = {
    mutationKey: ["changeProfileAvatar"],
  }
) {
  return useMutation<void, AxiosError, FormData, null>(
    changeProfileAvatar,
    options
  );
}
