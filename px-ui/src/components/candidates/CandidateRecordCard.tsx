import { APP_API_BASE_URL } from "@constants/Properties";
import { Application, GetAllApplicationsQuery } from "@gql/generated";
import {
  ChatBubbleLeftEllipsisIcon,
  ClipboardDocumentListIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";
import { ActionIcon, Avatar, Group, Paper, Stack, Text } from "@mantine/core";
import { NavLink } from "react-router-dom";

type ApplicationRecordCardProps = {
  candidate:
    | Application
    | NonNullable<
        NonNullable<GetAllApplicationsQuery["getAllApplications"]>["list"]
      >[number];
};

const ApplicationRecordCard = ({
  candidate: application,
}: ApplicationRecordCardProps) => {
  const user = application?.candidate.user;
  const userProfile = application?.applicantProfile;
  return (
    <Paper>
      <Group position="apart" align="center">
        <NavLink to={`/app/up/${userProfile?.profileSlugUrl}`}>
          <Group align="center">
            {userProfile && (
              <Avatar
                size={"lg"}
                radius="xl"
                src={`${APP_API_BASE_URL}/${userProfile.photography}`}
              >
                {user?.username?.[0].toUpperCase() ?? "U"}
              </Avatar>
            )}
            <Stack spacing={2}>
              <Text weight="bold" size="md" variant="link">
                {user?.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username}
              </Text>
              <Text size={"sm"} color="dimmed">
                {userProfile?.profileTitle && userProfile.profileTitle}
              </Text>
            </Stack>
          </Group>
        </NavLink>
        <Group spacing={"xs"}>
          <ActionIcon
            variant="subtle"
            size="md"
            title="See the application process"
            component={NavLink}
            to={`applications/${application?.id}`}
          >
            <ClipboardDocumentListIcon />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            size="md"
            title="Actions on the candidate's application"
          >
            <EllipsisHorizontalCircleIcon />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            size="md"
            title="Write a message to candidate"
          >
            <ChatBubbleLeftEllipsisIcon />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
};

export default ApplicationRecordCard;
