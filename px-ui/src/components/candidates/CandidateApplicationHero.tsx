import ShowIfElse from "@components/visibility/ShowIfElse";
import { GetApplicationForJobListingRecruitmentQuery } from "@gql/generated";
import { Avatar, Group, Stack, Text, Title } from "@mantine/core";
import { format } from "date-fns";

type CandidateApplicationHeroProps = {
  candidate: NonNullable<
    NonNullable<
      GetApplicationForJobListingRecruitmentQuery["getApplicationForJobListing"]
    >["candidate"]
  >;
  jobTitle: string;
  dateOfApplication: Date;
  profilePhotoUrl?: string | null;
};

const CandidateApplicationHero = ({
  profilePhotoUrl,
  candidate,
  jobTitle,
  dateOfApplication,
}: CandidateApplicationHeroProps) => {
  return (
    <Group>
      <Avatar
        size={"xl"}
        radius="xl"
        variant={!profilePhotoUrl ? "filled" : "light"}
        src={profilePhotoUrl}
      >
        {candidate.user?.username?.[0].toUpperCase() ?? "U"}
      </Avatar>
      <Stack spacing={2}>
        <ShowIfElse
          if={candidate.user.firstName && candidate.user.lastName}
          else={<Title order={3}>{candidate.user.username}</Title>}
        >
          <Title order={3}>
            {`${candidate.user.firstName} ${candidate.user.lastName}`}
          </Title>
        </ShowIfElse>
        <Group spacing={4}>
          <Text size={"sm"} color="dimmed">
            Applied for
          </Text>
          <Text size="sm" weight="bold">
            {jobTitle}
          </Text>
          <Text size="sm" color="dimmed">
            {" "}
            on {format(new Date(dateOfApplication), "MMMM dd, yyyy")}
          </Text>
        </Group>
      </Stack>
    </Group>
  );
};

export default CandidateApplicationHero;
