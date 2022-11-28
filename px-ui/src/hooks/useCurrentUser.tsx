import { getCurrentUser } from "@auth/authApi";
import { FullAPiResponse } from "@interfaces/api.resp.types";
import { CurrentUserMutationResponse } from "@interfaces/login.types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useCurrentUser(
  options?: UseQueryOptions<
    CurrentUserMutationResponse,
    AxiosError<FullAPiResponse>
  >
) {
  return useQuery<CurrentUserMutationResponse, AxiosError<FullAPiResponse>>(
    ["currentUser"],
    getCurrentUser,
    options
  );
}
