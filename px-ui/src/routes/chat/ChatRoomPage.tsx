import { useAuth } from "@auth/useAuth";
import ChatSection from "@components/messaging/chat/ChatSection";
import MessageAddForm from "@components/messaging/chat/MessageAddForm";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { APP_IMAGES_API_PATH } from "@constants/Properties";
import {
  FieldType,
  Operator,
  SortDirection,
  useAddMessageToChatMutation,
  useGetPrivateChatByIdQuery,
  useGetPrivateChatsByUserIdQuery,
  useInfiniteGetMessagesPaginatedQuery,
  useMarkAllMessagesAsSeenMutation,
} from "@gql/generated";
import { GraphqlApiResponse } from "@interfaces/api.resp.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import AccessDenied from "@routes/AccessDenied";
import { useQueryClient } from "@tanstack/react-query";
import { truncate } from "@utils/truncateText";
import { intlFormatDistance } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useDebounce } from "usehooks-ts";

const PAGE_SIZE = 10;

const ChatRoomPage = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get("m") ?? "");
  const debouncedSearch = useDebounce<string>(search, 1000);

  const searchQuery = useMemo(
    () => ({
      filters: [
        {
          key: "chat.id",
          value: chatId as string,
          operator: Operator.Equal,
          fieldType: FieldType.Long,
        },
        ...(debouncedSearch
          ? [
              {
                key: "content",
                value: debouncedSearch ?? "",
                operator: Operator.Like,
                fieldType: FieldType.Char,
              },
            ]
          : []),
      ],
      sorts: [
        {
          direction: SortDirection.Desc,
          key: "id",
        },
      ],
      page: 0,
      size: PAGE_SIZE,
    }),
    [chatId, debouncedSearch]
  );

  const {
    data: chatData,
    isInitialLoading,
    error,
    isError,
  } = useGetPrivateChatByIdQuery(
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

  const {
    data: messagesData,
    isInitialLoading: isMessagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteGetMessagesPaginatedQuery(
    "searchQuery",
    graphqlRequestClient,
    {
      searchQuery,
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const offset: number = (allPages.length ?? 1) * PAGE_SIZE + 1;
        const totalItems = lastPage.getMessagesPaginated?.totalElements ?? 0;
        const currPage = (lastPage.getMessagesPaginated?.page ?? 0) + 1;
        if (offset < totalItems)
          return {
            searchQuery: {
              ...searchQuery,
              page: currPage,
            },
          };
      },
    }
  );

  const { mutate: addMessageToChat } = useAddMessageToChatMutation(
    graphqlRequestClient,
    {
      onSuccess: (data) => {
        if (data.addMessageToChat) {
          queryClient.invalidateQueries(
            useInfiniteGetMessagesPaginatedQuery.getKey({
              searchQuery,
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

  const users = chatData?.getPrivateChatById?.users ?? [];
  const messages =
    messagesData?.pages
      .flatMap((p) => p.getMessagesPaginated?.list ?? [])
      .reverse() ?? [];

  useEffect(() => {
    setSearch(searchParams.get("m") ?? "");
  }, [location, searchParams]);

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

  if (
    isError &&
    (error as GraphqlApiResponse)?.response.errors?.[0].message
      ?.toLocaleLowerCase()
      .includes("access is denied")
  ) {
    return <AccessDenied />;
  }

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
              {chatData.getPrivateChatById.latestMessage ? (
                <Text size="xs">
                  Last activity:{" "}
                  {intlFormatDistance(
                    new Date(
                      chatData.getPrivateChatById.latestMessage.deliveredAt
                    ),
                    new Date()
                  )}
                </Text>
              ) : (
                <Text size="xs">Group chat</Text>
              )}
            </ShowIfElse>
          </Stack>
        </Group>
      </Group>
      <ShowIfElse
        if={!isMessagesLoading}
        else={
          <Center>
            <Loader size="sm" variant="dots" />
          </Center>
        }
      >
        <ShowIf if={hasNextPage}>
          <Button
            compact
            mt="xs"
            onClick={() => fetchNextPage()}
            loading={isFetching}
            variant="light"
          >
            Load more
          </Button>
        </ShowIf>
        <ChatSection height={720} currentUser={user} messages={messages} />
      </ShowIfElse>
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
