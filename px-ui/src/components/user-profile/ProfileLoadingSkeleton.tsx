import JobsListingsSkeleton from "@components/jobs/JobsListingsSkeleton";
import { Divider, Skeleton } from "@mantine/core";

export default function ProfileLoadingSkeleton() {
  return (
    <div className="px-profile-loading-skeleton">
      <div className="px-profile-intro-skeleton">
        <Skeleton height={240} mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </div>
      <Divider mt="md" mb="md" />
      <div className="px-profile-resume-skeleton mb-4">
        <JobsListingsSkeleton cardsNo={3} />
      </div>
    </div>
  );
}
