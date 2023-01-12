import { Job } from "@gql/generated";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { Button, Group, Paper, Text, Title } from "@mantine/core";

export default function JobRelatedAlertSection({
  job,
  location,
  isAlertAllowable = true,
}: {
  job: Job;
  location: string;
  isAlertAllowable: boolean;
}) {
  return (
    <Paper shadow={"xs"} p="md">
      <Title mb={"md"} order={4}>
        Set alert for similar jobs
      </Title>
      <Group position="apart" align={"center"}>
        <Text size="sm">
          {job.name} - {location}
        </Text>
        <Button
          disabled={isAlertAllowable}
          leftIcon={<BellAlertIcon width={16} />}
        >
          Notify me
        </Button>
      </Group>
    </Paper>
  );
}
