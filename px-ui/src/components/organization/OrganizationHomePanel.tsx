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
import { useParams } from "react-router-dom";
import OrganizationAboutPanel from "./OrganizationAboutPanel";
import OrganizationLatestJobs from "./OrganizationLatestJobs";

const OrganizationHomePanel = () => {
  const { organizationSlug } = useParams();
  const { data: organizationData } = useGetOrganizationBySlugNameQuery(
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
            value: organizationData?.getOrganizationBySlugName?.id ?? "",
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
      enabled: !!organizationData?.getOrganizationBySlugName?.id,
    }
  );

  const jobListings = jobListingsData?.getAllJobListings?.list ?? [];

  return (
    <Stack>
      <OrganizationAboutPanel />
      <ShowIf if={jobListings.length > 0}>
        <OrganizationLatestJobs
          organizationSlug={organizationSlug}
          jobs={jobListings}
        />
      </ShowIf>
    </Stack>
  );
};

export default OrganizationHomePanel;
