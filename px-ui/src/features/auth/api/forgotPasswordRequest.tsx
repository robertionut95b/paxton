import { forgotPassword } from "@features/auth/api/authApi";
import { ResetPasswordRequestProps } from "@features/auth/types/auth";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { FullAPiResponse } from "@interfaces/api";
import { showNotification } from "@mantine/notifications";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useForgotPasswordRequestMutation = (
  options: UseMutationOptions<
    void,
    AxiosError<FullAPiResponse, unknown>,
    ResetPasswordRequestProps,
    null
  > = {
    mutationKey: ["forgotPasswordRequest"],
  },
) => {
  return useMutation<
    void,
    AxiosError<FullAPiResponse, unknown>,
    ResetPasswordRequestProps,
    null
  >({
    mutationFn: forgotPassword,
    ...options,
  });
};

export const useForgotPasswordRequest = () =>
  useForgotPasswordRequestMutation({
    onSuccess: () => {
      showNotification({
        title: "An email was sent",
        message:
          "Please check your inbox and follow the instructions from our message",
        autoClose: 5000,
        icon: <EnvelopeIcon width={20} />,
      });
    },
    onError: (err) => {
      if (err?.response?.status === 404) {
        showNotification({
          title: "E-mail was not found",
          message: "We cannot find the required e-mail address",
          autoClose: 5000,
          icon: <EnvelopeIcon width={20} />,
        });
      } else if (
        err?.response?.status === 400 &&
        err?.response?.data?.message ===
          "Valid token already exists for this user"
      ) {
        showNotification({
          title: "An e-mail was sent already",
          message: "Please check your inbox, an e-mail was sent already to you",
          autoClose: 5000,
          icon: <EnvelopeIcon width={20} />,
        });
      }
    },
  });
