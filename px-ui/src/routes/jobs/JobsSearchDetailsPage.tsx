import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import JobDescriptionSection from "@components/jobs/job-page/JobDescriptionSection";
import JobDescriptionSkeleton from "@components/jobs/job-page/JobDescriptionSkeleton";
import JobMainSection from "@components/jobs/job-page/JobMainSection";
import JobOrganizationAboutCard from "@components/jobs/job-page/JobOrganizationAboutCard";
import {
  FieldType,
  Operator,
  useApplyToJobListingMutation,
  useGetAllJobListingsQuery,
  useGetMyApplicationForJobListingQuery,
} from "@gql/generated";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { GraphqlApiResponse } from "@interfaces/api.resp.types";
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
    RoleType.ROLE_ADMINISTRATOR,
    RoleType.ROLE_RECRUITER,
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
    { enabled: !!jobId }
  );

  const { data: myApplication, isInitialLoading: isMyApplicationLoading } =
    useGetMyApplicationForJobListingQuery(
      graphqlRequestClient,
      {
        JobListingId: Number(jobId) ?? 0,
      },
      {
        enabled:
          !isCandidatureAllowed && !!jobData?.getAllJobListings?.list?.[0]?.id,
        onError: (err: GraphqlApiResponse) => {
          if (err.response.errors?.[0].message.includes("does not exist")) {
            //pass
          }
        },
      }
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
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jobData?.getAllJobListings?.list?.[0]?.id, user?.profileId, user?.userId]
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
        <JobMainSection
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
