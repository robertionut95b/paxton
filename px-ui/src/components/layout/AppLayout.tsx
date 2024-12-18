import { Routes } from "@app/routes";
import NavBar, { LinkItem } from "@components/ui/navigation/NavBar";
import ApplicationSpinner from "@components/ui/spinners/ApplicationSpinner";
import { APP_API_BASE_URL } from "@config/Properties";
import { useAuth } from "@features/auth/hooks/useAuth";
import Roles from "@features/auth/types/roles";
import { getUserFromStorage } from "@features/auth/utils/authUtils";
import { useGetUserProfileQuery } from "@gql/generated";
import {
  BellIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftEllipsisIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Container } from "@mantine/core";
import { QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const renderLinksByPermission = (permissions: string[]) => {
  const commonLinks: LinkItem[] = [
    {
      label: "Jobs",
      link: Routes.Jobs.path,
      icon: <BriefcaseIcon width={20} />,
    },
    {
      label: "Messages",
      link: Routes.ChatInbox.path,
      icon: <ChatBubbleLeftEllipsisIcon width={20} />,
    },
    {
      label: "Notices",
      link: Routes.Notifications.path,
      icon: <BellIcon width={20} />,
    },
  ];
  const editorLinks: LinkItem[] = [
    {
      label: "Company",
      link: Routes.MyOrganization.path,
      icon: <BuildingOfficeIcon width={20} />,
    },
  ];
  const adminLinks: LinkItem[] = [
    {
      label: "Admin",
      link: Routes.Admin.path,
      icon: <ShieldCheckIcon width={20} />,
    },
  ];

  const profileLinksAllowed = permissions.includes(Roles.ROLE_RECRUITER)
    ? editorLinks
    : [];
  const adminLinksAllowed = permissions.includes(Roles.ROLE_ADMINISTRATOR)
    ? adminLinks
    : [];

  return [...profileLinksAllowed, ...adminLinksAllowed, ...commonLinks];
};

export const loader =
  (queryClient: QueryClient) =>
  async (args, user: ReturnType<typeof getUserFromStorage>) => {
    return queryClient.ensureQueryData(
      useGetUserProfileQuery.getKey({
        profileSlugUrl: user?.profile.user_profile,
      }),
      {
        queryFn: useGetUserProfileQuery.fetcher(graphqlRequestClient, {
          profileSlugUrl: user?.profile.user_profile,
        }),
      },
    );
  };

AppLayout.loader = loader;

export default function AppLayout() {
  const { user } = useAuth();
  const { data: profileData } = useGetUserProfileQuery(
    graphqlRequestClient,
    {
      profileSlugUrl: user?.profileSlugUrl ?? "",
    },
    {
      suspense: true,
    },
  );
  const permissions = user?.roles ?? [];

  return (
    <>
      <NavBar
        links={renderLinksByPermission(permissions)}
        user={user}
        profileLink={profileData?.getUserProfile?.profileSlugUrl ?? ""}
        avatarSrc={`${APP_API_BASE_URL}/${profileData?.getUserProfile?.userProfileAvatarImage?.url}`}
      />
      <Container pb="lg" size="lg">
        <Suspense fallback={<ApplicationSpinner />}>
          <Outlet />
        </Suspense>
      </Container>
    </>
  );
}
