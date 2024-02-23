import { useAuth } from "@auth/useAuth";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import {
  FieldType,
  Operator,
  SortDirection,
  useGetAllJobListingsQuery,
  useGetOrganizationBySlugNameQuery,
  useGetUserProfileQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Stack } from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { formatISO } from "date-fns";
import { When } from "react-if";
import { Outlet, useParams } from "react-router-dom";
import OrganizationLatestJobs from "./OrganizationLatestJobs";
import OrganizationRecommendedJobs from "./OrganizationRecommendedJobs";

const todayIsoFmt = formatISO(new Date());

const OrganizationJobsPanel = () => {
  const { user } = useAuth();
  const { organizationSlug } = useParams();
  const { data: organization, isInitialLoading: isLoadingOrganization } =
    useGetOrganizationBySlugNameQuery(
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
            value: String(organization?.getOrganizationBySlugName?.id),
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
      enabled: !!organization?.getOrganizationBySlugName?.id,
    },
  );

  const { data: userProfileData } = useGetUserProfileQuery(
    graphqlRequestClient,
    {
      profileSlugUrl: user?.profileSlugUrl,
    },
  );

  const { data: recommendedJobsData } = useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          {
            fieldType: FieldType.Long,
            key: "organization.id",
            operator: Operator.Equal,
            value: String(organization?.getOrganizationBySlugName?.id),
          },
          ...(userProfileData?.getUserProfile?.city?.id
            ? [
                {
                  fieldType: FieldType.Long,
                  key: "city.id",
                  operator: Operator.Equal,
                  value: String(userProfileData.getUserProfile.city.id),
                },
              ]
            : []),
        ],
        size: 4,
      },
    },
    {
      enabled: !!userProfileData?.getUserProfile?.city?.id,
    },
  );

  const jobListings = jobListingsData?.getAllJobListings?.list ?? [];

  const organizationItem = organization?.getOrganizationBySlugName;

  if (isLoadingOrganization) return <GenericLoadingSkeleton />;
  if (!organization?.getOrganizationBySlugName || !organizationItem)
    return <NotFoundPage />;
  return (
    <>
      <Stack>
        <When
          condition={
            (recommendedJobsData?.getAllJobListings?.list?.length ?? 0) > 0
          }
        >
          <OrganizationRecommendedJobs
            jobs={recommendedJobsData?.getAllJobListings?.list ?? []}
            organizationSlug={organizationSlug}
            city={userProfileData?.getUserProfile?.city?.id}
          />
        </When>
        <When condition={jobListings.length > 0}>
          <OrganizationLatestJobs
            jobs={jobListings}
            organizationSlug={organizationSlug}
          />
        </When>
      </Stack>
      <Outlet />
    </>
  );
};

export default OrganizationJobsPanel;
