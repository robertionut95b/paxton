import { useAuth } from "@auth/useAuth";
import JobListingItem from "@components/jobs/JobListing";
import JobsListingsSkeleton from "@components/jobs/JobsListingsSkeleton";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  useGetAllJobListingsQuery,
  useGetUserProfileQuery,
} from "@gql/generated";
import {
  Container,
  Divider,
  Pagination,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import graphqlRequestClient from "../../lib/graphqlRequestClient";

export default function JobsPage() {
  const [p, setP] = useState<number>(1);
  const [ps, setPs] = useState<number>(5);
  const { data, isLoading: jobsLoading } = useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        page: p - 1,
        size: ps,
      },
    },
    {
      queryKey: [`jobsListing${p}&${ps}`],
      keepPreviousData: true,
      staleTime: 1000 * 60,
    }
  );

  const totalPages = data?.getAllJobListings?.totalPages ?? 0;
  const totalElements = data?.getAllJobListings?.totalElements ?? 0;
  const jobs = data?.getAllJobListings?.list || [];

  const { user } = useAuth();

  const { data: userProfile, isLoading } = useGetUserProfileQuery(
    graphqlRequestClient,
    {
      profileSlugUrl: user?.profileSlugUrl,
    }
  );

  if (isLoading || jobsLoading) return <JobsListingsSkeleton />;

  if (jobs.length === 0) {
    return (
      <Container className="px-container-wrapper">
        <Title mb={8} order={4}>
          No suitable jobs found
        </Title>
        <p>You should consider updating your profile</p>
      </Container>
    );
  }

  return (
    <div className="px-jobs grid gap-8">
      <Container className="px-container-wrapper">
        <Title mb={2} order={4}>
          <ShowIfElse
            if={userProfile?.getUserProfile?.city}
            else={"Recommended jobs"}
          >
            Jobs of interest in:{" "}
            {`${userProfile?.getUserProfile?.city?.country.name}, ${userProfile?.getUserProfile?.city?.name}`}
          </ShowIfElse>
        </Title>
        <Text mb={10} color="dimmed" size={13}>
          {totalElements} results
        </Text>
        <Divider />
        {jobs.map(
          (jl, idx) =>
            jl && (
              <div key={jl.id}>
                <JobListingItem data={jl} />
                {idx !== jobs.length - 1 && <Divider />}
              </div>
            )
        )}
        <div className="px-jobs-pagination flex justify-between items-center mt-4">
          <Select
            data={[
              { value: "5", label: "5" },
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "50", label: "50" },
            ]}
            styles={{
              root: {
                display: "flex",
                alignItems: "center",
              },
              label: {
                marginRight: "10px",
              },
              input: {
                width: "5rem",
              },
            }}
            label="Page size"
            defaultValue={ps.toString()}
            value={ps.toString()}
            onChange={(v) => {
              setPs(parseInt(v ?? "10"));
              setP(1);
            }}
          />
          <Pagination
            total={totalPages}
            page={p}
            onChange={setP}
            initialPage={0}
            position="right"
            grow
          />
        </div>
      </Container>
    </div>
  );
}
