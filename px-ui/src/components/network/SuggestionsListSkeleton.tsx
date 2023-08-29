import { Group, Skeleton } from "@mantine/core";

const SuggestionsListSkeleton = () => {
  const skeletonCards = Array.from(Array(8).keys()).map((i) => (
    <Skeleton key={i} w={180} h={200} radius="md" />
  ));
  return <Group position="center">{skeletonCards}</Group>;
};

export default SuggestionsListSkeleton;
