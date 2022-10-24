import NavBar from "@components/navigation/NavBar";
import { Outlet } from "react-router-dom";

export default function ClientApp() {
  return (
    <>
      <NavBar links={[{ label: "Jobs", link: "/jobs" }]} />
      <Outlet />
    </>
  );
}
