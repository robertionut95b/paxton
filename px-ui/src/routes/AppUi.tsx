import RequireAuth from "@auth/RequireAuth";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClientApp from "./ClientApp";
import ErrorPage from "./ErrorPage";
import Index from "./IndexPage";
import Login from "./Login";
import Logout from "./Logout";

export default function AppUI() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          {/* Landing section of the app */}
          <Route index element={<Index />} />
        </Route>
        <Route>
          {/* Actual client app, where auth is required */}
          <Route
            path="app"
            element={
              <RequireAuth>
                <ClientApp />
              </RequireAuth>
            }
          />
          <Route
            path="app/logout"
            element={
              <RequireAuth>
                <Logout />
              </RequireAuth>
            }
          />
          <Route path="app/login" element={<Login />} />
          <Route path="app/*" element={<ErrorPage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
