import { APP_IMAGES_API_PATH } from "@constants/Properties";
import { GetAllJobListingsQuery, Recruiter } from "@gql/generated";
import {
  Avatar,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { NavLink } from "react-router-dom";

type JobMeetRecruitersSectionProps = {
  recruiter:
    | Recruiter
    | NonNullable<
        NonNullable<
          NonNullable<
            NonNullable<GetAllJobListingsQuery["getAllJobListings"]>["list"]
          >[number]
        >["recruiter"]
      >;
  isContactable?: boolean;
};

const JobMeetRecruitersSection = ({
  recruiter,
  isContactable = false,
}: JobMeetRecruitersSectionProps) => {
  return (
    <Paper shadow={"xs"} p="md">
      <Title mb={"md"} order={4}>
        Meet the recruiters
      </Title>
      <Group position="apart">
        <NavLink
          to={
            recruiter
              ? `/app/up/${recruiter.user.userProfile.profileSlugUrl}`
              : "#"
          }
        >
          <Group>
            <Avatar
              radius={"xl"}
              size={76}
              src={
                recruiter?.user.userProfile.photography
                  ? `${APP_IMAGES_API_PATH}/100x100/${recruiter?.user.userProfile.photography}`
                  : null
              }
            >
              {recruiter?.user.username?.[0].toUpperCase()}
            </Avatar>
            <Stack spacing={0}>
              <Text size="sm" weight="bold">
                {recruiter?.user.firstName && recruiter.user.lastName
                  ? `${recruiter.user.firstName} ${recruiter.user.lastName}`
                  : recruiter?.user.username}
              </Text>
              <Text size={"sm"}>
                {recruiter?.user.userProfile.profileTitle}
              </Text>
              <Text size={"xs"} color="dimmed">
                The person who posted this job listing
              </Text>
            </Stack>
          </Group>
        </NavLink>
        <Button disabled={isContactable}>
          <NavLink
            to={`/app/inbox/messages/chat/new?chatUser=${recruiter.user.id}`}
          >
            Message
          </NavLink>
        </Button>
      </Group>
    </Paper>
  );
};

export default JobMeetRecruitersSection;
