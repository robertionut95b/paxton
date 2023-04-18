import IsAllowed from "@auth/IsAllowed";
import RequireAuth from "@auth/RequireAuth";
import RequireNonAuth from "@auth/RequireNonAuth";
import RoleType from "@auth/RoleType";
import JobFormModal from "@components/jobs/JobFormModal";
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
const NetworkPage = lazy(() => import("./NetworkPage"));
const SignUp = lazy(() => import("./SignUp"));
const RecruitmentPage = lazy(() => import("./organization/RecruitmentPage"));
const UserProfile = lazy(() => import("./user/UserProfile"));
const OrganizationPostJobForm = lazy(
  () => import("./organization/OrganizationPostJobForm")
);
const OrganizationPage = lazy(() => import("./organization/OrganizationPage"));
const OrganizationSettingsMainPage = lazy(
  () => import("./organization/OrganizationSettingsMainPage")
);
const OrganizationSettingsPage = lazy(
  () => import("./organization/OrganizationSettingsPage")
);
const OrganizationProcessPage = lazy(
  () => import("./organization/OrganizationProcessPage")
);
const OrganizationRecruiterPage = lazy(
  () => import("./organization/OrganizationRecruiterPage")
);
const OrganizationRecruitersPage = lazy(
  () => import("./organization/OrganizationRecruitersPage")
);
const OrganizationRecruiterJobsPage = lazy(
  () => import("./organization/OrganizationRecruiterJobsPage")
);
const OrganizationAboutPanel = lazy(
  () => import("@components/organization/OrganizationAboutPanel")
);
const OrganizationJobsPanel = lazy(
  () => import("@components/organization/OrganizationJobsPanel")
);
const OrganizationHomePanel = lazy(
  () => import("@components/organization/OrganizationHomePanel")
);
const OrganizationModal = lazy(
  () => import("@components/organization/OrganizationModal")
);
const OrganizationRecruitersModal = lazy(
  () => import("@components/organization/OrganizationRecruitersModal")
);
const MyOrganizationPage = lazy(() => import("./organization/MyOrganization"));
const NotFoundPage = lazy(() => import("./NotFoundPage"));
const JobDetailsPage = lazy(() => import("./jobs/JobDetailsPage"));
const RecruitmentApplicationPage = lazy(
  () => import("./organization/RecruitmentApplicationPage")
);
const RecruitmentCandidatesPage = lazy(
  () => import("./organization/RecruitmentCandidatesPage")
);
const AdminPage = lazy(() => import("./AdminPage"));
const AdminJobs = lazy(() => import("../components/admin/AdminJobs"));
const AdminJobListings = lazy(
  () => import("../components/admin/AdminJobListings")
);
const AdminOrganizations = lazy(
  () => import("../components/admin/AdminOrganizations")
);
const NotificationsPage = lazy(() => import("./NotificationsPage"));
const ChatPage = lazy(() => import("./ChatPage"));
const SearchPage = lazy(() => import("./user/SearchPage"));
const UserJobsPage = lazy(() => import("./user/UserJobsPage"));
const NewChatPage = lazy(() => import("./chat/NewChatPage"));
const ChatRoomPage = lazy(() => import("./chat/ChatRoomPage"));

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
            <Route path="jobs">
              <Route index element={<JobsPage />} />
              <Route path={"view/:jobId"} element={<JobDetailsPage />} />
              <Route path={"view/:jobId/applications/:applicationId"}>
                <Route index element={<RecruitmentApplicationPage />} />
              </Route>
            </Route>
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
            <Route path="network" element={<NetworkPage />} />
            <Route path="my-organization" element={<MyOrganizationPage />} />
            <Route
              path="organizations/:organizationSlug"
              element={<OrganizationPage />}
            >
              <Route element={<OrganizationHomePanel />} index />
              <Route path="about" element={<OrganizationAboutPanel />} />
              <Route path="jobs" element={<OrganizationJobsPanel />}>
                <Route
                  path="publish-job/form"
                  element={
                    <IsAllowed roles={[RoleType.ROLE_RECRUITER]}>
                      <OrganizationPostJobForm />
                    </IsAllowed>
                  }
                />
                <Route
                  path="publish-job/form/:jobListingId/update"
                  element={
                    <IsAllowed roles={[RoleType.ROLE_RECRUITER]}>
                      <OrganizationPostJobForm />
                    </IsAllowed>
                  }
                />
              </Route>
              <Route path="notices" element={<></>} />
              <Route path="people" element={<></>} />
              <Route path="more" element={<></>} />
            </Route>
            <Route path="organizations/:organizationSlug/recruitment/jobs">
              <Route
                index
                element={
                  <IsAllowed roles={[RoleType.ROLE_RECRUITER]}>
                    <RecruitmentPage />
                  </IsAllowed>
                }
              />
              <Route path=":jobId">
                <Route
                  index
                  element={
                    <IsAllowed roles={[RoleType.ROLE_RECRUITER]}>
                      <RecruitmentCandidatesPage />
                    </IsAllowed>
                  }
                />
                <Route
                  path="applications/:applicationId"
                  element={
                    <IsAllowed roles={[RoleType.ROLE_RECRUITER]}>
                      <RecruitmentApplicationPage />
                    </IsAllowed>
                  }
                />
              </Route>
            </Route>
            <Route path="organizations/:organizationSlug">
              <Route path="settings" element={<OrganizationSettingsPage />}>
                <Route element={<OrganizationSettingsMainPage />} index />
                <Route path="process" element={<OrganizationProcessPage />} />
                <Route
                  path="recruiters"
                  element={<OrganizationRecruitersPage />}
                >
                  <Route
                    path=":recruiterId"
                    element={<OrganizationRecruiterPage />}
                  />
                </Route>
                <Route
                  path="recruiters/:recruiterId/jobs"
                  element={<OrganizationRecruiterJobsPage />}
                />
                <Route path="update" element={<OrganizationModal />} />
              </Route>
            </Route>
            <Route
              path="admin-panel"
              element={
                <IsAllowed roles={[RoleType.ROLE_ADMINISTRATOR]}>
                  <AdminPage />
                </IsAllowed>
              }
            >
              <Route path="collections">
                <Route path="jobs" element={<AdminJobs />}>
                  <Route path="new" element={<JobFormModal />} />
                  <Route path="update/:jobId" element={<JobFormModal />} />
                </Route>
                <Route
                  path="job-listings"
                  element={<AdminJobListings />}
                ></Route>
                <Route path="organizations" element={<AdminOrganizations />}>
                  <Route path="new" element={<OrganizationModal />} />
                  <Route path=":organizationSlug">
                    <Route path="update" element={<OrganizationModal />} />
                    <Route
                      path="publish"
                      element={<OrganizationPostJobForm />}
                    />
                    <Route
                      path="recruiters"
                      element={<OrganizationRecruitersModal />}
                    />
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path="search" element={<SearchPage />}>
              <Route path="results" element={<></>}>
                <Route path="all" element={<></>} />
              </Route>
            </Route>
            <Route path="my-items">
              <Route path="saved-jobs" element={<UserJobsPage />}></Route>
            </Route>
            <Route path="notifications" element={<NotificationsPage />}></Route>
            <Route path="inbox/messages" element={<ChatPage />}>
              <Route path="chat/new" element={<NewChatPage />} />
              <Route path="chat/:chatId" element={<ChatRoomPage />} />
            </Route>
            <Route path="access-denied" element={<AccessDenied />} />
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
