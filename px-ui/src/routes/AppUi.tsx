import RequireAuth from "@auth/RequireAuth";
import { RequirePermission } from "@auth/RequirePermission";
import BasicUpdateProfileModal from "@components/user-profile/BasicUpdateProfileModal";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AccessDenied from "./AccessDenied";
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
import UserProfile from "./user/UserProfile";

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
              path="/app/candidature"
              element={
                <RequireAuth>
                  <RequirePermission permission={"ROLE_VIEWER"}>
                    <JobsPage />
                  </RequirePermission>
                </RequireAuth>
              }
            />
            <Route
              path="/app/profile"
              element={
                <RequireAuth>
                  <UserProfile />
                </RequireAuth>
              }
            >
              <Route
                path="/app/profile/update/basic"
                element={
                  <RequireAuth>
                    <BasicUpdateProfileModal />
                  </RequireAuth>
                }
              ></Route>
            </Route>
            <Route
              path="/app/access-denied"
              element={
                <RequireAuth>
                  <AccessDenied />
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
