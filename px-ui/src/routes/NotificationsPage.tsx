import PageFooter from "@components/layout/PageFooter";
import {
  Anchor,
  Grid,
  MediaQuery,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

const NotificationsPage = () => {
  return (
    <Grid columns={24}>
      <Grid.Col span={24} sm={8} md={5}>
        <Paper shadow="xs" p="md">
          <Title order={5} mb="sm">
            Manage notifications
          </Title>
          <Anchor size="sm">Check settings</Anchor>
        </Paper>
      </Grid.Col>
      <Grid.Col span={24} sm={16} md={12}>
        <Paper shadow="xs" p="md">
          <Stack spacing="sm">
            <Title order={5} mb="sm">
              Latest notifications
            </Title>
            <Text size="sm">There are no new notifications</Text>
          </Stack>
        </Paper>
      </Grid.Col>
      <MediaQuery
        smallerThan={"md"}
        styles={{
          display: "none",
        }}
      >
        <Grid.Col md={7}>
          <PageFooter />
        </Grid.Col>
      </MediaQuery>
    </Grid>
  );
};

export default NotificationsPage;
