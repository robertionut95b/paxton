import { Divider, Group, Paper, Skeleton, Stack } from "@mantine/core";

export default function JobsListingsSkeleton({
  cardsNo = 5,
}: {
  cardsNo?: number;
}) {
  const cards = Array.from(Array(cardsNo).keys());
  return (
    <Paper shadow="sm" p="md" className="px-loading-skeleton">
      <Stack className="px-loading-skeleton-heading" spacing={"xs"}>
        <Skeleton height={30} mb="sm" width="25%" />
        <Skeleton height={15} mb="lg" width="15%" />
      </Stack>
      <Divider mb="md" />
      {cards.map((c) => (
        <div key={c}>
          <Group className="px-skeleton-logo">
            <Skeleton height={40} mb="lg" width="5%" />
          </Group>
          <Stack className="px-skeleton-rows" ml={60} spacing={"xs"}>
            <Skeleton height={6} width="30%" radius="xl" />
            <Skeleton height={6} width="10%" radius="xl" mt={6} />
            <Skeleton height={6} width="90%" radius="xl" mt={6} />
            <Skeleton height={6} width="10%" radius="xl" mt={6} mb={12} />
          </Stack>
        </div>
      ))}
    </Paper>
  );
}
