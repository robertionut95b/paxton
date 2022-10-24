import { LoginUserMutationProps } from "@interfaces/login.types";
import { RegisterUserMutationProps } from "@interfaces/signup.types";
import { api, apiRefresh } from "@lib/axiosClient";

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
  const { data } = await apiRefresh.post("/api/v1/users/currentUser", null);
  return data;
};

export const refreshLogin = async () => {
  const { data } = await api.post("/auth/refreshtoken", null);
  return data;
};

export const registerUser = async (body: RegisterUserMutationProps) => {
  const { data } = await api.post("/auth/signup", {
    ...body,
  });
  return data;
};

export const confirmRegisterUser = async (token: string) => {
  const { data } = await api.get("/auth/signup/confirmation?token=" + token);
  return data;
};

export const forgotPassword = async (body: { email: string }) => {
  const { data } = await api.post("/auth/forgot-password/request", body);
  return data;
};

export const resetPassword = async (
  body: { newPassword: string; confirmPassword: string },
  token: string
) => {
  const { data } = await api.post("/auth/forgot-password?token=" + token, body);
  return data;
};
