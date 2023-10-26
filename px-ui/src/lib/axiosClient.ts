import { refreshLogin } from "@auth/authApi";
import { authStore } from "@auth/authStore";
import {
  setAuthenticationByAccessToken,
  setUserByToken,
} from "@auth/authUtils";
import { APP_API_BASE_URL } from "@constants/Properties";
import { ApiAuthCodes, FullAPiResponse } from "@interfaces/api.resp.types";
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  withCredentials: true,
  baseURL: APP_API_BASE_URL,
});

let access_token: string | null = null;

const resetAuthStateOnErr = () => {
  authStore.setState(() => ({
    isRefreshing: false,
    user: null,
    userLoading: false,
    accessToken: null,
    tokenExpiry: null,
  }));
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers = { ...config.headers } as AxiosHeaders;
  if (access_token) {
    config.headers.set("Authorization", `Bearer ${access_token}`);
  }
  return config;
});

api.interceptors.response.use(
  (resp) => {
    if (resp.data?.access_token) {
      const access_token = resp.data.access_token;
      setAuthenticationByAccessToken(access_token);
      setUserByToken(access_token);
    }
    return resp;
  },
  async (err: AxiosError<FullAPiResponse>) => {
    const config: AxiosRequestConfig & { _retry?: boolean } = err.config ?? {};
    const originalReq: AxiosRequestConfig & { _retry?: boolean } =
      err.config ?? {};
    const notAuthCode =
      err.response?.data.code === ApiAuthCodes["UNAUTHORIZED"].toString();
    if (
      err.response &&
      err.response.status === 401 &&
      !config._retry &&
      notAuthCode
    ) {
      originalReq._retry = true;
      try {
        const resp = await refreshLogin();
        if (resp) {
          access_token = resp.data.access_token;
          setAuthenticationByAccessToken(access_token);
          setUserByToken(access_token);
        }
        return api(originalReq);
      } catch (err) {
        resetAuthStateOnErr();
        return Promise.reject(err);
      }
    }
    resetAuthStateOnErr();
    return Promise.reject(err);
  }
);

export { api };
