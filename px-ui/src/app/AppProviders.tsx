import { ApolloProvider } from "@apollo/client";
import { IS_ENV_PROD } from "@config/Properties";
import AuthProvider from "@features/auth/providers/AuthProvider";
import apolloGqlClient from "@lib/graphqlWsClient";
import { queryClient } from "@lib/queryClient";
import {
  ColorScheme,
  ColorSchemeProvider,
  createEmotionCache,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Provider } from "react-wrap-balancer";
import { useDarkMode } from "usehooks-ts";

export default function AppProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isDarkMode, toggle } = useDarkMode();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    isDarkMode ? "dark" : "light",
  );
  const htmlElement = document.documentElement;
  const rootElement = document.getElementById("root");

  if (isDarkMode) {
    // eslint-disable-next-line react-compiler/react-compiler
    htmlElement.style.backgroundColor = "#25262b";
    if (rootElement) rootElement.style.backgroundColor = "#25262b";
  } else {
    htmlElement.style.backgroundColor = "#f5f5f9";
    if (rootElement) rootElement.style.backgroundColor = "#f5f5f9";
  }

  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value ?? (colorScheme === "dark" ? "light" : "dark"));
    toggle();
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
          fontFamily: "Inter, sans-serif",
          primaryColor: "violet",
          headings: {
            fontFamily: "Inter, sans-serif",
          },
          components: {
            Container: {
              defaultProps: {
                size: "lg",
              },
            },
          },
        }}
        emotionCache={createEmotionCache({
          key: "mantine",
          prepend: false,
        })}
      >
        <NotificationsProvider>
          <QueryClientProvider client={queryClient}>
            <ApolloProvider client={apolloGqlClient}>
              <AuthProvider>
                <ModalsProvider>
                  <Provider>{children}</Provider>
                </ModalsProvider>
              </AuthProvider>
              {!IS_ENV_PROD && <ReactQueryDevtools initialIsOpen={false} />}
            </ApolloProvider>
          </QueryClientProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
