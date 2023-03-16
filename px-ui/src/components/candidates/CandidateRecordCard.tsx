import { APP_IMAGES_API_PATH } from "@constants/Properties";
import {
  Application,
  ApplicationStatus,
  GetAllApplicationsQuery,
} from "@gql/generated";
import {
  ChatBubbleLeftEllipsisIcon,
  ClipboardDocumentListIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { prettyEnumValue } from "@utils/enumUtils";
import { intlFormatDistance } from "date-fns";
import { NavLink } from "react-router-dom";

type ApplicationRecordCardProps = {
  application:
    | Application
    | NonNullable<
        NonNullable<GetAllApplicationsQuery["getAllApplications"]>["list"]
      >[number];
};

const ApplicationRecordCard = ({ application }: ApplicationRecordCardProps) => {
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
                src={
                  userProfile.photography &&
                  `${APP_IMAGES_API_PATH}/100x100/${userProfile.photography}`
                }
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
          <Badge
            variant="dot"
            color={
              application?.status === ApplicationStatus.InProgress
                ? "green"
                : "red"
            }
          >
            {prettyEnumValue(
              application?.status ?? ApplicationStatus.InProgress
            )}
          </Badge>
          {application?.dateOfApplication && (
            <Text size="xs" color="dimmed">
              Applied{" "}
              {intlFormatDistance(
                new Date(application.dateOfApplication),
                new Date(),
                {
                  unit: "day",
                }
              )}
            </Text>
          )}
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
