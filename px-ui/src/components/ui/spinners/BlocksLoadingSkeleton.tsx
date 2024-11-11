import { Paper, Skeleton, Stack } from "@mantine/core";

type BlocksLoadingSkeletonProps = {
  blocksNo?: number;
};

export default function BlocksLoadingSkeleton({
  blocksNo = 3,
}: Readonly<BlocksLoadingSkeletonProps>) {
  const blocks = Array.from(Array(blocksNo).keys());
  return (
    <Stack className="px-loading-skeleton">
      <Paper shadow={"sm"} p="md">
        <Skeleton height={20} />
      </Paper>
      {blocks.map((b) => (
        <Paper key={b} shadow={"sm"} p="md">
          <Skeleton height={120} mb="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </Paper>
      ))}
    </Stack>
  );
}
