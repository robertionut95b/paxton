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
import { Grid, List, Paper, Title } from "@mantine/core";
import { NavLink, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <Grid>
      <Grid.Col span={12} sm={3}>
        <Paper shadow="xs" p="md">
          <Title order={5} mb="md">
            Resources
          </Title>
          <List spacing="md" size="sm" center>
            <List.Item icon={<BriefcaseIcon width={20} />}>Jobs</List.Item>
            <List.Item icon={<ClipboardDocumentIcon width={20} />}>
              <NavLink to="collections/job-listings">Job postings</NavLink>
            </List.Item>
            <List.Item icon={<BuildingOfficeIcon width={20} />}>
              <NavLink to="collections/organizations">Organizations</NavLink>
            </List.Item>
            <List.Item icon={<ArrowsRightLeftIcon width={20} />}>
              Processes
            </List.Item>
            <List.Item icon={<ChatBubbleBottomCenterTextIcon width={20} />}>
              Messages
            </List.Item>
            <List.Item icon={<ClipboardDocumentListIcon width={20} />}>
              User applications
            </List.Item>
            <List.Item icon={<UsersIcon width={20} />}>Users & Roles</List.Item>
            <List.Item icon={<Cog6ToothIcon width={20} />}>
              Realm settings
            </List.Item>
            <List.Item icon={<ShieldExclamationIcon width={20} />}>
              Access management
            </List.Item>
          </List>
        </Paper>
      </Grid.Col>
      <Grid.Col span={12} sm={9}>
        <Outlet />
      </Grid.Col>
    </Grid>
  );
};

export default AdminDashboard;
