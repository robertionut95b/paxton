import { GetPrivateChatByIdQuery } from "@gql/generated";
import { Group, Stack, Text } from "@mantine/core";
import { intlFormatDistance } from "date-fns";
import { useMemo } from "react";
import { Else, If, Then } from "react-if";

type ChatTitleSectionProps = {
  avatar?: JSX.Element;
  chatName: string;
  chatData: NonNullable<GetPrivateChatByIdQuery["getPrivateChatById"]>;
};

const ChatTitleSection = ({
  avatar,
  chatData,
  chatName,
}: ChatTitleSectionProps) => {
  const users = useMemo(() => chatData?.users ?? [], [chatData.users]);

  return (
    <Group>
      {avatar}
      <Group pb={5}>
        <Stack spacing={0}>
          <Text weight="bold" size="sm">
            {chatData.title ?? chatName}
          </Text>
          <If condition={users.length > 1}>
            <Then>
              <If condition={!!chatData.latestMessage}>
                <Then>
                  <Text size="xs">
                    Last activity:{" "}
                    {chatData.latestMessage?.deliveredAt &&
                      intlFormatDistance(
                        new Date(chatData.latestMessage?.deliveredAt),
                        new Date(),
                      )}
                  </Text>
                </Then>
                <Else>
                  <Text size="xs">Group chat</Text>
                </Else>
              </If>
            </Then>
            <Else>
              <Text className="line-clamp-1" size="xs">
                {chatData.users?.[0]?.userProfile.profileTitle}
              </Text>
            </Else>
          </If>
        </Stack>
      </Group>
    </Group>
  );
};

export default ChatTitleSection;
