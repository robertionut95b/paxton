import { JobsListingsDataProps } from "@features/jobs/types/jobs";
import { Stack, Title } from "@mantine/core";
import JobListingsCards from "./JobListingsCards";

type JobsRelatedSectionProps = {
  jobs: JobsListingsDataProps;
};

const JobsRelatedSection = ({ jobs }: JobsRelatedSectionProps) => {
  return (
    <Stack>
      <Title order={4} weight="normal" mt="md">
        More jobs like this
      </Title>
      <JobListingsCards jobs={jobs} />
    </Stack>
  );
};

export default JobsRelatedSection;
