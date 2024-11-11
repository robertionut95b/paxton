import { GetAllJobListingsQuery } from "@gql/generated";
import { Divider } from "@mantine/core";
import JobListingItem from "./JobListingItem";

type JobListingsListProps = {
  jobs: NonNullable<
    NonNullable<
      NonNullable<GetAllJobListingsQuery["getAllJobListings"]>["list"]
    >
  >;
};

const JobListingsList = ({ jobs }: JobListingsListProps) => {
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
          ),
      )}
    </>
  );
};

export default JobListingsList;
