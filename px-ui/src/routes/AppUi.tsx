import RequireAuth from "@auth/RequireAuth";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClientApp from "./ClientApp";
import ConfirmUserRegister from "./ConfirmUserRegister";
import ErrorPage from "./ErrorPage";
import FeedPage from "./feed/FeedPage";
import ForgotPassword from "./ForgotPassword";
import ForgotPasswordReset from "./ForgotPasswordReset";
import Index from "./IndexPage";
import JobsPage from "./jobs/JobsPage";
import Login from "./Login";
import Logout from "./Logout";
import SignUp from "./SignUp";

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
          >
            <Route
              path="/app/feed"
              element={
                <RequireAuth>
                  <FeedPage />
                </RequireAuth>
              }
            />
            <Route
              path="/app/jobs"
              element={
                <RequireAuth>
                  <JobsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/app/*"
              errorElement={
                <RequireAuth>
                  <ErrorPage />
                </RequireAuth>
              }
            />
          </Route>
          <Route
            path="app/logout"
            element={
              <RequireAuth>
                <Logout />
              </RequireAuth>
            }
          />
          <Route path="app/login" element={<Login />} />
          <Route path="app/signup" element={<SignUp />} />
          <Route
            path="app/forgot-password/request"
            element={<ForgotPassword />}
          />
          <Route
            path="app/forgot-password/reset"
            element={<ForgotPasswordReset />}
          />
          <Route
            path="app/signup/confirmation"
            element={<ConfirmUserRegister />}
          />
        </Route>
        <Route path="*" errorElement={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
