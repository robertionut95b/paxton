import { APP_API_PATH } from "@constants/Properties";
import {
  LoginUserByTokenMutationProps,
  LoginUserMutationProps,
  LoginUserMutationResponseP,
} from "@interfaces/login.types";
import {
  ResetPasswordProps,
  ResetPasswordRequestProps,
} from "@interfaces/reset-password.types";
import { RegisterUserMutationProps } from "@interfaces/signup.types";
import { api } from "@lib/axiosClient";
import { AxiosResponse } from "axios";
const AUTH_PATH = "auth";

export const logoutUser = async (): Promise<void> => {
  const { data } = await api.post(`${APP_API_PATH}/users/logout`, null);
  return data;
};

export const submitLogin = async (
  body: LoginUserMutationProps
): Promise<LoginUserMutationResponseP> => {
  const { data } = await api.post(`${APP_API_PATH}/${AUTH_PATH}/login`, {
    ...body,
  });
  return data;
};

export const submitLoginByToken = async (
  body: LoginUserByTokenMutationProps
): Promise<LoginUserMutationResponseP> => {
  const { data } = await api.post(`${APP_API_PATH}/${AUTH_PATH}/login/token`, {
    ...body,
  });
  return data;
};

export const getCurrentUser = async () => {
  const resp = await api.post(`${APP_API_PATH}/users/current`, null);
  return resp;
};

export const refreshLogin = async (): Promise<
  AxiosResponse<LoginUserMutationResponseP>
> => {
  const resp = await api.post(`${APP_API_PATH}/${AUTH_PATH}/refreshtoken`);
  return resp;
};

export const registerUser = async (
  body: RegisterUserMutationProps
): Promise<void> => {
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

export const forgotPassword = async (
  body: ResetPasswordRequestProps
): Promise<void> => {
  const { data } = await api.post(
    `${APP_API_PATH}/${AUTH_PATH}/forgot-password/request`,
    body
  );
  return data;
};

export const resetPassword = async (bodyData: ResetPasswordProps) => {
  const { token, body } = bodyData;
  const { data } = await api.post(
    `${APP_API_PATH}/${AUTH_PATH}/forgot-password?token=` + token,
    body
  );
  return data;
};

export const changeProfileCover = async (bodyData: FormData) => {
  const userId = bodyData.get("userId");
  const { data } = await api.post(
    `${APP_API_PATH}/users/${userId?.toString()}/upload/banner`,
    bodyData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const changeProfileAvatar = async (bodyData: FormData) => {
  const userId = bodyData.get("userId");
  const { data } = await api.post(
    `${APP_API_PATH}/users/${userId?.toString()}/upload/avatar`,
    bodyData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const downloadApiFile = async (url: string) =>
  api.get<Blob>(url, {
    method: "GET",
    responseType: "blob",
  });
