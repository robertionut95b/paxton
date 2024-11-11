import { APP_API_BASE_URL } from "@config/Properties";
import { GetUserProfileQuery } from "@gql/generated";
import {
  CalendarDaysIcon,
  ClipboardDocumentIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { User } from "@interfaces/user";
import { Avatar, Button, Group, Paper, Stack } from "@mantine/core";

type FeedPostingToolbarProps = {
  user: Partial<User> | null;
  up?: GetUserProfileQuery["getUserProfile"] | null;
};

const FeedPostingToolbar = ({ user, up }: FeedPostingToolbarProps) => {
  return (
    <Paper p="md" shadow="xs">
      <Stack>
        <Group noWrap>
          {up && (
            <Avatar
              radius="xl"
              size="md"
              src={
                up.userProfileAvatarImage &&
                `${APP_API_BASE_URL}/100x100/${up.userProfileAvatarImage.url}`
              }
            >
              {user?.firstName && user?.lastName
                ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
                : user?.username?.[0].toUpperCase()}
            </Avatar>
          )}
          <Button
            variant="outline"
            fullWidth
            styles={{
              inner: {
                justifyContent: "start",
              },
            }}
            leftIcon={<ClipboardDocumentIcon width={16} />}
            radius={"xl"}
          >
            Start a post
          </Button>
        </Group>
        <Group position="center" w="100%" noWrap={false} spacing={"xs"} grow>
          <Button
            variant="light"
            leftIcon={<PhotoIcon width={18} />}
            color="blue"
          >
            Photo
          </Button>
          <Button
            variant="light"
            leftIcon={<VideoCameraIcon width={18} />}
            color="red"
          >
            Video
          </Button>
          <Button
            variant="light"
            leftIcon={<CalendarDaysIcon width={18} />}
            color="orange"
          >
            Event
          </Button>
          <Button
            variant="light"
            leftIcon={<DocumentTextIcon width={18} />}
            color="grape"
          >
            Article
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default FeedPostingToolbar;
