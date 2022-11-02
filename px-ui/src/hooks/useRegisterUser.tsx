import { registerUser } from "@auth/authApi";
import { RegisterUserMutationProps } from "@interfaces/signup.types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useRegisterUser(
  options: UseMutationOptions<
    void,
    AxiosError,
    RegisterUserMutationProps,
    null
  > = {
    mutationKey: ["registerUser"],
  }
) {
  return useMutation<void, AxiosError, RegisterUserMutationProps, null>(
    registerUser,
    options
  );
}
