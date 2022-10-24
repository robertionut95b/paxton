import { submitLogin } from "@auth/authApi";
import { LoginUserMutationProps } from "@interfaces/login.types";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

export default function useLoginUser<U>() {
  return useMutation<U, AxiosError, LoginUserMutationProps, null>(
    (body) => submitLogin(body),
    {
      mutationKey: "loginUser",
    }
  );
}
