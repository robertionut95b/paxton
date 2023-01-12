import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import JobsListingsSkeleton from "@components/jobs/JobsListingsSkeleton";
import JobDescriptionSection from "@components/jobs/job-page/JobDescriptionSection";
import JobMainSection from "@components/jobs/job-page/JobMainSection";
import JobOrganizationAboutCard from "@components/jobs/job-page/JobOrganizationAboutCard";
import JobRelatedAlertSection from "@components/jobs/job-page/JobRelatedAlertSection";
import JobsRelatedSection from "@components/jobs/job-page/JobsRelatedSection";
import Breadcrumbs from "@components/layout/Breadcrumbs";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
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
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Container, Paper, Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import NotFoundPage from "@routes/NotFoundPage";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const JobDetailsPage = () => {
  const { user, isInRole } = useAuth();
  const { jobId } = useParams();
  const queryClient = useQueryClient();
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
        enabled: !!job,
        select: (data) =>
          data.getRelatedJobListings?.filter((j) => j?.id !== jobId),
      }
    );
  const { data: myApplication, isLoading: applicationLoading } =
    useGetMyApplicationForJobListingQuery(
      graphqlRequestClient,
      {
        JobListingId: job?.id ?? "",
      },
      {
        enabled: !!job?.id,
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

  const submitCandidature = () =>
    mutate({
      ApplicationInput: {
        applicantProfileId: user?.profileId.toString() ?? "",
        jobListingId: job?.id ?? "",
        userId: user?.userId ?? "",
      },
    });

  if (isLoading || applicationLoading) return <GenericLoadingSkeleton />;
  if (!job) return <NotFoundPage />;

  return (
    <Container>
      <Stack spacing={"sm"}>
        <Paper shadow={"xs"} p="xs">
          <Breadcrumbs excludePaths={["/app/jobs/view"]} />
        </Paper>
        <JobMainSection
          job={job}
          applied={!!myApplication?.getMyApplicationForJobListing}
          isAllowedCandidature={
            (job.isActive ?? false) &&
            !isInRole(RoleType.ROLE_ADMINISTRATOR) &&
            !isInRole(RoleType.ROLE_RECRUITER)
          }
          submitCandidatureFn={submitCandidature}
          isCandidatureLoading={isApplyLoading}
        />
        <JobDescriptionSection description={job.description} />
        <JobRelatedAlertSection
          job={job.job}
          location={`${job.city.name}, ${job.city.country.name}`}
          isAlertAllowable
        />
        <JobOrganizationAboutCard
          organization={job.organization}
          jobDescription={job.description}
        />
        <ShowIfElse
          if={relatedJobsIsLoading}
          else={
            relatedJobsData &&
            relatedJobsData.length > 0 && (
              <JobsRelatedSection jobs={relatedJobsData} />
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
