import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8080",
});

api.defaults.headers.common["X-XSRF-TOKEN"] = Cookies.get("XSRF-TOKEN");

// refresh jwt cookie
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401) {
      const relog = null;
      return api.request(error.config);
    }
  }
);

export default api;
