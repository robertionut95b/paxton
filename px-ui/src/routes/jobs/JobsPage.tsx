import { useAuth } from "@auth/useAuth";
import JobListings from "@components/jobs/JobListings";
import PageFooter from "@components/layout/PageFooter";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { API_PAGINATION_SIZE } from "@constants/Properties";
import {
  FieldType,
  GetUserProfileQuery,
  Operator,
  SortDirection,
  useGetAllJobListingsQuery,
  useGetUserProfileQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Box,
  Button,
  Center,
  Divider,
  Grid,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { formatISO } from "date-fns";
import { useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import JobsLeftMenu from "./JobsLeftMenu";

const todayIsoFmt = formatISO(new Date());

export default function JobsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const prevUserProfileQueryData =
    queryClient.getQueryData<GetUserProfileQuery>(
      useGetUserProfileQuery.getKey({ profileSlugUrl: user?.profileSlugUrl }),
    );

  const refPage = searchParams.get("ref");
  const cityId =
    searchParams.get("city") ??
    (!refPage && prevUserProfileQueryData?.getUserProfile?.city?.id);

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
            currentSearchParams.set(
              "city",
              data.getUserProfile.city.id.toString(),
            );
            setSearchParams(currentSearchParams);
          }
        },
      },
    );

  const { data, isLoading: jobsLoading } = useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        page: 0,
        size: API_PAGINATION_SIZE,
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
          ...(cityId
            ? [
                {
                  key: "city.id",
                  fieldType: FieldType.Long,
                  value: cityId as string,
                  operator: Operator.Equal,
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
              },
            ),
          );
        }
      },
      enabled: !isProfileLoading,
    },
  );

  useEffect(() => {
    if (refPage) return;
    if (userProfile?.getUserProfile?.city?.id) {
      const currentSearchParams = searchParams;
      currentSearchParams.set(
        "city",
        userProfile.getUserProfile.city.id.toString(),
      );
      setSearchParams(currentSearchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.getUserProfile?.city?.id, searchParams]);

  const jobs = data?.getAllJobListings?.list ?? [];

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
            <Divider my="xs" />
            <Center>
              <Button
                variant="light"
                component={NavLink}
                to={
                  cityId
                    ? `/app/jobs/search/?city=${cityId}`
                    : `/app/jobs/search`
                }
              >
                See more jobs
              </Button>
            </Center>
          </ShowIfElse>
        </Paper>
      </Grid.Col>
      <Grid.Col sm={3} span={12}>
        <PageFooter />
      </Grid.Col>
    </Grid>
  );
}
