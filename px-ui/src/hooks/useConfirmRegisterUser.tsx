import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { confirmRegisterUser } from "../auth/authApi";

export default function useConfirmRegisterUser(
  token: string,
  options?: UseQueryOptions<void, AxiosError>
) {
  return useQuery<void, AxiosError>(
    ["confirmRegisterUser"],
    () => confirmRegisterUser(token),
    options
  );
}
