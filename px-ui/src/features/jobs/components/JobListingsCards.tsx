import JobListingCard from "@features/jobs/components/JobListingCard";
import { JobsListingsDataProps } from "@features/jobs/types/jobs";
import { SimpleGrid } from "@mantine/core";

type JobListingsCardsProps = {
  jobs: JobsListingsDataProps;
};

const JobListingsCards = ({ jobs }: JobListingsCardsProps) => {
  if (jobs && jobs.length === 0) return null;

  return (
    <SimpleGrid
      cols={4}
      breakpoints={[
        { maxWidth: 992, cols: 3, spacing: "md" },
        { maxWidth: 768, cols: 2, spacing: "sm" },
        { maxWidth: 576, cols: 1, spacing: "sm" },
      ]}
    >
      {jobs?.map(
        (jl) =>
          jl && (
            <div key={jl.id}>
              <JobListingCard job={jl} />
            </div>
          ),
      )}
    </SimpleGrid>
  );
};

export default JobListingsCards;
