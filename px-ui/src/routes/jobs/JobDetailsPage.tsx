import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import ApplicationCandidatureTimeline from "@components/jobs/job-page/ApplicationCandidatureTimeline";
import JobDescriptionSection from "@components/jobs/job-page/JobDescriptionSection";
import JobMainSection from "@components/jobs/job-page/JobMainSection";
import JobMeetRecruitersSection from "@components/jobs/job-page/JobMeetRecruitersSection";
import JobOrganizationAboutCard from "@components/jobs/job-page/JobOrganizationAboutCard";
import JobRelatedAlertSection from "@components/jobs/job-page/JobRelatedAlertSection";
import JobsRelatedSection from "@components/jobs/job-page/JobsRelatedSection";
import JobsListingsSkeleton from "@components/jobs/JobsListingsSkeleton";
import Breadcrumbs from "@components/layout/Breadcrumbs";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  FieldType,
  Operator,
  useApplyToJobListingMutation,
  useGetAllJobListingsQuery,
  useGetMyApplicationForJobListingQuery,
  useGetRelatedJobListingsQuery,
} from "@gql/generated";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { GraphqlApiResponse } from "@interfaces/api.resp.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Button, Center, Container, Paper, Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import NotFoundPage from "@routes/NotFoundPage";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { NavLink, useParams } from "react-router-dom";

const JobDetailsPage = () => {
  const { user, isAuthorized } = useAuth();
  const { jobId } = useParams();
  const queryClient = useQueryClient();
  const isCandidatureAllowed = isAuthorized([
    RoleType.ROLE_ADMINISTRATOR,
    RoleType.ROLE_RECRUITER,
  ]);

  const { data: jobData, isLoading } = useGetAllJobListingsQuery(
    graphqlRequestClient,
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
    }
  );
  const job = jobData?.getAllJobListings?.list?.[0];
  const { data: relatedJobsData, isLoading: relatedJobsIsLoading } =
    useGetRelatedJobListingsQuery(
      graphqlRequestClient,
      {
        jobName: job?.job.name ?? "",
      },
      {
        enabled: !!job?.job.name,
        select: (data) =>
          data.getRelatedJobListings?.filter((j) => j?.id !== jobId),
      }
    );
  const { data: myApplication, isInitialLoading: isMyApplicationLoading } =
    useGetMyApplicationForJobListingQuery(
      graphqlRequestClient,
      {
        JobListingId: jobId ?? "",
      },
      {
        enabled: !isCandidatureAllowed && !!job?.id,
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
          applicantProfileId: user?.profileId.toString() ?? "",
          jobListingId: job?.id ?? "",
          userId: user?.userId ?? "",
          dateOfApplication: new Date(),
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [job?.id, user?.profileId, user?.userId]
  );

  if (isLoading) return <GenericLoadingSkeleton />;
  if (!job || jobData.getAllJobListings?.totalElements === 0)
    return <NotFoundPage />;

  const recruiter = job.recruiter;

  return (
    <Container size="lg" p={0}>
      <Stack spacing={"sm"}>
        <Paper shadow={"xs"} p="xs">
          <Breadcrumbs excludePaths={["/app/jobs/view"]} />
        </Paper>
        <Paper shadow={"xs"} p="lg">
          <JobMainSection
            job={job}
            applied={!!myApplication?.getMyApplicationForJobListing}
            isAllowedCandidature={
              (job.isActive ?? false) && !isCandidatureAllowed
            }
            submitCandidatureFn={submitCandidature}
            isCandidatureLoading={isApplyLoading || isMyApplicationLoading}
          />
        </Paper>
        <ShowIf if={myApplication?.getMyApplicationForJobListing}>
          {myApplication?.getMyApplicationForJobListing && (
            <ApplicationCandidatureTimeline
              application={myApplication?.getMyApplicationForJobListing}
            />
          )}
        </ShowIf>
        <ShowIf if={recruiter}>
          {recruiter && <JobMeetRecruitersSection recruiter={recruiter} />}
        </ShowIf>
        <Paper shadow={"xs"} p="md">
          <JobDescriptionSection description={job.description} />
        </Paper>
        <JobRelatedAlertSection
          job={job.job}
          location={`${job.city.name}, ${job.city.country.name}`}
          isAlertAllowable
        />
        <JobOrganizationAboutCard organization={job.organization} />
        <ShowIfElse
          if={relatedJobsIsLoading}
          else={
            relatedJobsData &&
            relatedJobsData.length > 0 && (
              <>
                <JobsRelatedSection jobs={relatedJobsData} />
                <Center mt={"sm"}>
                  <Button
                    component={NavLink}
                    to={`/app/jobs?jobId=${job.job.id}`}
                  >
                    See similar jobs
                  </Button>
                </Center>
              </>
            )
          }
        >
          <JobsListingsSkeleton />
        </ShowIfElse>
      </Stack>
    </Container>
  );
};

export default JobDetailsPage;
