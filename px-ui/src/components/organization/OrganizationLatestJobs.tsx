import JobListingsCards from "@components/jobs/JobListingsCards";
import { JobsListingsDataProps } from "@interfaces/jobs.types";
import { Button, Divider, Paper, Stack, Title } from "@mantine/core";
import { NavLink } from "react-router-dom";

interface OrganizationLatestJobsProps {
  jobs: JobsListingsDataProps;
  organizationSlug?: string;
}

const OrganizationLatestJobs = ({
  jobs,
  organizationSlug,
}: OrganizationLatestJobsProps) => {
  const params = new URLSearchParams("");
  organizationSlug && params.set("org", organizationSlug);
  params.set("ref", "orgPage");

  return (
    <Paper p="md" shadow="xs">
      <Stack>
        <Title order={5}>Recently published jobs</Title>
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

export default OrganizationLatestJobs;
