import { getCurrentUser } from "@auth/authApi";
import { FullAPiResponse } from "@interfaces/api.resp.types";
import { CurrentUserMutationResponse } from "@interfaces/login.types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export default function useCurrentUser(
  options?: UseQueryOptions<
    AxiosResponse<CurrentUserMutationResponse>,
    AxiosError<FullAPiResponse>
  >
) {
  return useQuery<
    AxiosResponse<CurrentUserMutationResponse>,
    AxiosError<FullAPiResponse>
  >(["currentUser"], getCurrentUser, options);
}
