import { Routes } from "@app/routes";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import { confirmSignupUser } from "./authApi";

const useConfirmSignupUserMutation = (
  token: string,
  options?: UseQueryOptions<void, AxiosError>,
) => {
  return useQuery<void, AxiosError>({
    queryKey: ["confirmSignupUser", token],
    queryFn: () => confirmSignupUser(token),
    ...options,
  });
};

export const useConfirmSignupUser = (
  token: string,
  navigate: NavigateFunction,
) =>
  useConfirmSignupUserMutation(token, {
    onSuccess: () => {
      navigate(Routes.Login.path, { replace: true });
    },
    suspense: true,
  });
