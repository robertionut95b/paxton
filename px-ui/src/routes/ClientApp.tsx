import RoleType from "@auth/RoleType";
import { useAuth } from "@auth/useAuth";
import NavBar, { LinkItem } from "@components/navigation/NavBar";
import { useGetUserProfileQuery } from "@gql/generated";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Container } from "@mantine/core";
import { Outlet } from "react-router-dom";

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
  const { data: profileData } = useGetUserProfileQuery(graphqlRequestClient, {
    profileSlugUrl: user?.profileSlugUrl ?? user?.profileSlugUrl,
  });
  const permissions = user?.permissions || [];
  return (
    <>
      <NavBar
        links={renderLinksByPermission(permissions)}
        user={user}
        profileLink={profileData?.getUserProfile?.profileSlugUrl}
      />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
