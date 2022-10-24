import NavBar from "@components/navigation/NavBar";
import { Container } from "@mantine/core";
import { Outlet } from "react-router-dom";

export default function ClientApp() {
  return (
    <>
      <NavBar
        links={[
          { label: "Feed", link: "/app/feed" },
          { label: "Jobs", link: "/app/jobs" },
          { label: "My candidature", link: "/app/candidature" },
          { label: "Notifications", link: "/app/notifications" },
        ]}
      />
      <Container className="p-4 bg-white border rounded-lg border-solid">
        <Outlet />
      </Container>
    </>
  );
}
