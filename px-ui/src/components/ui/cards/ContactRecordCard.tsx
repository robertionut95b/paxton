import { Routes } from "@app/routes";
import { APP_API_BASE_URL } from "@config/Properties";
import { GetConnectionsForUserQuery } from "@gql/generated";
import { ClockIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Anchor, Avatar, Button, Group, Stack, Text } from "@mantine/core";
import { displayInitials } from "@utils/initials";
import { intlFormatDistance } from "date-fns";
import { When } from "react-if";
import { NavLink } from "react-router-dom";

type ContactItemData = NonNullable<
  NonNullable<
    NonNullable<GetConnectionsForUserQuery["getConnectionsForUser"]>["list"]
  >[number]
>["user"];

type ContactRecordCardProps = {
  userConnection: ContactItemData;
  createdAt?: Date;
  onClickMessage?: (c: ContactItemData) => void;
  onClickRemove?: (c: ContactItemData) => void;
};

const ContactRecordCard = ({
  userConnection,
  createdAt,
  onClickRemove,
  onClickMessage,
}: ContactRecordCardProps) => {
  const src = userConnection.userProfile.userProfileAvatarImage
    ? `${APP_API_BASE_URL}/${userConnection.userProfile.userProfileAvatarImage.url}`
    : undefined;
  return (
    <Group position="apart">
      <Group>
        <Avatar src={src} variant="filled" size={"lg"} radius={"xl"}>
          {displayInitials(
            "U",
            userConnection.firstName,
            userConnection.lastName,
          )}
        </Avatar>
        <Stack spacing={2}>
          <Anchor
            component={NavLink}
            to={Routes.UserProfile.buildPath({
              profileSlug: userConnection.userProfile.profileSlugUrl,
            })}
            variant="text"
          >
            <Text className="font-semibold capitalize">
              {userConnection.displayName}
            </Text>
            <Text size="sm" color="dimmed">
              {userConnection.userProfile.profileTitle}
            </Text>
            {createdAt && (
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
            )}
          </Anchor>
        </Stack>
      </Group>
      <When condition={!!onClickMessage || !!onClickRemove}>
        <Group spacing="xs">
          <When condition={!!onClickMessage}>
            <Button
              size="xs"
              variant="filled"
              leftIcon={<PaperAirplaneIcon width={16} />}
              onClick={() => onClickMessage?.(userConnection)}
            >
              Message
            </Button>
          </When>
          <When condition={!!onClickRemove}>
            <Button
              size="xs"
              variant="light"
              color="red"
              leftIcon={<TrashIcon width={16} />}
              onClick={() => onClickRemove?.(userConnection)}
            >
              Remove
            </Button>
          </When>
        </Group>
      </When>
    </Group>
  );
};

export default ContactRecordCard;
