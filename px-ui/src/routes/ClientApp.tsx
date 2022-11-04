import { useAuth } from "@auth/useAuth";
import NavBar, { LinkItem } from "@components/navigation/NavBar";
import { BriefcaseIcon, ClipboardDocumentCheckIcon, HomeIcon, NewspaperIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Container } from "@mantine/core";
import { Outlet } from "react-router-dom";

export default function ClientApp() {
  const { user } = useAuth();
  const permissions = user?.permissions || [];

  const editorLinks: LinkItem[] = [
    { label: "Home", link: "/app/feed", icon: <HomeIcon width={16} /> },
    { label: "Jobs", link: "/app/jobs", icon: <BriefcaseIcon width={16} /> },
    { label: "Users", link: "/app/recruitment/users", icon: <UserGroupIcon width={16} /> },
    { label: "Recruitment", link: "/app/recruitment", icon: <ClipboardDocumentCheckIcon width={16} /> },
  ]
  const userLinks =
    [
      { label: "Home", link: "/app/feed", icon: <HomeIcon width={16} /> },
      { label: "Jobs", link: "/app/jobs", icon: <BriefcaseIcon width={16} /> },
      { label: "Application", link: "/app/candidature", icon: <NewspaperIcon width={16} /> },
    ];

  return (
    <>
      <NavBar
        links={permissions.includes("ROLE_ORGANIZATION_RECRUITER") ? editorLinks : userLinks}
      />
      <Container className="p-4 bg-white border rounded-lg border-solid">
        <Outlet />
      </Container>
    </>
  );
}
