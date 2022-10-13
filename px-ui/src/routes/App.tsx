import RequireAuth from "@auth/RequireAuth";
import { createEmotionCache, MantineProvider } from "@mantine/core";
import ClientApp from "@routes/ClientApp";
import ErrorPage from "@routes/ErrorPage";
import Index from "@routes/IndexPage";
import Login from "@routes/Login";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router-dom";

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="px-app">
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
          <Routes>
            <Route>
              {/* Landing section of the app */}
              <Route index element={<Index />} />
            </Route>
            <Route>
              {/* Actual client app, where auth is required */}
              <Route path="app/login" element={<Login />} />
              <Route
                path="app"
                element={
                  <RequireAuth>
                    <ClientApp />
                  </RequireAuth>
                }
              />
              <Route path="app/*" element={<ErrorPage />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </QueryClientProvider>
      </MantineProvider>
    </div>
  );
}

export default App;
