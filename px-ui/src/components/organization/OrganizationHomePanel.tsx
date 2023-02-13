import { Stack } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import OrganizationAboutPanel from "./OrganizationAboutPanel";

const OrganizationHomePanel = () => {
  const navigate = useNavigate();
  return (
    <Stack>
      <OrganizationAboutPanel />
    </Stack>
  );
};

export default OrganizationHomePanel;
