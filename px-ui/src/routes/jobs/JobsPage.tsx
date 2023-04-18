import { useAuth } from "@auth/useAuth";
import JobListings from "@components/jobs/JobListings";
import PageFooter from "@components/layout/PageFooter";
import PaginationToolbar from "@components/pagination/PaginationToolbar";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { API_PAGINATION_SIZE } from "@constants/Properties";
import {
  FieldType,
  GetUserProfileQuery,
  Operator,
  SortDirection,
  useGetAllJobListingsQuery,
  useGetOrganizationBySlugNameQuery,
  useGetUserProfileQuery,
} from "@gql/generated";
import { Box, Grid, Paper, Text, Title } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { formatISO } from "date-fns";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import graphqlRequestClient from "../../lib/graphqlRequestClient";
import JobsLeftMenu from "./JobsLeftMenu";

const todayIsoFmt = formatISO(new Date());

export default function JobsPage() {
  const [p, setP] = useState<number>(1);
  const [ps, setPs] = useState<number>(API_PAGINATION_SIZE);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const prevUserProfileQueryData =
    queryClient.getQueryData<GetUserProfileQuery>(
      useGetUserProfileQuery.getKey({ profileSlugUrl: user?.profileSlugUrl })
    );

  const orgParam = searchParams.get("org");
  const upJobId = searchParams.get("jobId");
  const refPage = searchParams.get("ref");
  const jobQuery = searchParams.get("q");
  const cityId =
    searchParams.get("city") ??
    (!refPage && prevUserProfileQueryData?.getUserProfile?.city?.id);

  const { data: organizationData, isInitialLoading: isOrgLoading } =
    useGetOrganizationBySlugNameQuery(
      graphqlRequestClient,
      {
        slugName: orgParam ?? "",
      },
      {
        enabled: !!orgParam,
      }
    );

  const { data: userProfile, isInitialLoading: isProfileLoading } =
    useGetUserProfileQuery(
      graphqlRequestClient,
      {
        profileSlugUrl: user?.profileSlugUrl,
      },
      {
        onSuccess: (data) => {
          if (refPage) return;
          if (data.getUserProfile?.city) {
            const currentSearchParams = searchParams;
            currentSearchParams.set("city", data.getUserProfile.city.id);
            setSearchParams(currentSearchParams);
          }
        },
      }
    );

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
            operator: Operator.LessThanEqual,
          },
          ...(organizationData?.getOrganizationBySlugName
            ? [
                {
                  key: "organization",
                  fieldType: FieldType.Long,
                  value: organizationData?.getOrganizationBySlugName?.id ?? "",
                  operator: Operator.Equal,
                },
              ]
            : []),
          ...(upJobId
            ? [
                {
                  key: "job",
                  fieldType: FieldType.Long,
                  value: upJobId,
                  operator: Operator.Equal,
                },
              ]
            : []),
          ...(cityId
            ? [
                {
                  key: "city",
                  fieldType: FieldType.Long,
                  value: cityId,
                  operator: Operator.Equal,
                },
              ]
            : []),
          ...(jobQuery
            ? [
                {
                  key: "title",
                  fieldType: FieldType.String,
                  value: jobQuery,
                  operator: Operator.Like,
                },
              ]
            : []),
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
        }
      },
      enabled: !isOrgLoading && !isProfileLoading,
    }
  );

  useEffect(() => {
    if (refPage) return;
    if (userProfile?.getUserProfile?.city?.id) {
      const currentSearchParams = searchParams;
      currentSearchParams.set("city", userProfile.getUserProfile.city.id);
      setSearchParams(currentSearchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.getUserProfile?.city?.id, searchParams]);

  const totalPages = data?.getAllJobListings?.totalPages ?? 0;
  const totalElements = data?.getAllJobListings?.totalElements ?? 0;
  const jobs = data?.getAllJobListings?.list || [];

  if (isProfileLoading || jobsLoading) return <ApplicationSpinner />;

  return (
    <Grid className="px-jobs-page">
      <Grid.Col sm={3} span={12}>
        <JobsLeftMenu />
      </Grid.Col>
      <Grid.Col sm={6} span={12}>
        <Paper shadow="sm" p="md" className="px-jobs grid gap-8">
          <ShowIfElse
            if={jobs.length > 0}
            else={
              <Box>
                <Title mb={8} order={4}>
                  No suitable jobs found
                </Title>
                <Text size="sm" align="center">
                  Consider updating your profile to find better job matches or
                  refine the search for more results
                </Text>
              </Box>
            }
          >
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
          </ShowIfElse>
        </Paper>
      </Grid.Col>
      <Grid.Col sm={3} span={12}>
        <PageFooter />
      </Grid.Col>
    </Grid>
  );
}
