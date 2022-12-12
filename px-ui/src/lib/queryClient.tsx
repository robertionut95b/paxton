import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { showNotification } from "@mantine/notifications";
import { QueryCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchInterval: false,
      retry: 0,
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
