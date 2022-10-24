import { LoginUserMutationProps } from "@interfaces/login.types";
import api from "@lib/axiosClient";

export const logoutUser = async () => {
  const { data } = await api.post("/auth/logout", null);
  return data;
};

export const submitLogin = async (body: LoginUserMutationProps) => {
  const { data } = await api.post("/auth/login", {
    ...body,
  });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.post("/api/v1/users/currentUser", null);
  return data;
};

export const refreshLogin = async () => {
  const { data } = await api.post("/auth/refreshtoken", null);
  return data;
};
