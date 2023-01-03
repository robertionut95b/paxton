import { RequirePermission } from "@auth/RequirePermission";
import RoleType from "@auth/RoleType";
import { useAuth } from "@auth/useAuth";
import JobListingItem from "@components/jobs/JobListing";
import JobsListingsSkeleton from "@components/jobs/JobsListingsSkeleton";
import OrganizationToolbar from "@components/organization/OrganizationToolbar";
import PaginationToolbar from "@components/pagination/PaginationToolbar";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  FieldType,
  Operator,
  SortDirection,
  useGetAllJobListingsQuery,
  useGetOrganizationByIdQuery,
} from "@gql/generated";
import { PencilIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  ActionIcon,
  Container,
  Divider,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { formatISO } from "date-fns";
import { useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";

const todayIsoFmt = formatISO(new Date());

export default function OrganizationPage() {
  const [p, setP] = useState(1);
  const [ps, setPs] = useState(5);
  const [pi, setPi] = useState(1);
  const [psi, setPsi] = useState(5);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { organizationId } = useParams();
  const permissions = user?.permissions ?? [];
  const isAdminOrRecruiter =
    permissions.includes(RoleType.ROLE_RECRUITER) ||
    permissions.includes(RoleType.ROLE_RECRUITER);

  const { data: organization, isLoading: isLoadingOrganization } =
    useGetOrganizationByIdQuery(
      graphqlRequestClient,
      {
        organizationId: organizationId as string,
      },
      {
        enabled: !!organizationId,
      }
    );

  const organizationItem = organization?.getOrganizationById;

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
              value: organizationItem?.id.toString() ?? "0",
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
        enabled: !!organizationItem,
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
          page: pi - 1,
          size: psi,
          filters: [
            {
              key: "organization",
              fieldType: FieldType.Long,
              value: organizationItem?.id.toString() ?? "0",
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
        enabled: isAdminOrRecruiter,
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

  if (isLoadingOrganization) return <GenericLoadingSkeleton />;

  return (
    <div className="px-organization flex flex-col gap-4">
      {organizationItem && (
        <RequirePermission permission={RoleType.ROLE_RECRUITER}>
          <OrganizationToolbar organization={organizationItem} />
        </RequirePermission>
      )}
      <ShowIfElse
        if={isOrgJobsLoading}
        else={
          <Paper shadow={"xs"} p="md">
            <Title mb={"xs"} order={4}>
              Organization&apos;s current jobs
            </Title>
            <Text color="dimmed" size={13}>
              {totalElements} results
            </Text>
            <Container>
              {orgJobsData.map(
                (jl, idx) =>
                  jl && (
                    <div key={jl.id}>
                      <div className="flex items-center">
                        <div className="grow">
                          <JobListingItem data={jl} />
                        </div>
                        <RequirePermission
                          permission={RoleType.ROLE_RECRUITER}
                          returnValue="null"
                        >
                          <NavLink
                            to={`/app/organizations/${organizationItem?.id}/jobs/publish-job/form/${jl.id}/update`}
                          >
                            <ActionIcon mt={"md"} color="violet">
                              <PencilIcon width={16} />
                            </ActionIcon>
                          </NavLink>
                        </RequirePermission>
                      </div>
                      {idx !== orgJobsData.length - 1 && <Divider />}
                    </div>
                  )
              )}
              <div className="px-org-jobs-pagination">
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
          </Paper>
        }
      >
        <JobsListingsSkeleton />
      </ShowIfElse>
      <ShowIfElse
        if={isOrgJobsLoadingInactive && isAdminOrRecruiter}
        else={
          <RequirePermission
            permission={RoleType.ROLE_RECRUITER}
            returnValue="null"
          >
            <ShowIf if={orgJobsDataInactive.length > 0}>
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
                          <div className="flex items-center">
                            <div className="grow">
                              <JobListingItem data={jl} />
                            </div>
                            <RequirePermission
                              permission={RoleType.ROLE_RECRUITER}
                              returnValue="null"
                            >
                              <NavLink
                                to={`/app/organizations/${organizationItem?.id}/jobs/publish-job/form/${jl.id}/update`}
                              >
                                <ActionIcon mt={"md"} color="violet">
                                  <PencilIcon width={16} />
                                </ActionIcon>
                              </NavLink>
                            </RequirePermission>
                          </div>
                          {idx !== orgJobsDataInactive.length - 1 && (
                            <Divider />
                          )}
                        </div>
                      )
                  )}
                  <div className="px-org-inactive-jobs-pagination">
                    <PaginationToolbar
                      page={pi}
                      setPage={setPi}
                      pageSize={psi}
                      setPageSize={setPsi}
                      totalElements={totalElementsInactive}
                      totalPages={totalPagesInactive}
                    />
                  </div>
                </Container>
              </Paper>
            </ShowIf>
          </RequirePermission>
        }
      >
        <JobsListingsSkeleton />
      </ShowIfElse>
      <Outlet />
    </div>
  );
}
