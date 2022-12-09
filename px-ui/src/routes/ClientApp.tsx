import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import NavBar, { LinkItem } from "@components/navigation/NavBar";
import { useGetUserProfileQuery } from "@gql/generated";
import {
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  NewspaperIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Container } from "@mantine/core";
import { Outlet } from "react-router-dom";

export default function ClientApp() {
  const { user } = useAuth();
  const { data: profileData } = useGetUserProfileQuery(graphqlRequestClient, {
    profileSlugUrl: user?.profileSlugUrl ?? user?.profileSlugUrl,
  });
  const permissions = user?.permissions || [];

  const editorLinks: LinkItem[] = [
    { label: "Jobs", link: "/app/jobs", icon: <BriefcaseIcon width={16} /> },
    {
      label: "Network",
      link: "/app/network",
      icon: <UsersIcon width={16} />,
    },
    {
      label: "Recruit",
      link: "/app/recruitment",
      icon: <ClipboardDocumentCheckIcon width={16} />,
    },
  ];

  const userLinks = [
    { label: "Jobs", link: "/app/jobs", icon: <BriefcaseIcon width={16} /> },
    {
      label: "Application",
      link: "/app/candidature",
      icon: <NewspaperIcon width={16} />,
    },
  ];

  return (
    <>
      <NavBar
        links={
          permissions.includes(RoleType.ROLE_RECRUITER)
            ? editorLinks
            : userLinks
        }
        user={user}
        profileLink={profileData?.getUserProfile?.profileSlugUrl}
      />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
