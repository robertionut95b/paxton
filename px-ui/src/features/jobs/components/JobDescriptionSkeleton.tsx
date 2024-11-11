import { Group, Skeleton, Stack } from "@mantine/core";

const JobDescriptionSkeleton = () => {
  return (
    <Stack className="px-loading-skeleton-heading" spacing={"xs"}>
      <Skeleton height={30} mb="sm" width="6%" />
      <Skeleton height={25} width="60%" />
      <Skeleton height={10} mb="lg" width="30%" />
      <Stack spacing={0}>
        {Array.from(Array(5).keys()).map((v) => (
          <Group key={v}>
            <Skeleton height={10} mb="sm" width="3%" />
            <Skeleton height={10} mb="sm" width="30%" />
          </Group>
        ))}
      </Stack>
      <Stack spacing="xs">
        {Array.from(Array(10).keys()).map((v) => (
          <Skeleton key={v} height={15} width="100%" />
        ))}
      </Stack>
      <Stack spacing="xs" mt="lg">
        {Array.from(Array(10).keys()).map((v) => (
          <Skeleton key={v} height={15} width="100%" />
        ))}
      </Stack>
    </Stack>
  );
};

export default JobDescriptionSkeleton;
