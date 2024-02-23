import { GetApplicationByIdQuery } from "@gql/generated";
import { Avatar, Group, Stack, Text, Title } from "@mantine/core";
import { format } from "date-fns";
import { Else, If, Then } from "react-if";

type CandidateApplicationHeroProps = {
  candidate: NonNullable<
    NonNullable<GetApplicationByIdQuery["getApplicationById"]>["candidate"]
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
        <If condition={candidate.user.firstName && candidate.user.lastName}>
          <Then>
            <Title order={3}>
              {`${candidate.user.firstName} ${candidate.user.lastName}`}
            </Title>
          </Then>
          <Else>
            <Title order={3}>{candidate.user.username}</Title>
          </Else>
        </If>
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
