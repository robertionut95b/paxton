import { GetConnectionInvitationsForUserQuery } from "@gql/generated";
import { CheckIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Group, Stack, Text } from "@mantine/core";
import { displayInitials } from "@utils/initials";
import { intlFormatDistance } from "date-fns";

type UserInvitationItemData = NonNullable<
  NonNullable<
    NonNullable<
      GetConnectionInvitationsForUserQuery["getNewConnectionForUser"]
    >["list"]
  >[number]
>;

type UserInvitationProps = {
  data: UserInvitationItemData;
  onAccept: (data: UserInvitationItemData) => void;
  onDecline: (data: UserInvitationItemData) => void;
};

const UserInvitation = ({ data, onAccept, onDecline }: UserInvitationProps) => {
  const src = data.requester.userProfile.photography ?? undefined;
  return (
    <Group position="apart">
      <Group>
        <Avatar src={src} variant="filled" size={"lg"} radius={"xl"}>
          {displayInitials(
            "U",
            data.requester.firstName,
            data.requester.lastName
          )}
        </Avatar>
        <Stack spacing={2}>
          <Text className="capitalize">{data.requester.displayName}</Text>
          <Text size="sm" color="dimmed">
            {data.requester.userProfile.profileTitle}
          </Text>
          <Group spacing={2}>
            <ClockIcon width={14} />
            <Text size={12} color="dimmed">
              Sent{" "}
              {intlFormatDistance(new Date(data.lastModified), new Date(), {
                unit: "day",
                style: "narrow",
              })}
            </Text>
          </Group>
        </Stack>
      </Group>
      <Group spacing="xs">
        <Button
          size="sm"
          variant="filled"
          leftIcon={<CheckIcon width={16} />}
          onClick={() => onAccept(data)}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="default"
          leftIcon={<XMarkIcon width={16} />}
          onClick={() => onDecline(data)}
        >
          Decline
        </Button>
      </Group>
    </Group>
  );
};

export default UserInvitation;
