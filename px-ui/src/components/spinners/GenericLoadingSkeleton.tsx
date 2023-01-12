import { Paper, Skeleton, Stack } from "@mantine/core";

export default function GenericLoadingSkeleton() {
  return (
    <Stack className="px-loading-skeleton">
      <Paper shadow={"sm"} p="md">
        <Skeleton height={120} mb="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </Paper>
      <Paper shadow={"sm"} p="md" className="px-skeleton-inner my-4">
        <Skeleton height={120} mb="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </Paper>
    </Stack>
  );
}
