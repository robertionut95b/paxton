const getDefaultUrl = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:8080";
  } else {
    return `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ""
    }`;
  }
};

export const VITE_REACT_APP_SERVER_BASE_URL =
  import.meta.env.VITE_REACT_APP_SERVER_BASE_URL ?? getDefaultUrl();
