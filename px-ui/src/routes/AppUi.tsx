import RequireAuth from "@auth/RequireAuth";
import RequireNonAuth from "@auth/RequireNonAuth";
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
const SignUp = lazy(() => import("./SignUp"));
const RecruitmentPage = lazy(() => import("./user/RecruitmentPage"));
const UserProfile = lazy(() => import("./user/UserProfile"));
const OrganizationPostJobForm = lazy(
  () => import("./organization/OrganizationPostJobForm")
);
const OrganizationPage = lazy(() => import("./organization/OrganizationPage"));
const OrganizationDetailsPage = lazy(
  () => import("./organization/OrganizationDetailsPage")
);
const MyOrganizationPage = lazy(() => import("./organization/MyOrganization"));
const NotFoundPage = lazy(() => import("./NotFoundPage"));

export default function AppUI() {
  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          {/* Landing section of the app */}
          <Route index element={<Index />} errorElement={<ErrorPage />} />
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
            <Route index element={<FeedPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route
              path="candidature"
              element={
                <RequirePermission permission={RoleType.ROLE_VIEWER}>
                  <></>
                </RequirePermission>
              }
            />
            <Route path="up/:profileSlug/" element={<UserProfile />}>
              <Route path="update/banner" element={<ProfileBannerModal />} />
              <Route path="update/avatar" element={<ProfileAvatarModal />} />
              <Route
                path="update/intro"
                element={<BasicUpdateProfileModal />}
              />
              <Route
                path="experiences/new"
                element={<ProfileExperienceModal />}
              />
              <Route
                path="experiences/:experienceId/update"
                element={<ProfileExperienceModal />}
              />
              <Route path="studies/new" element={<ProfileStudyModal />} />
              <Route
                path="studies/:studyId/update"
                element={<ProfileStudyModal />}
              />
            </Route>
            <Route path="network" element={<NetworkPage />}></Route>
            <Route
              path="recruitment"
              element={
                <RequirePermission permission={RoleType.ROLE_RECRUITER}>
                  <RecruitmentPage />
                </RequirePermission>
              }
            />
            <Route path="my-organization" element={<MyOrganizationPage />} />
            <Route
              path="organizations/:organizationId"
              element={<OrganizationPage />}
            >
              <Route path="details" element={<OrganizationDetailsPage />} />
              <Route
                path="jobs/publish-job/form"
                element={
                  <RequirePermission permission={RoleType.ROLE_RECRUITER}>
                    <OrganizationPostJobForm />
                  </RequirePermission>
                }
              />
              <Route
                path="jobs/publish-job/form/:jobListingId/update"
                element={
                  <RequirePermission permission={RoleType.ROLE_RECRUITER}>
                    <OrganizationPostJobForm />
                  </RequirePermission>
                }
              />
            </Route>
            <Route path="access-denied" element={<AccessDenied />} />
            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route
            path="login"
            element={
              <RequireNonAuth>
                <Login />
              </RequireNonAuth>
            }
          />
          <Route
            path="signup"
            element={
              <RequireNonAuth>
                <SignUp />
              </RequireNonAuth>
            }
          />
          <Route
            path="forgot-password/request"
            element={
              <RequireNonAuth>
                <ForgotPassword />
              </RequireNonAuth>
            }
          />
          <Route
            path="forgot-password/reset"
            element={
              <RequireNonAuth>
                <ForgotPasswordReset />
              </RequireNonAuth>
            }
          />
          <Route
            path="signup/confirmation"
            element={
              <RequireNonAuth>
                <ConfirmUserRegister />
              </RequireNonAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
