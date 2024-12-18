import { APP_API_PATH } from "@config/Properties";
import {
  ResetPasswordRequestProps,
  SignupUserMutationProps,
} from "@features/auth/types/auth";

import { api } from "@lib/axiosClient";
const AUTH_PATH = "auth";

export const signupUser = async (
  body: SignupUserMutationProps,
): Promise<void> => {
  const { data } = await api.post(`${APP_API_PATH}/${AUTH_PATH}/signup`, {
    ...body,
  });
  return data;
};

export const confirmSignupUser = async (token: string) => {
  const { data } = await api.get(
    `${APP_API_PATH}/${AUTH_PATH}/signup/confirmation?token=` + token,
  );
  return data;
};

export const forgotPassword = async (
  body: ResetPasswordRequestProps,
): Promise<void> => {
  const { data } = await api.post(
    `${APP_API_PATH}/${AUTH_PATH}/forgot-password/request`,
    body,
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
    },
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
    },
  );
  return data;
};

export const downloadApiFile = async (url: string) =>
  api.get<Blob>(url, {
    method: "GET",
    responseType: "blob",
  });
