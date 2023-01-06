import { JobListing } from "@gql/generated";
import { Divider } from "@mantine/core";
import JobListingItem from "./JobListing";

type JobListingsProps = {
  jobs: (JobListing | null)[];
};

const JobListings = ({ jobs }: JobListingsProps) => {
  if (jobs && jobs.length === 0) return <>Nothing to show</>;

  return (
    <>
      {jobs?.map(
        (jl, idx) =>
          jl && (
            <div key={jl.id}>
              <JobListingItem data={jl} />
              {idx !== jobs.length - 1 && <Divider />}
            </div>
          )
      )}
    </>
  );
};

export default JobListings;
