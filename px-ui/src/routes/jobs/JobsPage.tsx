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
      <Title mb={10} order={4}>
        Jobs of interest in [City Name]
      </Title>
      {(data?.getAllJobListings || []).map(
        (jl) =>
          jl && (
            <div key={jl.id}>
              <JobListingItem data={jl} />
              <Divider />
            </div>
          )
      )}
    </>
  );
}
