import { AxiosError } from "axios";
import { QueryKey, useQuery, UseQueryOptions } from "react-query";
import { confirmRegisterUser } from "../auth/authApi";

export default function useConfirmRegisterUser<T>(
  token: string,
  options?:
    | Omit<
        UseQueryOptions<T, AxiosError<unknown, any>, T, QueryKey>,
        "queryKey" | "queryFn"
      >
    | undefined
) {
  return useQuery<T, AxiosError>(
    ["confirmRegisterUser"],
    () => confirmRegisterUser(token),
    {
      ...options,
    }
  );
}
