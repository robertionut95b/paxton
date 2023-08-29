import { GetConnectionInvitationsForUserQuery } from "@gql/generated";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Group, Stack, Text } from "@mantine/core";
import { displayInitials } from "@utils/initials";

type InvitationItemData = NonNullable<
  NonNullable<
    NonNullable<
      GetConnectionInvitationsForUserQuery["getConnectionInvitationsForUser"]
    >["list"]
  >[number]
>;

type InvitationProps = {
  data: InvitationItemData;
  onAccept: (data: InvitationItemData) => void;
  onDecline: (data: InvitationItemData) => void;
};

const Invitation = ({ data, onAccept, onDecline }: InvitationProps) => {
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
          <Text size="sm">{data.requester.userProfile.profileTitle}</Text>
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

export default Invitation;
