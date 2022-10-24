import { registerUser } from "@auth/authApi";
import { RegisterUserMutationProps } from "@interfaces/signup.types";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

export default function useRegisterUser() {
  return useMutation<null, AxiosError, RegisterUserMutationProps, null>(
    (body) => registerUser(body),
    {
      mutationKey: "registerUser",
      onSuccess: () => {
        window.location.href = "/app/login";
      },
    }
  );
}
