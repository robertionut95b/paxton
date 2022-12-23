import { useAuth } from "@auth/useAuth";
import JobListingItem from "@components/jobs/JobListing";
import JobsListingsSkeleton from "@components/jobs/JobsListingsSkeleton";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  FieldType,
  Operator,
  SortDirection,
  useGetAllJobListingsQuery,
  useGetUserProfileQuery,
} from "@gql/generated";
import {
  ClipboardDocumentIcon,
  PencilIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  ActionIcon,
  Avatar,
  Button,
  Container,
  Divider,
  Group,
  Pagination,
  Paper,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { formatISO } from "date-fns";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function OrganizationRecruiterDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading: isLoadingUserProfile } =
    useGetUserProfileQuery(graphqlRequestClient, {
      profileSlugUrl: user?.profileSlugUrl,
    });

  const lastOrganization =
    userProfile?.getUserProfile?.experiences?.[0]?.organization;

  const todayIsoFmt = formatISO(new Date());

  const [p, setP] = useState(1);
  const [ps, setPs] = useState(5);
  const [pi, setPi] = useState(1);
  const [psi, setPsi] = useState(5);
  const { data: orgJobs, isLoading: isOrgJobsLoading } =
    useGetAllJobListingsQuery(
      graphqlRequestClient,
      {
        searchQuery: {
          page: p - 1,
          size: ps,
          filters: [
            {
              key: "organization",
              fieldType: FieldType.Long,
              value: lastOrganization?.id.toString() ?? "0",
              operator: Operator.Equal,
            },
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
        keepPreviousData: true,
        staleTime: 1000 * 60,
        enabled: !!lastOrganization,
        onSuccess: (data) => {
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
          const org = data.getAllJobListings?.list?.[0]?.organization;
          queryClient.setQueryData(
            ["GetOrganizationById", { organizationId: org?.id }],
            {
              getOrganizationById: org,
            }
          );
        },
      }
    );

  const { data: orgJobsInactive, isLoading: isOrgJobsLoadingInactive } =
    useGetAllJobListingsQuery(
      graphqlRequestClient,
      {
        searchQuery: {
          page: p - 1,
          size: ps,
          filters: [
            {
              key: "organization",
              fieldType: FieldType.Long,
              value: lastOrganization?.id.toString() ?? "0",
              operator: Operator.Equal,
            },
            {
              key: "availableFrom",
              fieldType: FieldType.Date,
              value: todayIsoFmt,
              operator: Operator.GreaterThan,
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
        keepPreviousData: true,
        staleTime: 1000 * 60,
        enabled: !!lastOrganization,
        onSuccess: (data) => {
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
          const org = data.getAllJobListings?.list?.[0]?.organization;
          queryClient.setQueryData(
            ["GetOrganizationById", { organizationId: org?.id }],
            {
              getOrganizationById: org,
            }
          );
        },
      }
    );

  const totalPages = orgJobs?.getAllJobListings?.totalPages ?? 0;
  const totalElements = orgJobs?.getAllJobListings?.totalElements ?? 0;
  const orgJobsData = orgJobs?.getAllJobListings?.list || [];

  const totalPagesInactive =
    orgJobsInactive?.getAllJobListings?.totalPages ?? 0;
  const totalElementsInactive =
    orgJobsInactive?.getAllJobListings?.totalElements ?? 0;
  const orgJobsDataInactive = orgJobsInactive?.getAllJobListings?.list || [];

  if (isLoadingUserProfile) return <GenericLoadingSkeleton />;

  return (
    <div className="px-recruiter-org-dashboard flex flex-col flex-wrap gap-y-4">
      <Paper shadow={"xs"} p="md">
        <Group position="apart">
          <Group spacing="xs">
            <NavLink
              to={`/app/organizations/${lastOrganization?.id}/jobs/publish-job/form`}
            >
              <Button
                leftIcon={<ClipboardDocumentIcon width={16} />}
                variant="light"
              >
                Publish jobs
              </Button>
            </NavLink>
            <NavLink to={`/app/organizations/${lastOrganization?.id}/contacts`}>
              <Button leftIcon={<UserIcon width={16} />} variant="light">
                Contacts
              </Button>
            </NavLink>
          </Group>
          <ShowIf if={lastOrganization}>
            <NavLink to={`/app/organizations/${lastOrganization?.id}/details`}>
              <Group>
                <Text className="hidden md:block" size={"sm"}>
                  {lastOrganization?.name}
                </Text>
                <Avatar
                  size="sm"
                  src={lastOrganization?.photography}
                  title={lastOrganization?.name}
                >
                  {lastOrganization?.name?.[0]}
                </Avatar>
              </Group>
            </NavLink>
          </ShowIf>
        </Group>
      </Paper>
      <ShowIfElse if={!isOrgJobsLoading} else={<JobsListingsSkeleton />}>
        <Paper shadow={"xs"} p="md">
          <Title mb={"xs"} order={4}>
            Organization&apos;s active jobs
          </Title>
          <Text color="dimmed" size={13}>
            {totalElements} results
          </Text>
          <Container>
            {orgJobsData.map(
              (jl, idx) =>
                jl && (
                  <div key={jl.id}>
                    <div className="flex items-start">
                      <JobListingItem data={jl} />
                      <NavLink
                        to={`/app/organizations/${lastOrganization?.id}/jobs/publish-job/form/${jl.id}/update`}
                      >
                        <ActionIcon mt={"md"} color="violet">
                          <PencilIcon width={16} />
                        </ActionIcon>
                      </NavLink>
                    </div>
                    {idx !== orgJobsData.length - 1 && <Divider />}
                  </div>
                )
            )}
            <div className="px-org-jobs-pagination flex justify-between items-center mt-4">
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
        </Paper>
      </ShowIfElse>
      <ShowIfElse
        if={!isOrgJobsLoadingInactive}
        else={<JobsListingsSkeleton />}
      >
        <Paper shadow={"xs"} p="md">
          <Title mb={"xs"} order={4}>
            Organization&apos;s inactive jobs
          </Title>
          <Text color="dimmed" size={13}>
            {totalElementsInactive} results
          </Text>
          <Container>
            {orgJobsDataInactive.map(
              (jl, idx) =>
                jl && (
                  <div className="opacity-50" key={jl.id}>
                    <div className="flex items-start">
                      <JobListingItem data={jl} />
                      <NavLink
                        to={`/app/organizations/${lastOrganization?.id}/jobs/publish-job/form/${jl.id}/update`}
                      >
                        <ActionIcon mt={"md"} color="violet">
                          <PencilIcon width={16} />
                        </ActionIcon>
                      </NavLink>
                    </div>
                    {idx !== orgJobsDataInactive.length - 1 && <Divider />}
                  </div>
                )
            )}
            <div className="px-org-jobs-pagination flex justify-between items-center mt-4">
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
                defaultValue={psi.toString()}
                value={psi.toString()}
                onChange={(v) => {
                  setPsi(parseInt(v ?? "10"));
                  setPi(1);
                }}
              />
              <Pagination
                total={totalPagesInactive}
                page={pi}
                onChange={setPi}
                initialPage={0}
                position="right"
                grow
              />
            </div>
          </Container>
        </Paper>
      </ShowIfElse>
    </div>
  );
}
