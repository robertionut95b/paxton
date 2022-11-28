import { refreshLogin } from "@auth/authApi";
import { APP_API_BASE_URL } from "@constants/Properties";
import { LoginUserMutationResponseP } from "@interfaces/login.types";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import graphqlRequestClient from "./graphqlRequestClient";

const api = axios.create({
  withCredentials: true,
  baseURL: APP_API_BASE_URL,
});

let access_token: string | null = null;
let refreshing_token: Promise<LoginUserMutationResponseP> | null = null;

api.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers = config.headers ?? {};
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

// refresh jwt cookie
api.interceptors.response.use(
  (resp) => {
    return resp;
  },
  async (err: AxiosError) => {
    const config: AxiosRequestConfig & { _retry?: boolean } = err.config ?? {};
    const originalReq: AxiosRequestConfig & { _retry?: boolean } =
      err.config ?? {};
    if (err.response && err.response.status === 401 && !config._retry) {
      originalReq._retry = true;
      try {
        refreshing_token = refreshing_token ? refreshing_token : refreshLogin();
        const resp = await refreshing_token;
        refreshing_token = null;
        if (resp) {
          access_token = resp.access_token;
          graphqlRequestClient.setHeader(
            "Authorization",
            `Bearer ${access_token}`
          );
        }
        return api(originalReq);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export { api };
