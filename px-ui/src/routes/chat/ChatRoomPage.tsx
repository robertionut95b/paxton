import { useAuth } from "@auth/useAuth";
import ChatRoomSkeleton from "@components/messaging/chat/ChatRoomSkeleton";
import ChatSection from "@components/messaging/chat/ChatSection";
import MessageAddForm from "@components/messaging/chat/MessageAddForm";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  API_PAGINATION_SIZE,
  APP_IMAGES_API_PATH,
} from "@constants/Properties";
import {
  FieldType,
  Operator,
  SortDirection,
  useAddMessageToChatMutation,
  useGetPrivateChatByIdQuery,
  useGetUserProfileQuery,
  useInfiniteGetChatLinesAdvSearchQuery,
  useInfiniteGetMessagesPaginatedQuery,
  useMarkAllMessagesAsSeenMutation,
  useRemoveChatMutation,
} from "@gql/generated";
import {
  ArchiveBoxIcon,
  ArrowUturnRightIcon,
  EllipsisVerticalIcon,
  FlagIcon,
  InboxStackIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { GraphqlApiResponse } from "@interfaces/api.resp.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Menu,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import AccessDenied from "@routes/AccessDenied";
import { useQueryClient } from "@tanstack/react-query";
import { truncate } from "@utils/truncateText";
import { intlFormatDistance } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useDebounce } from "usehooks-ts";

const ChatRoomPage = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get("m") ?? "");
  const debouncedSearch = useDebounce<string>(search, 1000);

  const chatPageSearchQuery = {
    filters: [
      {
        key: "users.id",
        value: String(user?.userId),
        operator: Operator.Equal,
        fieldType: FieldType.Long,
      },
      ...(searchParams.get("m")
        ? [
            {
              key: "messages.content",
              value: searchParams.get("m") ?? "",
              operator: Operator.Like,
              fieldType: FieldType.Char,
            },
          ]
        : []),
    ],
    sorts: [
      {
        direction: SortDirection.Desc,
        key: "modifiedAt",
      },
    ],
    page: 0,
    size: API_PAGINATION_SIZE,
  };

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
      size: API_PAGINATION_SIZE,
    }),
    [chatId, debouncedSearch]
  );

  const { data: currentUserProfile } = useGetUserProfileQuery(
    graphqlRequestClient,
    {
      profileSlugUrl: user?.profileSlugUrl,
    }
  );

  const {
    data: chatData,
    isInitialLoading,
    error,
    isError,
    refetch,
  } = useGetPrivateChatByIdQuery(
    graphqlRequestClient,
    {
      chatId: Number(chatId),
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
        const offset: number = (allPages.length ?? 1) * API_PAGINATION_SIZE;
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
            useInfiniteGetChatLinesAdvSearchQuery.getKey({
              searchQuery: chatPageSearchQuery,
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
          useInfiniteGetChatLinesAdvSearchQuery.getKey({
            searchQuery: chatPageSearchQuery,
          })
        );
      },
    }
  );

  const { mutate: removeChat } = useRemoveChatMutation(graphqlRequestClient, {
    onSuccess: (data) => {
      if (data) {
        return window.location.replace("/app/inbox/messages");
      }
    },
  });

  const users = useMemo(
    () => chatData?.getPrivateChatById?.users ?? [],
    [chatData?.getPrivateChatById.users]
  );

  const messages = useMemo(
    () =>
      messagesData?.pages
        .flatMap((p) => p.getMessagesPaginated?.list ?? [])
        .reverse() ?? [],
    [messagesData?.pages]
  );

  useEffect(() => {
    setSearch(searchParams.get("m") ?? "");
  }, [location, searchParams]);

  useEffect(() => {
    if ((chatData?.getPrivateChatById.unreadMessagesCount ?? 0) > 0) {
      markAllMessagesAsSeen({
        chatId: Number(chatId),
        userId: Number(user?.userId),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData?.getPrivateChatById.unreadMessagesCount, chatId, user?.userId]);

  const submitMessage = (values: {
    content: string;
    senderUserId: number | undefined;
  }) => {
    addMessageToChat({
      MessageInput: {
        chatId: Number(chatId),
        content: values.content,
        senderUserId: Number(values.senderUserId),
      },
    });
  };

  if (isInitialLoading) return <ChatRoomSkeleton />;

  if (
    isError &&
    (error as GraphqlApiResponse)?.response.errors?.[0].message
      ?.toLocaleLowerCase()
      .includes("access denied")
  ) {
    return <AccessDenied />;
  }

  if (!chatData)
    return (
      <Center h={"100%"}>
        <Stack align="center">
          <Title order={4} mb={0} align="center">
            Something bad happened!
          </Title>
          <Text align="center" size="sm">
            Could not load this conversation, please try again later.
          </Text>
          <ActionIcon color="violet" onClick={() => refetch()}>
            <ArrowUturnRightIcon width={24} title="Retry" />
          </ActionIcon>
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
            color="violet.3"
          />
        ))}
        {(users?.length ?? 1) > 2 && (
          <Avatar size={35} radius="xl" color="violet.3">
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
        color="violet.3"
      />
    );

  const chatName =
    (users?.length ?? 0) > 1
      ? truncate(users?.map((u) => `${u?.firstName}`).join(", "), 25)
      : `${users?.[0]?.firstName} ${users?.[0]?.lastName}`;

  return (
    <Stack className="h-full" spacing={0}>
      <Group
        position="apart"
        align="center"
        spacing={5}
        sx={(theme) => ({
          borderBottom: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.gray[8]
              : theme.colors.gray[4]
          }`,
        })}
      >
        <Group>
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
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon size="lg">
              <EllipsisVerticalIcon width={24} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>General settings</Menu.Label>
            <Menu.Item icon={<StarIcon width={14} />}>
              Mark as favorite
            </Menu.Item>
            <Menu.Item icon={<FlagIcon width={14} />}>Report chat</Menu.Item>
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
              Delete conversation
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <ShowIfElse
        if={!isMessagesLoading}
        else={
          <Center>
            <Loader size="sm" variant="dots" />
          </Center>
        }
      >
        <ChatSection
          height={720}
          currentUser={user}
          messages={messages}
          childrenPre={
            <ShowIf if={hasNextPage}>
              <Button
                compact
                mt="xs"
                onClick={() => fetchNextPage()}
                loading={isFetching}
                variant="light"
                fullWidth
              >
                Load more
              </Button>
            </ShowIf>
          }
        />
      </ShowIfElse>
      <Box className="flex-1">
        <Divider my={"xs"} />
        <MessageAddForm
          currentUser={user}
          onSubmit={submitMessage}
          currentUserAvatar={currentUserProfile?.getUserProfile?.photography}
        />
      </Box>
    </Stack>
  );
};

export default ChatRoomPage;
