import RoleType from "@auth/RoleType";
import { useAuth } from "@auth/useAuth";
import NavBar, { LinkItem } from "@components/navigation/NavBar";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import { APP_API_BASE_URL } from "@constants/Properties";
import { useGetUserProfileQuery } from "@gql/generated";
import {
  BellIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftEllipsisIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Center, Container, Paper, Skeleton } from "@mantine/core";
import { Suspense } from "react";
import { Else, If, Then } from "react-if";
import { Outlet } from "react-router-dom";

const renderLinksByPermission = (permissions: string[]) => {
  const commonLinks: LinkItem[] = [
    { label: "Jobs", link: "/app/jobs", icon: <BriefcaseIcon width={20} /> },
    {
      label: "Messages",
      link: "/app/inbox/messages",
      icon: <ChatBubbleLeftEllipsisIcon width={20} />,
    },
    {
      label: "Notices",
      link: "/app/notifications",
      icon: <BellIcon width={20} />,
    },
  ];
  const editorLinks: LinkItem[] = [
    {
      label: "Company",
      link: "/app/my-organization",
      icon: <BuildingOfficeIcon width={20} />,
    },
  ];
  const adminLinks: LinkItem[] = [
    {
      label: "Admin",
      link: "/app/admin-panel/",
      icon: <ShieldCheckIcon width={20} />,
    },
  ];

  const profileLinksAllowed = permissions.includes(RoleType.ROLE_RECRUITER)
    ? editorLinks
    : [];
  const adminLinksAllowed = permissions.includes(RoleType.ROLE_ADMINISTRATOR)
    ? adminLinks
    : [];

  return [...profileLinksAllowed, ...adminLinksAllowed, ...commonLinks];
};

export default function ClientApp() {
  const { user } = useAuth();
  const { data: profileData, isLoading } = useGetUserProfileQuery(
    graphqlRequestClient,
    {
      profileSlugUrl: user?.profileSlugUrl ?? user?.profileSlugUrl,
    },
  );
  const permissions = user?.roles ?? [];
  return (
    <div>
      <If condition={isLoading}>
        <Then>
          <Paper p="lg" mb="lg" w="100%">
            <Center>
              <Skeleton width={"58%"} height={12} radius="xl" />
            </Center>
          </Paper>
        </Then>
        <Else>
          <NavBar
            links={renderLinksByPermission(permissions)}
            user={user}
            profileLink={profileData?.getUserProfile?.profileSlugUrl}
            avatarSrc={`${APP_API_BASE_URL}/${profileData?.getUserProfile?.userProfileAvatarImage?.url}`}
          />
        </Else>
      </If>
      <Container pb="lg" size="lg">
        <Suspense fallback={<ApplicationSpinner />}>
          <Outlet />
        </Suspense>
      </Container>
    </div>
  );
}
