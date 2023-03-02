import {
  BellAlertIcon,
  BookmarkIcon,
  BookmarkSquareIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Anchor, Button, Center, List, Paper, Space } from "@mantine/core";
import { NavLink } from "react-router-dom";

const JobsLeftMenu = () => {
  return (
    <div className="px-jobs-left-menu">
      <Paper shadow="sm" p="lg" className="px-jobs-left-menu">
        <List spacing={"sm"} size="sm">
          <List.Item icon={<BookmarkIcon width={18} />}>
            <Anchor component={NavLink} to="/app/my-items" variant="text">
              My jobs
            </Anchor>
          </List.Item>
          <List.Item icon={<BookmarkSquareIcon width={18} />}>
            <Anchor component={NavLink} to="favorite-jobs" variant="text">
              Bookmarked jobs
            </Anchor>
          </List.Item>
          <List.Item icon={<BellAlertIcon width={18} />}>
            <Anchor component={NavLink} to="my-job-alerts" variant="text">
              Job alerts
            </Anchor>
          </List.Item>
          <List.Item icon={<BookmarkIcon width={18} />}>
            <Anchor
              component={NavLink}
              to="application-settings"
              variant="text"
            >
              Candidature settings
            </Anchor>
          </List.Item>
        </List>
      </Paper>
      <Space h="md" />
      <Center>
        <Button
          leftIcon={<PencilSquareIcon width={16} />}
          component={NavLink}
          to="/app/my-organization"
        >
          Publish a job
        </Button>
      </Center>
    </div>
  );
};

export default JobsLeftMenu;
