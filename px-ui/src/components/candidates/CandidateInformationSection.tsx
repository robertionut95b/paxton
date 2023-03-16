import {
  ApplicationStatus,
  GetApplicationForJobListingRecruitmentQuery,
} from "@gql/generated";
import {
  Badge,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { prettyEnumValue } from "@utils/enumUtils";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";

type CandidateInformationSectionProps = {
  candidate: NonNullable<
    GetApplicationForJobListingRecruitmentQuery["getApplicationForJobListing"]
  >["candidate"];
  userProfileUrl: string;
  applicationStatus: ApplicationStatus;
};

const CandidateInformationSection = ({
  candidate: { user },
  userProfileUrl,
  applicationStatus,
}: CandidateInformationSectionProps) => {
  return (
    <Paper shadow={"xs"} p="md" h="100%">
      <Title order={4} mb={5}>
        Applicant information
      </Title>
      <Text color="dimmed" size="sm">
        Personal details of the applicant
      </Text>
      <Divider my="lg" />
      <Stack spacing={"xl"}>
        <Stack spacing={0}>
          <Title order={6} mb={5} color="dimmed" weight="normal">
            Profile
          </Title>
          <NavLink to={userProfileUrl}>
            <Text size="sm" variant="link">
              User&apos;s profile
            </Text>
          </NavLink>
        </Stack>
        <Group spacing={"xl"}>
          <Stack spacing={0}>
            <Title order={6} mb={5} color="dimmed" weight="normal">
              Full name
            </Title>
            <Text size="sm">{`${user.firstName} ${user.lastName}`}</Text>
          </Stack>
          <Stack spacing={0}>
            <Title order={6} mb={5} color="dimmed" weight="normal">
              Email address
            </Title>
            <Text size="sm">{user.email}</Text>
          </Stack>
          {user.birthDate && (
            <Stack spacing={0}>
              <Title order={6} mb={5} color="dimmed" weight="normal">
                Birthdate
              </Title>
              <Text size="sm">
                {format(new Date(user.birthDate), "MMMM dd, yyyy")}
              </Text>
            </Stack>
          )}
        </Group>
        {applicationStatus && (
          <Stack align={"flex-start"} spacing={0}>
            <Title order={6} mb={5} color="dimmed" weight="normal">
              Application status
            </Title>
            <Badge
              variant="dot"
              color={
                applicationStatus === ApplicationStatus.InProgress
                  ? "green"
                  : "red"
              }
            >
              {prettyEnumValue(applicationStatus)}
            </Badge>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default CandidateInformationSection;
