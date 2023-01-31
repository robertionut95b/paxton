import {
  ArrowsRightLeftIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChatBubbleBottomCenterTextIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ShieldExclamationIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { Paper, Stack, Tabs, TabsValue } from "@mantine/core";
import { useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const navigateTab = useCallback(
    (value: TabsValue) => navigate(`collections/${value}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Stack>
      <Paper shadow="xs" p="md">
        <Tabs defaultValue="jobs" onTabChange={navigateTab} keepMounted={false}>
          <Tabs.List position="center">
            <Tabs.Tab value="jobs" icon={<BriefcaseIcon width={16} />}>
              Jobs
            </Tabs.Tab>
            <Tabs.Tab
              value="job-listings"
              icon={<ClipboardDocumentIcon width={16} />}
            >
              Job postings
            </Tabs.Tab>
            <Tabs.Tab
              value="organizations"
              icon={<BuildingOfficeIcon width={16} />}
            >
              Organizations
            </Tabs.Tab>
            <Tabs.Tab
              value="processes"
              icon={<ArrowsRightLeftIcon width={16} />}
            >
              Processes
            </Tabs.Tab>
            <Tabs.Tab
              value="messages"
              icon={<ChatBubbleBottomCenterTextIcon width={16} />}
            >
              Messages
            </Tabs.Tab>
            <Tabs.Tab
              value="user-applications"
              icon={<ClipboardDocumentListIcon width={16} />}
            >
              User applications
            </Tabs.Tab>
            <Tabs.Tab value="user-roles" icon={<UsersIcon width={16} />}>
              Users & Roles
            </Tabs.Tab>
            <Tabs.Tab value="user-roles" icon={<Cog6ToothIcon width={16} />}>
              Realm settings
            </Tabs.Tab>
            <Tabs.Tab
              value="user-roles"
              icon={<ShieldExclamationIcon width={16} />}
            >
              Access management
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Paper>
      <Outlet />
    </Stack>
  );
};

export default AdminDashboard;
