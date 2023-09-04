import { APP_IMAGES_API_PATH } from "@constants/Properties";
import { GetConnectionsForUserQuery } from "@gql/generated";
import { ClockIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Avatar, Button, Group, Stack, Text } from "@mantine/core";
import { displayInitials } from "@utils/initials";
import { intlFormatDistance } from "date-fns";

type ContactItemData = NonNullable<
  NonNullable<
    NonNullable<GetConnectionsForUserQuery["getConnectionsForUser"]>["list"]
  >[number]
>["requester"];

type ContactRecordProps = {
  userConnection: ContactItemData;
  createdAt: Date;
  onClickMessage: (c: ContactItemData) => void;
  onClickRemove: (c: ContactItemData) => void;
};

const ContactRecord = ({
  userConnection,
  createdAt,
  onClickRemove,
  onClickMessage,
}: ContactRecordProps) => {
  const src = userConnection.userProfile.photography
    ? `${APP_IMAGES_API_PATH}/100x100/${userConnection.userProfile.photography}`
    : undefined;
  return (
    <Group position="apart">
      <Group>
        <Avatar src={src} variant="filled" size={"lg"} radius={"xl"}>
          {displayInitials(
            "U",
            userConnection.firstName,
            userConnection.lastName
          )}
        </Avatar>
        <Stack spacing={2}>
          <Text className="font-semibold capitalize">
            {userConnection.displayName}
          </Text>
          <Text size="sm" color="dimmed">
            {userConnection.userProfile.profileTitle}
          </Text>
          <Group spacing={2}>
            <ClockIcon width={14} />
            <Text size={12} color="dimmed">
              Connected{" "}
              {intlFormatDistance(new Date(createdAt), new Date(), {
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
          leftIcon={<PaperAirplaneIcon width={16} />}
          onClick={() => onClickMessage(userConnection)}
        >
          Message
        </Button>
        <Button
          size="sm"
          variant="light"
          color="red"
          leftIcon={<TrashIcon width={16} />}
          onClick={() => onClickRemove(userConnection)}
        >
          Remove
        </Button>
      </Group>
    </Group>
  );
};

export default ContactRecord;
