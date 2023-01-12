import { queryClient } from "@lib/queryClient";
import {
  ColorScheme,
  ColorSchemeProvider,
  createEmotionCache,
  MantineProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import AuthProvider from "@providers/AuthProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { useDarkMode } from "usehooks-ts";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode, toggle } = useDarkMode();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    isDarkMode ? "dark" : "light"
  );

  isDarkMode
    ? document.documentElement.classList.add("dark")
    : document.documentElement.classList.remove("dark");

  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
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
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
