import { Routes } from "@app/routes";
import JobListingsCards from "@features/jobs/components/JobListingsCards";
import { JobsListingsDataProps } from "@features/jobs/types/jobs";
import { Button, Divider, Paper, Stack, Text, Title } from "@mantine/core";
import { NavLink } from "react-router-dom";

interface OrganizationRecommendedJobsProps {
  jobs: JobsListingsDataProps;
  organizationSlug?: string;
  city?: number;
}

const OrganizationRecommendedJobs = ({
  jobs,
  organizationSlug,
  city,
}: OrganizationRecommendedJobsProps) => {
  const params = new URLSearchParams("");
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  organizationSlug && params.set("org", organizationSlug);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  city && params.set("city", city.toString());

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
          to={Routes.Jobs.Search.buildPath(
            {},
            { org: organizationSlug, city: city?.toString() },
          )}
        >
          See all jobs
        </Button>
      </Stack>
    </Paper>
  );
};

export default OrganizationRecommendedJobs;
