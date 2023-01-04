import { useAuth } from "@auth/useAuth";
import JobListings from "@components/jobs/JobListings";
import JobsListingsSkeleton from "@components/jobs/JobsListingsSkeleton";
import PaginationToolbar from "@components/pagination/PaginationToolbar";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  FieldType,
  Operator,
  SortDirection,
  useGetAllJobListingsQuery,
  useGetUserProfileQuery,
} from "@gql/generated";
import { Container, Title } from "@mantine/core";
import { formatISO } from "date-fns";
import { useState } from "react";
import graphqlRequestClient from "../../lib/graphqlRequestClient";

export default function JobsPage() {
  const [p, setP] = useState<number>(1);
  const [ps, setPs] = useState<number>(5);
  const todayIsoFmt = formatISO(new Date());

  const { data, isLoading: jobsLoading } = useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        page: p - 1,
        size: ps,
        filters: [
          {
            key: "availableTo",
            fieldType: FieldType.Date,
            value: todayIsoFmt,
            operator: Operator.GreaterThan,
          },
          {
            key: "availableFrom",
            fieldType: FieldType.Date,
            value: todayIsoFmt,
            operator: Operator.LessThan,
          },
        ],
        sorts: [
          {
            direction: SortDirection.Desc,
            key: "createdAt",
          },
        ],
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
        <Title mb={"xs"} order={4}>
          <ShowIfElse
            if={userProfile?.getUserProfile?.city}
            else={"Recommended jobs"}
          >
            Jobs of interest in:{" "}
            {`${userProfile?.getUserProfile?.city?.country.name}, ${userProfile?.getUserProfile?.city?.name}`}
          </ShowIfElse>
        </Title>
        <JobListings jobs={jobs} />
        <div className="px-jobs-pagination">
          <PaginationToolbar
            page={p}
            setPage={setP}
            pageSize={ps}
            setPageSize={setPs}
            totalElements={totalElements}
            totalPages={totalPages}
          />
        </div>
      </Container>
    </div>
  );
}
