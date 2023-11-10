import { useAuth } from "@auth/useAuth";
import JobListing from "@components/jobs/JobListing";
import JobDescriptionSkeleton from "@components/jobs/job-page/JobDescriptionSkeleton";
import PaginationToolbar from "@components/pagination/PaginationToolbar";
import ApplicationSpinner from "@components/spinners/ApplicationSpinner";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { API_PAGINATION_SIZE } from "@constants/Properties";
import {
  ContractType,
  FieldType,
  GetAllJobListingsQuery,
  GetUserProfileQuery,
  Operator,
  SortDirection,
  WorkType,
  useGetAllJobListingsQuery,
  useGetAllJobsQuery,
  useGetAllOrganizationsQuery,
  useGetCountriesCitiesQuery,
  useGetUserProfileQuery,
} from "@gql/generated";
import {
  BuildingOfficeIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Divider,
  Drawer,
  Grid,
  Group,
  Image,
  MediaQuery,
  MultiSelect,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { prettyEnumValue } from "@utils/enumUtils";
import { formatISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Balancer from "react-wrap-balancer";
import { useDebounce } from "usehooks-ts";
import JobsSearchDetailsPage from "./JobsSearchDetailsPage";

const todayIsoFmt = formatISO(new Date());

const JobSearchPage = () => {
  const [opened, setOpened] = useState(false);
  const [p, setP] = useState<number>(1);
  const [ps, setPs] = useState<number>(API_PAGINATION_SIZE);
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const prevUserProfileQueryData =
    queryClient.getQueryData<GetUserProfileQuery>(
      useGetUserProfileQuery.getKey({ profileSlugUrl: user?.profileSlugUrl }),
    );

  const currentJobId = searchParams.get("currentJobId");
  const orgParam = searchParams.get("org");
  const upJobId = searchParams.get("jobId");
  const refPage = searchParams.get("ref");
  const jobQuery = searchParams.get("q");
  const cityId =
    searchParams.get("city") ??
    (!refPage && prevUserProfileQueryData?.getUserProfile?.city?.id);
  const workType = searchParams.get("wt");
  const contractType = searchParams.get("ct");

  const [searchQuery, setSearchQuery] = useState(jobQuery ?? "");
  const debouncedQuery = useDebounce(searchQuery, 1500);

  const { data: organizationsData, isInitialLoading: isOrgsLoading } =
    useGetAllOrganizationsQuery(graphqlRequestClient);

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

  const {
    data,
    isInitialLoading: jobsLoading,
    refetch: reloadJobListings,
    isRefetching: jobsIsRefetching,
  } = useGetAllJobListingsQuery(
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
          ...(orgParam
            ? [
                {
                  key: "organization.slugName",
                  fieldType: FieldType.String,
                  values: orgParam.split(",") ?? [],
                  operator: Operator.In,
                },
              ]
            : []),
          ...(upJobId
            ? [
                {
                  key: "job.id",
                  fieldType: FieldType.Long,
                  value: upJobId,
                  operator: Operator.Equal,
                },
              ]
            : []),
          ...(cityId
            ? [
                {
                  key: "city.id",
                  fieldType: FieldType.Long,
                  value: String(cityId),
                  operator: Operator.Equal,
                },
              ]
            : []),
          ...(workType
            ? [
                {
                  key: "workType",
                  fieldType: FieldType.Enum,
                  values: workType.split(",").map((v) => `WorkType;${v}`) ?? [],
                  operator: Operator.In,
                },
              ]
            : []),
          ...(contractType
            ? [
                {
                  key: "contractType",
                  fieldType: FieldType.Enum,
                  values:
                    contractType.split(",").map((v) => `ContractType;${v}`) ??
                    [],
                  operator: Operator.In,
                },
              ]
            : []),
          ...(debouncedQuery
            ? [
                {
                  key: "title",
                  fieldType: FieldType.String,
                  value: debouncedQuery,
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
      keepPreviousData: true,
      staleTime: 1000 * 60,
      enabled: !isProfileLoading,
    },
  );

  const { data: cityData, isInitialLoading: cityIsLoading } =
    useGetCountriesCitiesQuery(graphqlRequestClient);

  const { data: jobsData, isInitialLoading: isJobsLoading } =
    useGetAllJobsQuery(graphqlRequestClient);

  const locations = useMemo(
    () =>
      cityData?.getCountriesCities
        ?.map((c) => {
          const cityId = c?.cities?.map((ci) => String(ci?.id)) ?? [];
          const cityName = c?.cities?.map((ci) => ci?.name) ?? [];
          const locs = cityName.map((ci, idx) => ({
            label: `${c?.name}, ${ci}`,
            value: cityId[idx],
          }));
          return locs;
        })
        .flat(1) ?? [],
    [cityData],
  );

  const organizations = useMemo(
    () =>
      organizationsData?.getAllOrganizations?.map((o) => ({
        value: o?.slugName ?? "",
        label: o?.name ?? "",
      })) ?? [],
    [organizationsData],
  );

  const baseJobs = useMemo(
    () =>
      (jobsData?.getAllJobs ?? [])?.map((j) => ({
        value: String(j?.id) ?? "",
        label: j?.name ?? "",
      })),
    [jobsData],
  );

  const onChangeSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
    onChangeSingleType(e.currentTarget.value, "q");
  };

  const onChangeMultiType = (values: string[], key: string) => {
    const currentSearchParams = searchParams;
    if (values.length === 0) {
      currentSearchParams.delete(key);
      return setSearchParams(currentSearchParams);
    }
    currentSearchParams.set(key, values.join(","));
    setSearchParams(currentSearchParams);
  };

  const onChangeSingleType = (value: string | null, key: string) => {
    const currentSearchParams = searchParams;
    if (!value) {
      currentSearchParams.delete(key);
      return setSearchParams(currentSearchParams);
    }
    currentSearchParams.set(key, value);
    setSearchParams(currentSearchParams);
  };

  const clearAllFilters = () => {
    const currentSearchParams = new URLSearchParams();
    currentSearchParams.set("currentJobId", currentJobId ?? "");
    setSearchQuery("");
    setSearchParams(currentSearchParams);
  };

  useEffect(() => {
    if (data?.getAllJobListings?.list) {
      const firstAvailableJob = data.getAllJobListings.list?.[0];
      if (firstAvailableJob) {
        const currentSearchParams = searchParams;
        currentSearchParams.set(
          "currentJobId",
          firstAvailableJob.id.toString(),
        );
        setSearchParams(currentSearchParams);
      }
      // set query data
      data.getAllJobListings.list.forEach((jl) => {
        queryClient.setQueryData<GetAllJobListingsQuery>(
          useGetAllJobListingsQuery.getKey({
            searchQuery: {
              filters: [
                {
                  fieldType: FieldType.Long,
                  key: "id",
                  operator: Operator.Equal,
                  value: String(jl?.id),
                },
              ],
            },
          }),
          (prev) =>
            prev
              ? {
                  ...prev,
                  getAllJobListings: {
                    ...prev.getAllJobListings,
                    list: [jl],
                    page: prev.getAllJobListings?.page ?? 0,
                    totalElements: prev.getAllJobListings?.totalElements ?? 1,
                    totalPages: prev.getAllJobListings?.totalPages ?? 1,
                  },
                }
              : prev,
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const totalPages = data?.getAllJobListings?.totalPages ?? 0;
  const totalElements = data?.getAllJobListings?.totalElements ?? 0;
  const jobs = data?.getAllJobListings?.list ?? [];

  if (isProfileLoading || jobsLoading || cityIsLoading || isJobsLoading)
    return <ApplicationSpinner />;

  return (
    <Grid className="px-jobs-page">
      <Grid.Col span={12}>
        <Group noWrap spacing={5}>
          <TextInput
            size="xs"
            placeholder="Job title"
            icon={<Cog6ToothIcon width={16} />}
            value={searchQuery ?? undefined}
            onChange={onChangeSearchQuery}
          />
          <Divider orientation="vertical" mx={5} />
          <Select
            size="xs"
            data={[
              { value: "all", label: "All" },
              { value: "jobs", label: "Jobs" },
              { value: "people", label: "People" },
              { value: "notices", label: "Notices" },
              { value: "posts", label: "Posts" },
            ]}
            icon={<DocumentTextIcon width={16} />}
            defaultValue={pathname.includes("jobs/search") ? "jobs" : "all"}
            transition="fade"
            transitionDuration={300}
          />
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Group noWrap spacing={5}>
              <Select
                size="xs"
                placeholder="Location"
                icon={<MapIcon width={16} />}
                searchable
                nothingFound="No record found"
                data={locations}
                value={searchParams.get("city") ?? undefined}
                onChange={(val) => onChangeSingleType(val, "city")}
                transition="fade"
                transitionDuration={300}
              />
              <MultiSelect
                size="xs"
                placeholder="Organization"
                data={organizations}
                searchable
                icon={<BuildingOfficeIcon width={16} />}
                value={orgParam ? orgParam.split(",") : undefined}
                onChange={(val) => onChangeMultiType(val, "org")}
                transition="fade"
                transitionDuration={300}
                disabled={isOrgsLoading}
              />
            </Group>
          </MediaQuery>
          <Button size="xs" variant="filled" onClick={() => setOpened(true)}>
            All filters
          </Button>
          <Divider orientation="vertical" mx={5} />
          <Button size="xs" variant="outline" onClick={clearAllFilters}>
            Reset
          </Button>
        </Group>
      </Grid.Col>
      <Grid.Col sm={5} span={12}>
        <Paper shadow="xs" p="md" className="px-jobs grid gap-8">
          <ShowIfElse
            if={jobs.length > 0}
            else={
              <Stack spacing="xs" align="center">
                <Title order={5}>No suitable jobs found</Title>
                <Text size="sm" align="left" component={Balancer}>
                  Unfortunately we could not find any matches
                </Text>
                <Group spacing="xs">
                  <Button
                    size="xs"
                    variant="filled"
                    onClick={() => reloadJobListings()}
                    loading={jobsIsRefetching}
                  >
                    Reload
                  </Button>
                  <Button size="xs" variant="light" onClick={clearAllFilters}>
                    Reset filters
                  </Button>
                </Group>
              </Stack>
            }
          >
            <Title className="capitalize" mb={"xs"} order={5}>
              <ShowIfElse
                if={userProfile?.getUserProfile?.city}
                else={"Recommended jobs"}
              >
                {jobQuery ? `"${jobQuery}"` : "Jobs"} in:{" "}
                {`${userProfile?.getUserProfile?.city?.country.name}`}
              </ShowIfElse>
            </Title>
            <ScrollArea
              sx={(theme) => ({
                [theme.fn.smallerThan("sm")]: {
                  height: "40vh",
                },
                height: "75vh",
              })}
            >
              {jobs.map(
                (jl, idx) =>
                  jl && (
                    <div
                      className={`cursor-pointer`}
                      key={jl.id}
                      onClick={() => {
                        const currentSearchParams = searchParams;
                        currentSearchParams.set(
                          "currentJobId",
                          jl.id.toString(),
                        );
                        setSearchParams(currentSearchParams);
                      }}
                    >
                      <JobListing
                        navigable={false}
                        data={jl}
                        withDescription={false}
                      />
                      {idx !== jobs.length - 1 && <Divider />}
                    </div>
                  ),
              )}
            </ScrollArea>
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
      <Grid.Col sm={7} span={12}>
        <Paper p="md" shadow="xs">
          <ShowIfElse
            if={(data?.getAllJobListings?.totalElements ?? 0) === 0}
            else={
              <ShowIfElse if={!jobsLoading} else={<JobDescriptionSkeleton />}>
                <ScrollArea h="75vh" pr="xs">
                  <JobsSearchDetailsPage />
                </ScrollArea>
              </ShowIfElse>
            }
          >
            <Stack align="center" spacing="xs">
              <Image width={82} src="/images/bow-tie.svg" alt="bowtie" />
              <Title order={3}>No results found</Title>
              <Text align="center" size="sm" component={Balancer}>
                Your search might be too restrictive, or we do not have that
                specific job. Try to reset the filters.
              </Text>
              <Button variant="subtle" onClick={clearAllFilters}>
                Reset filters
              </Button>
            </Stack>
          </ShowIfElse>
        </Paper>
      </Grid.Col>
      <Drawer
        opened={opened}
        position="right"
        onClose={() => setOpened(false)}
        title="Jobs criteria"
        padding="xl"
        size="lg"
      >
        <Stack>
          <TextInput
            label="Job title"
            placeholder="Job title"
            icon={<Cog6ToothIcon width={16} />}
            value={searchQuery ?? undefined}
            onChange={onChangeSearchQuery}
          />
          <Select
            label="Location"
            placeholder="Location"
            icon={<MapIcon width={16} />}
            searchable
            nothingFound="No record found"
            data={locations}
            value={searchParams.get("city") ?? undefined}
            onChange={(val) => onChangeSingleType(val, "city")}
            transition="fade"
            transitionDuration={300}
          />
          <Select
            label="Job"
            placeholder="Job"
            description="The base qualification of the job"
            icon={<MapIcon width={16} />}
            searchable
            nothingFound="No record found"
            data={baseJobs}
            value={searchParams.get("jobId") ?? undefined}
            onChange={(val) => onChangeSingleType(val, "jobId")}
            transition="fade"
            transitionDuration={300}
          />
          <MultiSelect
            label="Contract type"
            placeholder="Contract type"
            data={Object.values(ContractType).map((ev) => ({
              value: ev.toString(),
              label: prettyEnumValue(ev.toString()),
            }))}
            searchable
            icon={<BuildingOfficeIcon width={16} />}
            value={contractType ? contractType.split(",") : undefined}
            onChange={(val) => onChangeMultiType(val, "ct")}
            transition="fade"
            transitionDuration={300}
          />
          <MultiSelect
            label="Work type"
            placeholder="Work type"
            data={Object.values(WorkType).map((ev) => ({
              value: ev.toString(),
              label: prettyEnumValue(ev.toString()),
            }))}
            searchable
            icon={<BuildingOfficeIcon width={16} />}
            value={workType ? workType.split(",") : undefined}
            onChange={(val) => onChangeMultiType(val, "wt")}
            transition="fade"
            transitionDuration={300}
          />
          <MultiSelect
            label="Organization"
            placeholder="Organization"
            data={organizations}
            searchable
            icon={<BuildingOfficeIcon width={16} />}
            value={orgParam ? orgParam.split(",") : undefined}
            onChange={(val) => onChangeMultiType(val, "org")}
            transition="fade"
            transitionDuration={300}
          />
          <Group grow>
            <Button variant="outline" type="button" onClick={clearAllFilters}>
              Reset all filters
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </Grid>
  );
};

export default JobSearchPage;
