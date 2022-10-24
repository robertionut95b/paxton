import { getCurrentUser } from "@auth/authApi";
import { AxiosError } from "axios";
import { useQuery } from "react-query";

export default function useCurrentUser<T>({
  setUser,
}: {
  setUser: (user: T) => void;
}) {
  return useQuery<T, AxiosError>(["currentUser"], getCurrentUser, {
    staleTime: 1000 * 60 * 15,
    onSuccess: (data) => {
      setUser(data);
    },
  });
}
