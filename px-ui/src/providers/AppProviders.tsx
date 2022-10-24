import { createEmotionCache, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import AuthProvider from "@providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "react-query";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchInterval: false,
        retry: 0,
      },
    },
  });

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        fontFamily: "Roboto, sans-serif",
        primaryColor: "violet",
        headings: {
          fontFamily: "Roboto, sans-serif",
        },
      }}
      emotionCache={createEmotionCache({
        key: "mantine",
        prepend: false,
      })}
    >
      <NotificationsProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}
