import JobListingItem from "@components/jobs/JobListing";
import { useGetAllJobListingsQuery } from "@gql/generated";
import { Divider, Loader, Title } from "@mantine/core";
import graphqlRequestClient from "../../lib/graphqlRequestClient";

export default function JobsPage() {
  const { data, isLoading } = useGetAllJobListingsQuery(graphqlRequestClient);

  if (isLoading) return <Loader size={"xs"} />;

  if (!data?.getAllJobListings && data?.getAllJobListings?.length === 0) {
    return (
      <Title order={6}>
        No suitable jobs found. You should consider updating your profile
      </Title>
    );
  }

  return (
    <>
      <Title mb={20} order={3}>
        Newest jobs in your area
      </Title>
      {(data?.getAllJobListings || []).map(
        (jl) =>
          jl && (
            <div key={jl.id} className="mb-4">
              <div className="pb-4">
                <JobListingItem data={jl} />
              </div>
              <Divider />
            </div>
          )
      )}
    </>
  );
}
