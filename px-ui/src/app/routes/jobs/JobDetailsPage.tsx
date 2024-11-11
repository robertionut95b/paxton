import { Routes } from "@app/routes";
import NotFoundPage from "@app/routes/NotFoundPage";
import Breadcrumbs from "@components/ui/navigation/Breadcrumbs";
import { useAuth } from "@features/auth/hooks/useAuth";
import Roles from "@features/auth/types/roles";
import ApplicationCandidatureTimeline from "@features/job-applications/components/ApplicationCandidatureTimeline";
import {
  useGetJobListingById,
  useGetRelatedJobListingsToJobName,
} from "@features/jobs/api/getJobListings";
import { useGetMyJobListingApplication } from "@features/jobs/api/getMyJobListingApplication";
import { useApplyToJobListing } from "@features/jobs/api/postJobListingApplication";
import JobDescriptionSection from "@features/jobs/components/JobDescriptionSection";
import JobDescriptionMainSection from "@features/jobs/components/JobMainSection";
import JobMeetRecruitersSection from "@features/jobs/components/JobMeetRecruitersSection";
import JobOrganizationAboutCard from "@features/jobs/components/JobOrganizationAboutCard";
import JobRelatedAlertSection from "@features/jobs/components/JobRelatedAlertSection";
import JobsListingsSkeleton from "@features/jobs/components/JobsListings.skeleton";
import JobsRelatedSection from "@features/jobs/components/JobsRelatedSection";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button, Center, Container, Paper, Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Suspense, useCallback } from "react";
import { When } from "react-if";
import { NavLink, useParams } from "react-router-dom";

const JobDetailsPage = () => {
  const { user, isAuthorized } = useAuth();
  const { jobId } = useParams();
  const isCandidatureAllowed = isAuthorized([
    Roles.ROLE_ADMINISTRATOR,
    Roles.ROLE_RECRUITER,
  ]);

  const { data: jobData } = useGetJobListingById(jobId!);
  const job = jobData?.getAllJobListings?.list?.[0];
  const { data: relatedJobsData } = useGetRelatedJobListingsToJobName(
    job?.job.name,
    job?.id,
  );
  const { data: myApplication, isInitialLoading: isMyApplicationLoading } =
    useGetMyJobListingApplication(job?.id, isCandidatureAllowed);

  const { isLoading: isApplyLoading, mutate: applyToJobListing } =
    useApplyToJobListing(job?.id);

  const submitCandidature = useCallback(
    () =>
      applyToJobListing(
        {
          ApplicationInput: {
            applicantProfileId: user?.profileId ?? 0,
            jobListingId: job?.id ?? 0,
            userId: user?.userId ?? 0,
            dateOfApplication: new Date(),
          },
        },
        {
          onSuccess: () => {
            showNotification({
              title: "Application submitted",
              message:
                "Successfully submitted application! Your entry will be reviewed in short time by the recruiter",
              autoClose: 5000,
              icon: <CheckCircleIcon width={20} />,
            });
          },
        },
      ),
    [job?.id, user?.profileId, user?.userId, applyToJobListing],
  );

  if (!job || jobData.getAllJobListings?.totalElements === 0)
    return <NotFoundPage />;

  const recruiter = job.recruiter;

  return (
    <Container size="lg" p={0}>
      <Stack spacing={"sm"}>
        <Paper shadow={"xs"} p="xs">
          <Breadcrumbs excludePaths={[Routes.Jobs.View.path]} />
        </Paper>
        <Paper shadow={"xs"} p="lg">
          <JobDescriptionMainSection
            job={job}
            applied={!!myApplication?.getMyApplicationForJobListing}
            isAllowedCandidature={
              (job.isActive ?? false) && !isCandidatureAllowed
            }
            submitCandidatureFn={submitCandidature}
            isCandidatureLoading={isApplyLoading || isMyApplicationLoading}
          />
        </Paper>
        <When condition={!!myApplication?.getMyApplicationForJobListing}>
          {myApplication?.getMyApplicationForJobListing && (
            <ApplicationCandidatureTimeline
              application={myApplication.getMyApplicationForJobListing}
            />
          )}
        </When>
        <When condition={!!recruiter}>
          <JobMeetRecruitersSection
            recruiter={recruiter!}
            isContactable={recruiter!.user.id === user?.userId}
          />
        </When>
        <Paper shadow={"xs"} p="md">
          <JobDescriptionSection description={job.formattedDescription} />
        </Paper>
        <JobRelatedAlertSection
          // @ts-expect-error("types-to-fix")
          job={job.job}
          location={`${job.city.name}, ${job.city.country.name}`}
          isAlertAllowable
        />
        <JobOrganizationAboutCard organization={job.organization} />
        <Suspense fallback={<JobsListingsSkeleton />}>
          <When condition={relatedJobsData && relatedJobsData.length > 0}>
            {relatedJobsData && <JobsRelatedSection jobs={relatedJobsData} />}
            <Center mt={"sm"}>
              <Button
                component={NavLink}
                to={Routes.Jobs.Search.buildSearch({
                  jobId: job.job.id.toString(),
                })}
              >
                See similar jobs
              </Button>
            </Center>
          </When>
        </Suspense>
      </Stack>
    </Container>
  );
};

export default JobDetailsPage;
