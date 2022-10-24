import { createEmotionCache, MantineProvider } from "@mantine/core";
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
        fontFamily: "Barlow, sans-serif",
      }}
      emotionCache={createEmotionCache({
        key: "mantine",
        prepend: false,
      })}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}
