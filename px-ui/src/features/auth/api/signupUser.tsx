import { Routes } from "@app/routes";
import { signupUser } from "@features/auth/api/authApi";
import { SignupUserMutationProps } from "@features/auth/types/auth";
import { CheckIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { FullAPiResponse } from "@interfaces/api";
import { showNotification } from "@mantine/notifications";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";

const useSignupUser = (
  options: UseMutationOptions<
    void,
    AxiosError<FullAPiResponse, unknown>,
    SignupUserMutationProps,
    null
  > = {
    mutationKey: ["signupUser"],
  },
) => {
  return useMutation<
    void,
    AxiosError<FullAPiResponse, unknown>,
    SignupUserMutationProps,
    null
  >({
    mutationFn: signupUser,
    ...options,
  });
};

export const useSignUpUser = (navigate: NavigateFunction) => {
  return useSignupUser({
    onSuccess: () => {
      showNotification({
        title: "Successfully registered",
        message:
          "Before logging in, please check your e-mail inbox and follow the instructions from our message",
        autoClose: 3000,
        icon: <CheckIcon width={20} />,
      });
      setTimeout(() => {
        navigate(Routes.Login.path, { replace: true });
      }, 3000);
    },
    onError: (err) => {
      const msg =
        err.response?.data.message ??
        "Unknown error encountered, please try again later";
      showNotification({
        title: "Authentication error",
        message: msg,
        autoClose: 5000,
        icon: <LockClosedIcon width={20} />,
      });
    },
  });
};
