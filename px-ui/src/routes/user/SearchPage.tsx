import PageFooter from "@components/layout/PageFooter";
import { Grid, Paper, Stack, Text, Title } from "@mantine/core";

const SearchPage = () => {
  return (
    <Grid>
      <Grid.Col span={3}>
        <Paper p="md" shadow="xs">
          <Text mb={"sm"} size={"xs"}>
            More on this page
          </Text>
          <Stack spacing={"sm"}>
            <Text size="sm">Jobs</Text>
            <Text size="sm">Posts</Text>
            <Text size="sm">People</Text>
            <Text size="sm">Companies</Text>
            <Text size="sm">Events</Text>
          </Stack>
        </Paper>
      </Grid.Col>
      <Grid.Col span={6}>
        <Stack>
          <Paper p="md" shadow="xs">
            <Title mb={"xs"} order={4}>
              Jobs
            </Title>
          </Paper>
          <Paper p="md" shadow="xs">
            <Title mb={"xs"} order={4}>
              Posts
            </Title>
          </Paper>
          <Paper p="md" shadow="xs">
            <Title mb={"xs"} order={4}>
              People
            </Title>
          </Paper>
          <Paper p="md" shadow="xs">
            <Title mb={"xs"} order={4}>
              Companies
            </Title>
          </Paper>
          <Paper p="md" shadow="xs">
            <Title mb={"xs"} order={4}>
              Events
            </Title>
          </Paper>
        </Stack>
      </Grid.Col>
      <Grid.Col span={3}>
        <PageFooter />
      </Grid.Col>
    </Grid>
  );
};

export default SearchPage;
