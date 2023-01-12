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
import { Paper, Text, Title } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { formatISO } from "date-fns";
import { useState } from "react";
import graphqlRequestClient from "../../lib/graphqlRequestClient";

export default function JobsPage() {
  const [p, setP] = useState<number>(1);
  const [ps, setPs] = useState<number>(5);
  const todayIsoFmt = formatISO(new Date());
  const queryClient = useQueryClient();

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
            operator: Operator.GreaterThanEqual,
          },
          {
            key: "availableFrom",
            fieldType: FieldType.Date,
            value: todayIsoFmt,
            operator: Operator.LessThanEqual,
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
      onSuccess: (data) => {
        if (data) {
          data.getAllJobListings?.list?.forEach((jl) =>
            queryClient.setQueryData(
              [
                "GetAllJobListings",
                {
                  searchQuery: {
                    filters: [
                      {
                        key: "id",
                        fieldType: FieldType.Long,
                        operator: Operator.Equal,
                        value: jl?.id.toString() as string,
                      },
                    ],
                  },
                },
              ],
              {
                getAllJobListings: {
                  list: [jl],
                },
                page: 0,
                totalElements: 1,
                totalPages: 1,
              }
            )
          );
          const org = data?.getAllJobListings?.list?.[0]?.organization;
          queryClient.setQueryData(
            ["GetOrganizationById", { organizationId: org?.id }],
            {
              getOrganizationById: org,
            }
          );
        }
      },
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
      <Paper shadow="sm" p="md">
        <Title mb={8} order={4}>
          No suitable jobs found
        </Title>
        <Text>You should consider updating your profile</Text>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" p="md" className="px-jobs grid gap-8">
      <Title mb={"xs"} order={4}>
        <ShowIfElse
          if={userProfile?.getUserProfile?.city}
          else={"Recommended jobs"}
        >
          Jobs of interest in:{" "}
          {`${userProfile?.getUserProfile?.city?.country.name}, ${userProfile?.getUserProfile?.city?.name}`}
        </ShowIfElse>
      </Title>
      {/* @ts-expect-error("types-check") */}
      <JobListings jobs={jobs} />
      <Paper className="px-jobs-pagination">
        <PaginationToolbar
          page={p}
          setPage={setP}
          pageSize={ps}
          setPageSize={setPs}
          totalElements={totalElements}
          totalPages={totalPages}
        />
      </Paper>
    </Paper>
  );
}
