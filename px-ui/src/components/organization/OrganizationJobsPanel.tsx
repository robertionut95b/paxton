import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import ShowIf from "@components/visibility/ShowIf";
import {
  FieldType,
  Operator,
  SortDirection,
  useGetAllJobListingsQuery,
  useGetOrganizationBySlugNameQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Stack } from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { useParams } from "react-router-dom";
import OrganizationLatestJobs from "./OrganizationLatestJobs";
import OrganizationRecommendedJobs from "./OrganizationRecommendedJobs";

const OrganizationJobsPanel = () => {
  const { organizationSlug } = useParams();
  const { data: organization, isInitialLoading: isLoadingOrganization } =
    useGetOrganizationBySlugNameQuery(
      graphqlRequestClient,
      {
        slugName: organizationSlug as string,
      },
      {
        enabled: !!organizationSlug,
      }
    );
  const { data: jobListingsData } = useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          {
            fieldType: FieldType.Long,
            key: "organization",
            operator: Operator.Equal,
            value: organization?.getOrganizationBySlugName?.id ?? "",
          },
        ],
        sorts: [
          {
            key: "availableFrom",
            direction: SortDirection.Desc,
          },
        ],
        size: 4,
      },
    },
    {
      enabled: !!organization?.getOrganizationBySlugName?.id,
    }
  );

  const jobListings = jobListingsData?.getAllJobListings?.list ?? [];

  const organizationItem = organization?.getOrganizationBySlugName;

  if (isLoadingOrganization) return <GenericLoadingSkeleton />;
  if (!organization?.getOrganizationBySlugName || !organizationItem)
    return <NotFoundPage />;
  return (
    <Stack>
      <ShowIf if={jobListings.length > 0}>
        <OrganizationRecommendedJobs
          jobs={jobListings}
          organizationSlug={organizationSlug}
        />
      </ShowIf>
      <ShowIf if={jobListings.length > 0}>
        <OrganizationLatestJobs
          jobs={jobListings}
          organizationSlug={organizationSlug}
        />
      </ShowIf>
    </Stack>
  );
};

export default OrganizationJobsPanel;
