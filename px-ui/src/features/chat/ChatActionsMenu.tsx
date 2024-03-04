import { RemoveChatMutationVariables } from "@gql/generated";
import {
  ArchiveBoxIcon,
  EllipsisVerticalIcon,
  FlagIcon,
  InboxStackIcon,
  PencilSquareIcon,
  StarIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { ActionIcon, Menu, Stack, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

type ChatActionsMenuProps = {
  chatId: number;
  removeChat: (variables: RemoveChatMutationVariables) => void;
};

const ChatActionsMenu = ({ removeChat, chatId }: ChatActionsMenuProps) => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon size="lg">
          <EllipsisVerticalIcon width={24} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>General settings</Menu.Label>
        <Menu.Item icon={<UsersIcon width={14} />}>Add people</Menu.Item>
        <Menu.Item icon={<PencilSquareIcon width={14} />}>
          Update title
        </Menu.Item>
        <Menu.Item icon={<StarIcon width={14} />}>Mark as favorite</Menu.Item>
        <Menu.Item icon={<FlagIcon width={14} />}>Report</Menu.Item>
        <Menu.Item icon={<ArchiveBoxIcon width={14} />}>Archive</Menu.Item>
        <Menu.Item icon={<InboxStackIcon width={14} />}>
          Mark as unread
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>Warning</Menu.Label>
        <Menu.Item
          icon={<TrashIcon width={14} />}
          onClick={() =>
            openConfirmModal({
              title: "Delete chat",
              children: (
                <Stack>
                  <Text size="sm">
                    Are you sure you want to delete this chat?
                  </Text>
                  <Text size="sm" weight="bold">
                    This action is irreversible!
                  </Text>
                </Stack>
              ),
              labels: { cancel: "Cancel", confirm: "Confirm" },
              confirmProps: { color: "red.7" },
              onCancel: () => null,
              onConfirm: () =>
                removeChat({
                  chatId: Number(chatId),
                }),
            })
          }
          color="red.8"
        >
          Remove conversation
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ChatActionsMenu;
