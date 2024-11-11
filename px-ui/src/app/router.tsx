import { Routes } from "@app/routes";
import BlocksLoadingSkeleton from "@components/ui/spinners/BlocksLoadingSkeleton";
import DefaultLayoutSkeleton from "@components/ui/spinners/DefaultLayoutSkeleton";
import IsAllowed from "@features/auth/components/IsAllowed";
import NonProtectedRoutes from "@features/auth/components/NonProtectedRoutes";
import ProtectedRoutes from "@features/auth/components/ProtectedRoutes";
import Roles from "@features/auth/types/roles";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

const AppLayout = lazy(() => import("@components/layout/AppLayout"));
const ErrorPage = lazy(() => import("@app/routes/ErrorPage"));
const FeedPage = lazy(() => import("@app/routes/feed/FeedPage"));
const UserProfile = lazy(
  () => import("@app/routes/user-profile/UserProfilePage"),
);
const NotFoundPage = lazy(() => import("@app/routes/NotFoundPage"));
const JobDetailsPage = lazy(() => import("@app/routes/jobs/JobDetailsPage"));
const JobsPage = lazy(() => import("@app/routes/jobs/JobsPage"));
const UserSavedJobsPage = lazy(() => import("@app/routes/user/UserJobsPage"));
const RecruitmentApplicationPage = lazy(
  () => import("@app/routes/job-applications/RecruitmentApplicationPage"),
);
const JobSearchPage = lazy(() => import("@app/routes/jobs/JobSearchPage"));
const ProfileBannerModal = lazy(
  () => import("@app/routes/user-profile/ProfileBannerModal"),
);
const ProfileAvatarModal = lazy(
  () => import("@app/routes/user-profile/ProfileAvatarModal"),
);
const BasicUpdateProfileModal = lazy(
  () => import("@app/routes/user-profile/BasicUpdateProfileModal"),
);
const ProfileExperienceModal = lazy(
  () => import("@app/routes/user-profile/ProfileExperienceModal"),
);
const ProfileStudyModal = lazy(
  () => import("@app/routes/user-profile/ProfileStudyModal"),
);
const ChatPage = lazy(() => import("@app/routes/chat/ChatPage"));
const NewChatPage = lazy(() => import("@app/routes/chat/NewChatPage"));
const ChatRoomPage = lazy(
  () => import("@app/routes/chat/details/ChatRoomPage"),
);
const ChatMessageDetailsImgPreviewPage = lazy(
  () => import("@app/routes/chat/details/message/ChatMessageImagePreviewPage"),
);
const PeopleSearchPage = lazy(
  () => import("@app/routes/users/UsersSearchPage"),
);
const MyOrganizationPage = lazy(
  () => import("@app/routes/organizations/MyOrganizationPage"),
);
const OrganizationDetailsPage = lazy(
  () => import("@app/routes/organizations/OrganizationDetailsPage"),
);
const OrganizationHomePage = lazy(
  () => import("@app/routes/organizations/OrganizationHomePage"),
);
const OrganizationAboutPanel = lazy(
  () => import("@features/organizations/components/OrganizationAboutPanel"),
);
const OrganizationJobsPanel = lazy(
  () => import("@features/organizations/components/OrganizationJobsPanel"),
);
const OrganizationPostJobForm = lazy(
  () => import("@app/routes/organizations/OrganizationPostJobPage"),
);
const OrganizationRecruitmentPage = lazy(
  () => import("@app/routes/job-applications/RecruitmentPage"),
);
const OrganizationRecruitmentCandidatesPage = lazy(
  () => import("@app/routes/job-applications/RecruitmentCandidatesPage"),
);
const OrganizationRecruitmentApplicationPage = lazy(
  () => import("@app/routes/job-applications/RecruitmentApplicationPage"),
);
const OrganizationSettingsPage = lazy(
  () => import("@app/routes/organizations/OrganizationSettingsPage"),
);
const OrganizationSettingsMainPage = lazy(
  () => import("@app/routes/organizations/OrganizationSettingsMainPage"),
);
const OrganizationProcessPage = lazy(
  () => import("@app/routes/organizations/OrganizationProcessPage"),
);
const OrganizationRecruitersPage = lazy(
  () => import("@app/routes/organizations/OrganizationRecruitersPage"),
);
const OrganizationRecruiterDetailsPage = lazy(
  () => import("@app/routes/organizations/OrganizationRecruiterPage"),
);
const OrganizationRecruiterJobsPage = lazy(
  () => import("@app/routes/organizations/OrganizationRecruiterJobsPage"),
);
const OrganizationModalPage = lazy(
  () => import("@features/organizations/components/OrganizationModal"),
);
const LoginPage = lazy(() => import("@app/routes/auth/LoginPage"));
const SignupPage = lazy(() => import("@app/routes/auth/SignUpPage"));
const SignupConfirmationPage = lazy(
  () => import("@app/routes/auth/SignupConfirmPage"),
);
const ForgotPasswordPage = lazy(
  () => import("@app/routes/auth/ForgotPasswordPage"),
);
const ForgotPasswordResetPage = lazy(
  () => import("@app/routes/auth/ForgotPasswordResetPage"),
);
const AdminPage = lazy(() => import("@app/routes/admin/AdminPage"));
const AdminJobsPage = lazy(() => import("@app/routes/admin/AdminJobsPage"));
const AdminJobFormModalPage = lazy(
  () => import("@features/admin/components/JobFormModal"),
);
const AdminJobListingsPage = lazy(
  () => import("@app/routes/admin/AdminJobListingsPage"),
);
const AdminOrganizationsPage = lazy(
  () => import("@app/routes/admin/AdminOrganizationsPage"),
);
const AdminOrganizationRecruitersModalPage = lazy(
  () =>
    import("@features/organizations/components/OrganizationRecruitersModal"),
);
const GlobalSearchPage = lazy(() => import("@app/routes/GlobalSearchPage"));
const NotificationsPage = lazy(
  () => import("@app/routes/notifications/NotificationsPage"),
);
const NetworkPage = lazy(() => import("@app/routes/network/NetworkPage"));
const NetworkMyContactsPage = lazy(
  () => import("@app/routes/network/NetworkMyContactsPage"),
);

const browserRouter = createBrowserRouter([
  {
    path: Routes.Home.path,
    element: <Navigate to={Routes.Feed.path} replace />,
    errorElement: <ErrorPage />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        errorElement: <ErrorPage />,
        element: <AppLayout />,
        children: [
          {
            path: Routes.Feed.path,
            element: (
              <Suspense fallback={<DefaultLayoutSkeleton />}>
                <FeedPage />
              </Suspense>
            ),
          },
          {
            path: Routes.Jobs.path,
            element: (
              <Suspense fallback={<DefaultLayoutSkeleton />}>
                <JobsPage />
              </Suspense>
            ),
            children: [
              {
                path: Routes.Jobs.SavedJobs.path,
                element: <UserSavedJobsPage />,
              },
            ],
          },
          {
            path: Routes.Jobs.View.Details.path,
            element: (
              <Suspense fallback={<BlocksLoadingSkeleton blocksNo={5} />}>
                <JobDetailsPage />
              </Suspense>
            ),
            children: [
              {
                path: Routes.Jobs.View.Details.RecruitmentApplicationDetails
                  .path,
                element: <RecruitmentApplicationPage />,
              },
            ],
          },
          {
            path: Routes.Jobs.Search.path,
            element: <JobSearchPage />,
          },
          {
            path: Routes.UserProfile.path,
            element: <UserProfile />,
            children: [
              {
                path: Routes.UserProfile.UpdateBanner.path,
                element: <ProfileBannerModal />,
              },
              {
                path: Routes.UserProfile.UpdateAvatar.path,
                element: <ProfileAvatarModal />,
              },
              {
                path: Routes.UserProfile.UpdateIntro.path,
                element: <BasicUpdateProfileModal />,
              },
              {
                path: Routes.UserProfile.ExperiencesNew.path,
                element: <ProfileExperienceModal />,
              },
              {
                path: Routes.UserProfile.StudiesNew.path,
                element: <ProfileStudyModal />,
              },
            ],
          },
          {
            path: Routes.ChatInbox.path,
            element: <ChatPage />,
            children: [
              {
                path: Routes.ChatInbox.NewChat.path,
                element: <NewChatPage />,
              },
              {
                path: Routes.ChatInbox.Chat.Details.path,
                element: <ChatRoomPage />,
                children: [
                  {
                    path: Routes.ChatInbox.Chat.Details.Message.Details.path,
                    element: <ChatMessageDetailsImgPreviewPage />,
                  },
                ],
              },
            ],
          },
          {
            path: Routes.MyOrganization.path,
            element: <MyOrganizationPage />,
          },
          {
            path: Routes.Organizations.path,
            children: [
              {
                path: Routes.Organizations.Details.path,
                element: (
                  <Suspense fallback={<DefaultLayoutSkeleton cols={2} />}>
                    <OrganizationDetailsPage />
                  </Suspense>
                ),
                children: [
                  {
                    path: Routes.Organizations.Details.path,
                    element: (
                      <Suspense fallback={<DefaultLayoutSkeleton cols={1} />}>
                        <OrganizationHomePage />
                      </Suspense>
                    ),
                  },
                  {
                    path: Routes.Organizations.Details.About.path,
                    element: (
                      <Suspense fallback={<DefaultLayoutSkeleton cols={1} />}>
                        <OrganizationAboutPanel />
                      </Suspense>
                    ),
                  },
                  {
                    path: Routes.Organizations.Details.Jobs.path,
                    element: (
                      <Suspense fallback={<DefaultLayoutSkeleton cols={1} />}>
                        <OrganizationJobsPanel />
                      </Suspense>
                    ),
                    children: [
                      {
                        path: Routes.Organizations.Details.Jobs.Publish.path,
                        element: (
                          <IsAllowed roles={[Roles.ROLE_RECRUITER]}>
                            <OrganizationPostJobForm />
                          </IsAllowed>
                        ),
                      },
                      {
                        path: Routes.Organizations.Details.Jobs.Update.path,
                        element: (
                          <IsAllowed roles={[Roles.ROLE_RECRUITER]}>
                            <OrganizationPostJobForm />
                          </IsAllowed>
                        ),
                      },
                    ],
                  },
                  {
                    path: Routes.Organizations.Details.Update.path,
                    element: <OrganizationModalPage />,
                  },
                ],
              },
              {
                path: Routes.Organizations.Details.Recruitment.Jobs.path,
                element: (
                  <IsAllowed roles={[Roles.ROLE_RECRUITER]}>
                    <OrganizationRecruitmentPage />
                  </IsAllowed>
                ),
              },
              {
                path: Routes.Organizations.Details.Recruitment.Jobs.Job.path,
                element: (
                  <IsAllowed roles={[Roles.ROLE_RECRUITER]}>
                    <OrganizationRecruitmentCandidatesPage />
                  </IsAllowed>
                ),
              },
              {
                path: Routes.Organizations.Details.Recruitment.Jobs.Job
                  .Applications.Details.path,
                element: (
                  <IsAllowed roles={[Roles.ROLE_RECRUITER]}>
                    <OrganizationRecruitmentApplicationPage />
                  </IsAllowed>
                ),
              },
              {
                path: Routes.Organizations.Details.Settings.path,
                element: <OrganizationSettingsPage />,
                children: [
                  {
                    path: Routes.Organizations.Details.Settings.path,
                    element: <OrganizationSettingsMainPage />,
                  },
                  {
                    path: Routes.Organizations.Details.Settings.Process.path,
                    element: <OrganizationProcessPage />,
                  },
                  {
                    path: Routes.Organizations.Details.Settings.Recruiters.path,
                    element: <OrganizationRecruitersPage />,
                    children: [
                      {
                        path: Routes.Organizations.Details.Settings.Recruiters
                          .Details.path,
                        element: <OrganizationRecruiterDetailsPage />,
                        children: [
                          {
                            path: Routes.Organizations.Details.Settings
                              .Recruiters.Details.Jobs.path,
                            element: <OrganizationRecruiterJobsPage />,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: Routes.Notices.path,
            element: <></>,
          },
          {
            path: Routes.People.path,
            element: <PeopleSearchPage />,
          },
          {
            path: Routes.Admin.path,
            element: <AdminPage />,
            children: [
              {
                path: Routes.Admin.Jobs.path,
                element: <AdminJobsPage />,
                children: [
                  {
                    path: Routes.Admin.Jobs.New.path,
                    element: <AdminJobFormModalPage />,
                  },
                  {
                    path: Routes.Admin.Jobs.Update.path,
                    element: <AdminJobFormModalPage />,
                  },
                ],
              },
              {
                path: Routes.Admin.JobListings.path,
                element: <AdminJobListingsPage />,
              },
              {
                path: Routes.Admin.Organizations.path,
                element: <AdminOrganizationsPage />,
                children: [
                  {
                    path: Routes.Admin.Organizations.New.path,
                    element: <OrganizationModalPage />,
                  },
                  {
                    path: Routes.Admin.Organizations.Details.path,
                    children: [
                      {
                        path: Routes.Admin.Organizations.Details.Publish.path,
                        element: <OrganizationPostJobForm />,
                      },
                      {
                        path: Routes.Admin.Organizations.Details.Update.path,
                        element: <OrganizationModalPage />,
                      },
                      {
                        path: Routes.Admin.Organizations.Details.Recruiters
                          .path,
                        element: <AdminOrganizationRecruitersModalPage />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: Routes.Search.path,
            element: <GlobalSearchPage />,
          },
          {
            path: Routes.Notifications.path,
            element: <NotificationsPage />,
          },
          {
            path: Routes.Network.path,
            element: <NetworkPage />,
          },
          {
            path: Routes.Network.MyContacts.path,
            element: <NetworkMyContactsPage />,
          },
        ],
      },
    ],
  },
  {
    element: <NonProtectedRoutes />,
    children: [
      {
        path: Routes.Login.path,
        element: <LoginPage />,
      },
      {
        path: Routes.SignUp.path,
        element: <SignupPage />,
      },
      {
        path: Routes.ForgotPassRequest.path,
        element: <ForgotPasswordPage />,
      },
      {
        path: Routes.ForgotPassReset.path,
        element: <ForgotPasswordResetPage />,
      },
      {
        path: Routes.SignupConfirmation.path,
        element: <SignupConfirmationPage />,
      },
    ],
  },
  {
    path: Routes.All.path,
    element: <NotFoundPage />,
  },
]);

const RoutesProvider = () => {
  return (
    <Suspense>
      <RouterProvider router={browserRouter} />
    </Suspense>
  );
};

export default RoutesProvider;
