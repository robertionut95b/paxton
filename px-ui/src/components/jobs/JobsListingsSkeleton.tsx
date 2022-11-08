import { Divider, Skeleton } from "@mantine/core";

export default function JobsListingsSkeleton({
  cardsNo = 5,
}: {
  cardsNo?: number;
}) {
  const cards = Array.from(Array(cardsNo).keys());
  return (
    <div className="px-loading-skeleton">
      <div className="px-loading-skeleton-heading">
        <Skeleton height={30} mb="sm" width="25%" />
        <Skeleton height={15} mb="lg" width="15%" />
      </div>
      <Divider mb="md" />
      {cards.map(() => (
        <>
          <div className="px-skeleton-logo">
            <Skeleton height={40} mb="lg" width="5%" />
          </div>
          <div className="px-skeleton-rows ml-16">
            <Skeleton height={6} width="30%" radius="xl" />
            <Skeleton height={6} width="10%" radius="xl" mt={6} />
            <Skeleton height={6} width="90%" radius="xl" mt={6} />
            <Skeleton height={6} width="10%" radius="xl" mt={6} mb={12} />
          </div>
        </>
      ))}
    </div>
  );
}
