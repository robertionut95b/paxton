import { useMutation } from "react-query";

interface LoginUserMutationProps {
  username: string;
  password: string;
}

const useLoginUser = () => {
  const signIn = (body: LoginUserMutationProps) =>
    useMutation(async () => {
      const resp = await fetch("/auth/token", {
        method: "post",
        body: JSON.stringify(body),
      });
      const respJson = await resp.json();
      return respJson;
    }).mutate({ ...body });

  return { signIn };
};

export default useLoginUser;
