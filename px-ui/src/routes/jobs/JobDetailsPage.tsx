import { isAdmin, isRecruiter } from "@auth/RequirePermission";
import { useAuth } from "@auth/useAuth";
import JobDescriptionSection from "@components/jobs/job-page/JobDescriptionSection";
import JobMainSection from "@components/jobs/job-page/JobMainSection";
import JobsRelatedSection from "@components/jobs/job-page/JobsRelatedSection";
import JobsListingsSkeleton from "@components/jobs/JobsListingsSkeleton";
import Breadcrumbs from "@components/layout/Breadcrumbs";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import ExpandableText from "@components/visibility/ExpandableText";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  FieldType,
  Operator,
  useGetAllJobListingsQuery,
  useGetRelatedJobListingsQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Avatar, Container, Group, Paper, Stack, Title } from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { useParams } from "react-router-dom";

const JobDetailsPage = () => {
  const { user } = useAuth();
  const { jobId } = useParams();
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
  const permissions = user?.permissions ?? [];

  if (isLoading) return <GenericLoadingSkeleton />;
  if (!job) return <NotFoundPage />;

  const myApplication = job.applications?.find((a) => a?.id === "1");

  return (
    <Container>
      <Stack spacing={"sm"}>
        <Paper shadow={"xs"} p="xs">
          <Breadcrumbs excludePaths={["/app/jobs/view"]} />
        </Paper>
        <JobMainSection
          job={job}
          applied={!!myApplication}
          isAllowedCandidature={
            (job.isActive ?? false) &&
            !isAdmin(permissions) &&
            !isRecruiter(permissions)
          }
        />
        <JobDescriptionSection description={job.description} />
        <Paper shadow={"xs"} p="md">
          <Title mb={"md"} order={4}>
            About the company
          </Title>
          <Group>
            <Avatar src={job.organization.photography} mb={"md"}>
              {job.organization.name[0]}
            </Avatar>
            <Title mb={8} order={5}>
              {job.organization.name}
            </Title>
          </Group>
          <ExpandableText size={"sm"}>{job.description}</ExpandableText>
        </Paper>
        <ShowIfElse
          if={relatedJobsIsLoading}
          else={
            relatedJobsData && <JobsRelatedSection jobs={relatedJobsData} />
          }
        >
          <JobsListingsSkeleton />
        </ShowIfElse>
      </Stack>
    </Container>
  );
};

export default JobDetailsPage;
