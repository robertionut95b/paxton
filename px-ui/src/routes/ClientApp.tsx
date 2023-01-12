import RoleType from "@auth/RoleType";
import { useAuth } from "@auth/useAuth";
import NavBar, { LinkItem } from "@components/navigation/NavBar";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { APP_API_BASE_URL } from "@constants/Properties";
import { useGetUserProfileQuery } from "@gql/generated";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Center, Container, Paper, Skeleton } from "@mantine/core";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";

const renderLinksByPermission = (permissions: string[]) => {
  const commonLinks: LinkItem[] = [
    { label: "Jobs", link: "/app/jobs", icon: <BriefcaseIcon width={16} /> },
  ];
  const editorLinks: LinkItem[] = [
    {
      label: "Organization",
      link: "/app/my-organization",
      icon: <BuildingOfficeIcon width={16} />,
    },
    {
      label: "Recruit",
      link: "/app/recruitment",
      icon: <ClipboardDocumentCheckIcon width={16} />,
    },
  ];

  const userLinks = [
    {
      label: "Application",
      link: "/app/candidature",
      icon: <NewspaperIcon width={16} />,
    },
  ];
  const profileLinks = permissions.includes(RoleType.ROLE_RECRUITER)
    ? editorLinks
    : userLinks;

  return [...commonLinks, ...profileLinks];
};

export default function ClientApp() {
  const { user } = useAuth();
  const { isDarkMode } = useDarkMode();
  const { data: profileData, isLoading } = useGetUserProfileQuery(
    graphqlRequestClient,
    {
      profileSlugUrl: user?.profileSlugUrl ?? user?.profileSlugUrl,
    }
  );
  const permissions = user?.permissions || [];
  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#25262B" : "#f9f5f9",
      }}
    >
      <ShowIfElse
        if={isLoading}
        else={
          <NavBar
            links={renderLinksByPermission(permissions)}
            user={user}
            profileLink={profileData?.getUserProfile?.profileSlugUrl}
            avatarSrc={
              profileData?.getUserProfile?.photography &&
              `${APP_API_BASE_URL}/${profileData?.getUserProfile?.photography}`
            }
          />
        }
      >
        <Paper p="lg" mb="lg" w="100%">
          <Center>
            <Skeleton width={"58%"} height={12} radius="xl" />
          </Center>
        </Paper>
      </ShowIfElse>
      <Container pb="xs">
        <Suspense fallback={<GenericLoadingSkeleton />}>
          <Outlet />
        </Suspense>
      </Container>
    </div>
  );
}
