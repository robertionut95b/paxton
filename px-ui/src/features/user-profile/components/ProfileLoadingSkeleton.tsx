import { Divider, Paper, Skeleton, Stack } from "@mantine/core";
import BlocksLoadingSkeleton from "../../../components/ui/spinners/BlocksLoadingSkeleton";

export default function ProfileLoadingSkeleton() {
  return (
    <Stack>
      <Paper shadow="sm" p="md" className="px-profile-loading-skeleton">
        <Paper className="px-profile-intro-skeleton">
          <Skeleton height={240} mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </Paper>
        <Divider mt="md" mb="md" />
        <Paper className="px-profile-resume-skeleton mb-4"></Paper>
      </Paper>
      <BlocksLoadingSkeleton />
    </Stack>
  );
}
