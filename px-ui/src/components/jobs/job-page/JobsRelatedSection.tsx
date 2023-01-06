import { GetRelatedJobListingsQuery } from "@gql/generated";
import { Button, Center, Stack, Title } from "@mantine/core";
import JobListingsCards from "../JobListingsCards";

type JobsRelatedSectionProps = {
  jobs: (NonNullable<
    NonNullable<GetRelatedJobListingsQuery["getRelatedJobListings"]>[number]
  > | null)[];
};

const JobsRelatedSection = ({ jobs }: JobsRelatedSectionProps) => {
  return (
    <Stack>
      <Title order={4} weight="normal" mt="md">
        More jobs like this
      </Title>
      <JobListingsCards jobs={jobs} />
      <Center mt={"sm"}>
        <Button>See more similar jobs</Button>
      </Center>
    </Stack>
  );
};

export default JobsRelatedSection;
