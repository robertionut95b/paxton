import {
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  Title,
} from "@mantine/core";
import { useState } from "react";

const UserJobsPage = () => {
  const [segValue, setSegValue] = useState<string>("applied");
  return (
    <Grid>
      <Grid.Col span={3}>
        <Paper p="md" shadow="xs">
          <Title order={6} mb="sm">
            My items
          </Title>
          <Button fullWidth variant="light">
            Jobs
          </Button>
        </Paper>
      </Grid.Col>
      <Grid.Col span={6}>
        <Paper p="md" shadow="xs">
          <Title order={4} mb="xs" weight="normal">
            Your jobs
          </Title>
          <Group mb="sm">
            <SegmentedControl
              fullWidth
              size="sm"
              color="violet"
              value={segValue}
              onChange={setSegValue}
              data={[
                { label: "Saved", value: "saved", disabled: true },
                { label: "Applied", value: "applied" },
                { label: "Archived", value: "archived" },
              ]}
            />
          </Group>
          <Divider />
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default UserJobsPage;
