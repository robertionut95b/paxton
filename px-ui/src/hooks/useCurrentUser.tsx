import { getCurrentUser } from "@auth/authApi";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useCurrentUser<User>(
  options?: UseQueryOptions<User, AxiosError>
) {
  return useQuery<User, AxiosError>(["currentUser"], getCurrentUser, options);
}
