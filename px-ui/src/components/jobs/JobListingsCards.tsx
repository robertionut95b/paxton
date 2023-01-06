import { GetRelatedJobListingsQuery } from "@gql/generated";
import { SimpleGrid } from "@mantine/core";
import JobListingCard from "./JobListingCard";

type JobListingsProps = {
  jobs: GetRelatedJobListingsQuery["getRelatedJobListings"];
};

const JobListingsCards = ({ jobs }: JobListingsProps) => {
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
              <JobListingCard data={jl} />
            </div>
          )
      )}
    </SimpleGrid>
  );
};

export default JobListingsCards;
