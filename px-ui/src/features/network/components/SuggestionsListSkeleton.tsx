import { Group, Skeleton } from "@mantine/core";

type SuggestionsListSkeletonProps = {
  cardsNo?: number;
};

const SuggestionsListSkeleton = ({
  cardsNo = 8,
}: SuggestionsListSkeletonProps) => {
  const skeletonCards = Array.from(Array(cardsNo).keys()).map((i) => (
    <Skeleton key={i} w={180} h={200} radius="md" />
  ));
  return <Group position="center">{skeletonCards}</Group>;
};

export default SuggestionsListSkeleton;
