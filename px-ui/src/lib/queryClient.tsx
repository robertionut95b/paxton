import {
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { GraphqlApiResponse } from "@interfaces/api.resp.types";
import { showNotification } from "@mantine/notifications";
import { QueryCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchInterval: false,
      retry: (failureCount, error) => {
        const err = error as GraphqlApiResponse;
        return failureCount === 0 && err?.response?.status === 401;
      },
      onError: (err) => {
        if ((err as GraphqlApiResponse).response.errors) {
          const error = err as GraphqlApiResponse;
          if (error.response.errors?.[0].message.includes("does not exist")) {
            showNotification({
              title: "Data fetching error",
              message: "No data could be found",
              autoClose: 5000,
              icon: <ExclamationTriangleIcon width={20} />,
            });
            return;
          }
          if (
            error.response.errors?.[0].message
              .toLowerCase()
              .includes("access is denied")
          ) {
            showNotification({
              title: "Unauthorized access",
              message: "You are not allowed to access this resource",
              autoClose: 5000,
              icon: <ShieldExclamationIcon width={20} />,
            });
            return;
          }
        }
        showNotification({
          title: "Application error",
          message: "Oops, something went wrong!",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      },
    },
    mutations: {
      onError: (err) => {
        if ((err as GraphqlApiResponse).response.errors) {
          const error = err as GraphqlApiResponse;
          if (
            error.response.errors?.[0].message
              .toLowerCase()
              .includes("access is denied")
          ) {
            showNotification({
              title: "Unauthorized access",
              message: "You are not allowed to change this resource",
              autoClose: 5000,
              icon: <ShieldExclamationIcon width={20} />,
            });
          } else
            showNotification({
              title: "Application error",
              message: "Oops, something went wrong!",
              autoClose: 5000,
              icon: <ExclamationTriangleIcon width={20} />,
            });
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data !== undefined) {
        showNotification({
          title: "Unknown error",
          message: "Something went wrong when updating the data",
          autoClose: 5000,
          icon: <ExclamationTriangleIcon width={20} />,
        });
      }
    },
  }),
});
