import { useAuth } from "@features/auth/hooks/useAuth";
import Roles from "@features/auth/types/roles";
import JobDescriptionSection from "@features/jobs/components/JobDescriptionSection";
import JobDescriptionSkeleton from "@features/jobs/components/JobDescriptionSkeleton";
import JobDescriptionMainSection from "@features/jobs/components/JobMainSection";
import JobOrganizationAboutCard from "@features/jobs/components/JobOrganizationAboutCard";
import {
  FieldType,
  Operator,
  useApplyToJobListingMutation,
  useGetAllJobListingsQuery,
  useGetMyApplicationForJobListingQuery,
} from "@gql/generated";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { GraphqlApiResponse } from "@interfaces/api";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Center, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const JobsSearchDetailsPage = () => {
  const { user, isAuthorized } = useAuth();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const jobId = searchParams.get("currentJobId");

  const isCandidatureAllowed = isAuthorized([
    Roles.ROLE_ADMINISTRATOR,
    Roles.ROLE_RECRUITER,
  ]);

  const { data: jobData, isLoading: jobIsLoading } = useGetAllJobListingsQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          {
            fieldType: FieldType.Long,
            key: "id",
            operator: Operator.Equal,
            value: jobId,
          },
        ],
      },
    },
    { enabled: !!jobId },
  );

  const { data: myApplication, isInitialLoading: isMyApplicationLoading } =
    useGetMyApplicationForJobListingQuery(
      graphqlRequestClient,
      {
        JobListingId: Number(jobId ?? 0),
      },
      {
        enabled:
          !isCandidatureAllowed && !!jobData?.getAllJobListings?.list?.[0]?.id,
        onError: (err: GraphqlApiResponse) => {
          if (err.response.errors?.[0].message.includes("does not exist")) {
            //pass
          }
        },
      },
    );

  const { isLoading: isApplyLoading, mutate } = useApplyToJobListingMutation(
    graphqlRequestClient,
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "GetMyApplicationForJobListing",
          {
            JobListingId: job?.id ?? "",
          },
        ]);
        queryClient.invalidateQueries([
          "GetAllJobListings",
          {
            searchQuery: {
              filters: [
                {
                  key: "id",
                  fieldType: FieldType.Long,
                  operator: Operator.Equal,
                  value: jobId ?? "0",
                },
              ],
            },
          },
        ]);
        showNotification({
          title: "Application submitted",
          message:
            "Successfully submitted application! Your entry will be reviewed in short time by the recruiter",
          autoClose: 5000,
          icon: <CheckCircleIcon width={20} />,
        });
      },
    },
  );

  const submitCandidature = useCallback(
    () =>
      mutate({
        ApplicationInput: {
          applicantProfileId: user?.profileId ?? 0,
          jobListingId: jobData?.getAllJobListings?.list?.[0]?.id ?? 0,
          userId: user?.userId ?? 0,
          dateOfApplication: new Date(),
        },
      }),
    [jobData?.getAllJobListings?.list, user?.profileId, user?.userId],
  );

  if (jobIsLoading || isMyApplicationLoading) return <JobDescriptionSkeleton />;

  if (
    !jobData?.getAllJobListings?.list &&
    !jobData?.getAllJobListings?.list?.[0]
  )
    return (
      <Center>
        <Text size="sm">Could not load job data</Text>
      </Center>
    );

  const job = jobData.getAllJobListings.list?.[0];

  return (
    <Stack>
      {job && (
        <JobDescriptionMainSection
          job={job}
          applied={!!myApplication?.getMyApplicationForJobListing}
          isAllowedCandidature={
            (job.isActive ?? false) && !isCandidatureAllowed
          }
          submitCandidatureFn={submitCandidature}
          isCandidatureLoading={isApplyLoading || isMyApplicationLoading}
        />
      )}
      <JobDescriptionSection description={job?.formattedDescription ?? ""} />
      {job?.organization && (
        <JobOrganizationAboutCard organization={job?.organization} />
      )}
    </Stack>
  );
};

export default JobsSearchDetailsPage;
