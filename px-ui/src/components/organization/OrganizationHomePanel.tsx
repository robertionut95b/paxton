import {
  FieldType,
  Operator,
  SortDirection,
  useGetAllJobListingsQuery,
  useGetOrganizationBySlugNameQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Stack } from "@mantine/core";
import { formatISO } from "date-fns";
import { When } from "react-if";
import { Outlet, useParams } from "react-router-dom";
import OrganizationAboutPanel from "./OrganizationAboutPanel";
import OrganizationLatestJobs from "./OrganizationLatestJobs";

const todayIsoFmt = formatISO(new Date());

const OrganizationHomePanel = () => {
  const { organizationSlug } = useParams();
  const { data: organizationData } = useGetOrganizationBySlugNameQuery(
    graphqlRequestClient,
    {
      slugName: organizationSlug as string,
    },
    {
      enabled: !!organizationSlug,
    },
  );
  const { data: jobListingsData } = useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          {
            fieldType: FieldType.Long,
            key: "organization.id",
            operator: Operator.Equal,
            value: String(organizationData?.getOrganizationBySlugName?.id),
          },
          {
            key: "availableTo",
            fieldType: FieldType.Date,
            value: todayIsoFmt,
            operator: Operator.GreaterThan,
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
    },
  );

  const jobListings = jobListingsData?.getAllJobListings?.list ?? [];

  return (
    <Stack>
      <OrganizationAboutPanel compact />
      <When condition={jobListings.length > 0}>
        <OrganizationLatestJobs
          organizationSlug={organizationSlug}
          jobs={jobListings}
        />
      </When>
      <Outlet />
    </Stack>
  );
};

export default OrganizationHomePanel;
