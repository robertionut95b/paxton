import { Skeleton } from "@mantine/core";

export default function GenericLoadingSkeleton() {
  return (
    <div className="px-loading-skeleton">
      <div className="px-skeleton px-container-wrapper">
        <Skeleton height={120} mb="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </div>
      <div className="px-skeleton-inner my-4 px-container-wrapper">
        <Skeleton height={120} mb="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </div>
    </div>
  );
}
