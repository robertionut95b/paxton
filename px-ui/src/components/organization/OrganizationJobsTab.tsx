import JobsListingsSkeleton from "@components/jobs/JobsListingsSkeleton";
import OrganizationJobListings from "@components/organization/OrganizationJobListings";
import PaginationToolbar from "@components/pagination/PaginationToolbar";
import {
  FieldType,
  FiltersInput,
  InputMaybe,
  JobListing,
  Operator,
  SortDirection,
  useGetAllJobListingsQuery,
  useGetOrganizationBySlugNameQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { queryClient } from "@lib/queryClient";
import { Container, Group, Text } from "@mantine/core";
import { MouseEventHandler, useState } from "react";
import { useParams } from "react-router-dom";

type OrganizationJobsTabsProps = {
  filters?: InputMaybe<InputMaybe<FiltersInput>[]>;
  compactItems?: boolean;
  editableItems?: boolean;
  itemClickCb?: (item: JobListing) => MouseEventHandler<Element> | undefined;
};

const OrganizationJobsTab = ({
  filters = [],
  compactItems = false,
  editableItems = false,
  itemClickCb,
}: OrganizationJobsTabsProps) => {
  const { organizationSlug } = useParams();
  const [p, setP] = useState(1);
  const [ps, setPs] = useState(5);

  const { data: organization, isLoading: isLoadingOrganization } =
    useGetOrganizationBySlugNameQuery(
      graphqlRequestClient,
      {
        slugName: organizationSlug as string,
      },
      {
        enabled: !!organizationSlug,
      }
    );

  const organizationItem = organization?.getOrganizationBySlugName;
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
    <Container p={0}>
      {totalElements > 0 ? (
        <OrganizationJobListings
          compactItems={compactItems}
          editableItems={editableItems}
          itemClickCb={itemClickCb}
          // @ts-expect-error(types-check)
          jobs={orgJobsData}
        />
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
