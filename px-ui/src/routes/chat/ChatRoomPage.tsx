import { useAuth } from "@auth/useAuth";
import ChatSection from "@components/messaging/chat/ChatSection";
import MessageAddForm from "@components/messaging/chat/MessageAddForm";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { APP_IMAGES_API_PATH } from "@constants/Properties";
import {
  useAddMessageToChatMutation,
  useGetPrivateChatByIdQuery,
  useGetPrivateChatsByUserIdQuery,
  useMarkAllMessagesAsSeenMutation,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Avatar,
  Box,
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { truncate } from "@utils/truncateText";
import { intlFormatDistance } from "date-fns";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ChatRoomPage = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: chatData, isInitialLoading } = useGetPrivateChatByIdQuery(
    graphqlRequestClient,
    {
      chatId: chatId as string,
    },
    {
      select: (data) => ({
        getPrivateChatById: {
          ...data.getPrivateChatById,
          users: data?.getPrivateChatById?.users?.filter(
            (u) => String(u?.id) !== String(user?.userId)
          ),
        },
      }),
    }
  );

  const { mutate: addMessageToChat } = useAddMessageToChatMutation(
    graphqlRequestClient,
    {
      onSuccess: (data) => {
        if (data.addMessageToChat) {
          queryClient.invalidateQueries(
            useGetPrivateChatByIdQuery.getKey({
              chatId: chatId as string,
            })
          );
          queryClient.invalidateQueries(
            useGetPrivateChatsByUserIdQuery.getKey({
              userId: user?.userId as string,
            })
          );
        }
      },
    }
  );

  const { mutate: markAllMessagesAsSeen } = useMarkAllMessagesAsSeenMutation(
    graphqlRequestClient,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          useGetPrivateChatsByUserIdQuery.getKey({
            userId: user?.userId as string,
          })
        );
      },
    }
  );

  const messages = chatData?.getPrivateChatById?.messages ?? [];
  const users = chatData?.getPrivateChatById?.users ?? [];

  useEffect(() => {
    if ((chatData?.getPrivateChatById.unreadMessagesCount ?? 0) > 0) {
      markAllMessagesAsSeen({
        chatId: chatId as string,
        userId: user?.userId as string,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData?.getPrivateChatById.unreadMessagesCount, chatId, user?.userId]);

  const submitMessage = (values: {
    content: string;
    senderUserId: string | undefined;
  }) => {
    addMessageToChat({
      MessageInput: {
        chatId: chatId as string,
        content: values.content,
        senderUserId: values.senderUserId as string,
      },
    });
  };

  if (isInitialLoading) return <Loader size="sm" />;

  if (!chatData)
    return (
      <Center h={"100%"}>
        <Stack>
          <Title order={4} mb={0} align="center">
            We are sorry, an error has ocurred!
          </Title>
          <Text align="center" size="sm">
            It seems we could not load this conversation, please try again
            later.
          </Text>
        </Stack>
      </Center>
    );

  const avatar =
    (users?.length ?? 0) > 1 ? (
      <Avatar.Group spacing={20}>
        {users?.slice(0, 2).map((u) => (
          <Avatar
            key={u?.id}
            src={
              u?.userProfile.photography &&
              `${APP_IMAGES_API_PATH}/100x100/${u.userProfile.photography}`
            }
            size="md"
            title={u?.username}
            radius="xl"
          />
        ))}
        {(users?.length ?? 1) > 2 && (
          <Avatar size={35} radius="xl">
            +{(users?.length ?? 1) - 2}
          </Avatar>
        )}
      </Avatar.Group>
    ) : (
      <Avatar
        key={users?.[0]?.id}
        src={
          users?.[0]?.userProfile.photography &&
          `${APP_IMAGES_API_PATH}/100x100/${users?.[0].userProfile.photography}`
        }
        size="md"
        title={users?.[0]?.username}
        radius="xl"
      />
    );

  const chatName =
    (users?.length ?? 0) > 1
      ? truncate(users?.map((u) => `${u?.firstName}`).join(", "), 25)
      : `${users?.[0]?.firstName} ${users?.[0]?.lastName}`;

  return (
    <Stack spacing={0} h={"100%"} justify="space-between">
      <Group spacing={5} className="border-b">
        {avatar}
        <Group pb={5}>
          <Stack spacing={0}>
            <Text weight="bold" size="sm">
              {chatData.getPrivateChatById.title ?? chatName}
            </Text>
            <ShowIfElse
              if={users.length > 1}
              else={
                <Text className="line-clamp-1" size="xs">
                  {
                    chatData.getPrivateChatById.users?.[0]?.userProfile
                      .profileTitle
                  }
                </Text>
              }
            >
              {chatData.getPrivateChatById.latestMessage && (
                <Text size="xs">
                  Last activity:{" "}
                  {intlFormatDistance(
                    new Date(
                      chatData.getPrivateChatById.latestMessage.deliveredAt
                    ),
                    new Date()
                  )}
                </Text>
              )}
            </ShowIfElse>
          </Stack>
        </Group>
      </Group>
      <ChatSection height={720} currentUser={user} messages={messages} />
      <Box>
        <Divider my={"xs"} />
        <MessageAddForm
          currentUser={user}
          onSubmit={submitMessage}
          currentUserAvatar={null}
        />
      </Box>
    </Stack>
  );
};

export default ChatRoomPage;
