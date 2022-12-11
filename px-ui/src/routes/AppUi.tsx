import RequireAuth from "@auth/RequireAuth";
import { RequirePermission } from "@auth/RequirePermission";
import RoleType from "@auth/RoleType";
import BasicUpdateProfileModal from "@components/user-profile/BasicUpdateProfileModal";
import ProfileAvatarModal from "@components/user-profile/ProfileAvatarModal";
import ProfileBannerModal from "@components/user-profile/ProfileBannerModal";
import ProfileExperienceModal from "@components/user-profile/ProfileExperienceModal";
import ProfileStudyModal from "@components/user-profile/ProfileStudyModal";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const AccessDenied = lazy(() => import("./AccessDenied"));
const ClientApp = lazy(() => import("./ClientApp"));
const ConfirmUserRegister = lazy(() => import("./ConfirmUserRegister"));
const ErrorPage = lazy(() => import("./ErrorPage"));
const FeedPage = lazy(() => import("./feed/FeedPage"));
const ForgotPassword = lazy(() => import("./ForgotPassword"));
const ForgotPasswordReset = lazy(() => import("./ForgotPasswordReset"));
const Index = lazy(() => import("./IndexPage"));
const JobsPage = lazy(() => import("./jobs/JobsPage"));
const Login = lazy(() => import("./Login"));
const Logout = lazy(() => import("./Logout"));
const NetworkPage = lazy(() => import("./NetworkPage"));
const OrganizationRecruiterDashboard = lazy(
  () => import("./organization/OrganizationRecruiterDashboard")
);
const SignUp = lazy(() => import("./SignUp"));
const RecruitmentPage = lazy(() => import("./user/RecruitmentPage"));
const UserProfile = lazy(() => import("./user/UserProfile"));

export default function AppUI() {
  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route>
            {/* Landing section of the app */}
            <Route index element={<Index />} errorElement={<ErrorPage />} />
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
              errorElement={<ErrorPage />}
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
                    <RequirePermission permission={RoleType.ROLE_VIEWER}>
                      <JobsPage />
                    </RequirePermission>
                  </RequireAuth>
                }
              />
              <Route
                path="/app/up/:profileSlug/"
                element={
                  <RequireAuth>
                    <UserProfile />
                  </RequireAuth>
                }
              >
                <Route
                  path="/app/up/:profileSlug/update/banner"
                  element={
                    <RequireAuth>
                      <ProfileBannerModal />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/app/up/:profileSlug/update/avatar"
                  element={
                    <RequireAuth>
                      <ProfileAvatarModal />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/app/up/:profileSlug/update/intro"
                  element={
                    <RequireAuth>
                      <BasicUpdateProfileModal />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/app/up/:profileSlug/experiences/new"
                  element={
                    <RequireAuth>
                      <ProfileExperienceModal />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/app/up/:profileSlug/experiences/:experienceId/update"
                  element={
                    <RequireAuth>
                      <ProfileExperienceModal />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/app/up/:profileSlug/studies/new"
                  element={
                    <RequireAuth>
                      <ProfileStudyModal />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/app/up/:profileSlug/studies/:studyId/update"
                  element={
                    <RequireAuth>
                      <ProfileStudyModal />
                    </RequireAuth>
                  }
                />
              </Route>
              <Route
                path="/app/network"
                element={
                  <RequireAuth>
                    <NetworkPage />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/app/recruitment"
                element={
                  <RequireAuth>
                    <RequirePermission permission={RoleType.ROLE_RECRUITER}>
                      <RecruitmentPage />
                    </RequirePermission>
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/app/my-organization"
                element={
                  <RequireAuth>
                    <RequirePermission permission={RoleType.ROLE_RECRUITER}>
                      <OrganizationRecruiterDashboard />
                    </RequirePermission>
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="/app/access-denied"
                element={
                  <RequireAuth>
                    <AccessDenied />
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
      </Suspense>
    </BrowserRouter>
  );
}
