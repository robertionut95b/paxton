import { APP_API_PATH } from "@constants/Properties";
import { LoginUserMutationProps } from "@interfaces/login.types";
import { RegisterUserMutationProps } from "@interfaces/signup.types";
import { api, apiRefresh } from "@lib/axiosClient";

const AUTH_PATH = "auth";

export const logoutUser = async () => {
  const { data } = await api.post(`${APP_API_PATH}/${AUTH_PATH}/logout`, null);
  return data;
};

export const submitLogin = async (body: LoginUserMutationProps) => {
  const { data } = await api.post(`${APP_API_PATH}/${AUTH_PATH}/login`, {
    ...body,
  });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await apiRefresh.post(
    `${APP_API_PATH}/users/currentUser`,
    null
  );
  return data;
};

export const refreshLogin = async () => {
  const { data } = await api.post(
    `${APP_API_PATH}/${AUTH_PATH}/refreshtoken`,
    null
  );
  return data;
};

export const registerUser = async (body: RegisterUserMutationProps) => {
  const { data } = await api.post(`${APP_API_PATH}/${AUTH_PATH}/signup`, {
    ...body,
  });
  return data;
};

export const confirmRegisterUser = async (token: string) => {
  const { data } = await api.get(
    `${APP_API_PATH}/${AUTH_PATH}/signup/confirmation?token=` + token
  );
  return data;
};

export const forgotPassword = async (body: { email: string }) => {
  const { data } = await api.post(
    `${APP_API_PATH}/${AUTH_PATH}/forgot-password/request`,
    body
  );
  return data;
};

export const resetPassword = async (
  body: { newPassword: string; confirmPassword: string },
  token: string
) => {
  const { data } = await api.post(
    `${APP_API_PATH}/${AUTH_PATH}/forgot-password?token=` + token,
    body
  );
  return data;
};
