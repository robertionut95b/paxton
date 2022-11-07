import { getCurrentUser } from "@auth/authApi";
import { FullAPiResponse } from "@interfaces/api.resp.types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useCurrentUser<User>(
  options?: UseQueryOptions<User, AxiosError<FullAPiResponse>>
) {
  return useQuery<User, AxiosError<FullAPiResponse>>(
    ["currentUser"],
    getCurrentUser,
    options
  );
}
