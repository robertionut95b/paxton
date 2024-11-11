import { Routes } from "@app/routes";
import JobListingsCards from "@features/jobs/components/JobListingsCards";
import { JobsListingsDataProps } from "@features/jobs/types/jobs";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
          to={Routes.Jobs.Search.buildPath(
            {},
            { org: params.get("org") ?? undefined, ref: "orgPage" },
          )}
        >
          See all jobs
        </Button>
      </Stack>
    </Paper>
  );
};

export default OrganizationLatestJobs;
