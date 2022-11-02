import { queryClient } from "@lib/queryClient";
import { createEmotionCache, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import AuthProvider from "@providers/AuthProvider";
import { QueryClientProvider } from "@tanstack/react-query";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
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
