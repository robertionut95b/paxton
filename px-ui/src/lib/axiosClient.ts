import { refreshLogin } from "@auth/authApi";
import { APP_API_BASE_URL } from "@constants/Properties";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  withCredentials: true,
  baseURL: APP_API_BASE_URL,
});

api.defaults.headers.common["X-XSRF-TOKEN"] = Cookies.get("XSRF-TOKEN");

const apiRefresh = axios.create({
  withCredentials: true,
  baseURL: APP_API_BASE_URL,
});
apiRefresh.defaults.headers.common["X-XSRF-TOKEN"] = Cookies.get("XSRF-TOKEN");

// refresh jwt cookie
apiRefresh.interceptors.response.use(
  (resp) => {
    return resp;
  },
  async (err: AxiosError) => {
    const originalReq = err.config;
    if (err.response?.status === 401) {
      // @ts-expect-error("types error")
      originalReq._retry = true;
      await refreshLogin();
      // @ts-expect-error("types error")
      return api(originalReq);
    }
    return Promise.reject(err);
  }
);

export { api, apiRefresh };
