import JobListingsCards from "@components/jobs/JobListingsCards";
import { JobsListingsDataProps } from "@interfaces/jobs.types";
import { Button, Divider, Paper, Stack, Text, Title } from "@mantine/core";
import { NavLink } from "react-router-dom";

interface OrganizationRecommendedJobsProps {
  jobs: JobsListingsDataProps;
  organizationSlug?: string;
  city?: string;
}

const OrganizationRecommendedJobs = ({
  jobs,
  organizationSlug,
  city,
}: OrganizationRecommendedJobsProps) => {
  const params = new URLSearchParams("");
  organizationSlug && params.set("org", organizationSlug);
  city && params.set("city", city);

  return (
    <Paper p="md" shadow="xs">
      <Stack>
        <Stack spacing={3}>
          <Title order={5}>Recommended jobs</Title>
          <Text size="sm">Based on your profile&apos;s information</Text>
        </Stack>
        <JobListingsCards jobs={jobs} />
        <Divider mt="sm" />
        <Button
          variant="subtle"
          fullWidth
          component={NavLink}
          to={`/app/jobs?${params.toString()}`}
        >
          See all jobs
        </Button>
      </Stack>
    </Paper>
  );
};

export default OrganizationRecommendedJobs;
