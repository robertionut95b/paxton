import JobsListingsSkeleton from "@components/jobs/JobsListingsSkeleton";
import OrganizationJobListings from "@components/organization/OrganizationJobListings";
import PaginationToolbar from "@components/pagination/PaginationToolbar";
import {
  FieldType,
  FiltersInput,
  InputMaybe,
  Operator,
  SortDirection,
  useGetAllJobListingsQuery,
  useGetOrganizationByIdQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { queryClient } from "@lib/queryClient";
import { Container, Group, Text } from "@mantine/core";
import { useState } from "react";
import { useParams } from "react-router-dom";

type OrganizationJobsTabsProps = {
  filters?: InputMaybe<InputMaybe<FiltersInput>[]>;
};

const OrganizationJobsTab = ({ filters = [] }: OrganizationJobsTabsProps) => {
  const { organizationId } = useParams();
  const [p, setP] = useState(1);
  const [ps, setPs] = useState(5);

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
          filters: filters,
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

  const orgJobsData = orgJobs?.getAllJobListings?.list || [];
  const totalPages = orgJobs?.getAllJobListings?.totalPages ?? 0;
  const totalElements = orgJobs?.getAllJobListings?.totalElements ?? 0;

  if (isOrgJobsLoading || isLoadingOrganization)
    return <JobsListingsSkeleton />;

  return (
    <Container>
      {totalElements > 0 ? (
        // @ts-expect-error(types-check)
        <OrganizationJobListings jobs={orgJobsData} />
      ) : (
        <Group py="sm">
          <Text size={"md"}>No results found for this request</Text>
        </Group>
      )}

      {totalElements > 0 && (
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
      )}
    </Container>
  );
};

export default OrganizationJobsTab;
