import { gql, useSubscription } from "@apollo/client";
import { useAuth } from "@auth/useAuth";
import ChatBubblesSkeleton from "@components/messaging/chat/ChatBubblesSkeleton";
import ChatRoomSkeleton from "@components/messaging/chat/ChatRoomSkeleton";
import ChatSection from "@components/messaging/chat/ChatSection";
import MessageAddForm from "@components/messaging/chat/MessageAddForm";
import {
  API_PAGINATION_SIZE,
  APP_IMAGES_API_PATH,
} from "@constants/Properties";
import {
  FieldType,
  GetChatLinesAdvSearchQuery,
  GetMessagesForChatIdDocument,
  GetMessagesForChatIdSubscription,
  GetMessagesForChatIdSubscriptionVariables,
  GetPrivateChatByIdQuery,
  Operator,
  SortDirection,
  useAddMessageToChatMutation,
  useGetPrivateChatByIdQuery,
  useGetPrivateChatByUrlIdQuery,
  useGetUserProfileQuery,
  useInfiniteGetChatLinesAdvSearchQuery,
  useInfiniteGetMessagesPaginatedQuery,
  useMarkAllMessagesAsSeenMutation,
  useRemoveChatMutation,
} from "@gql/generated";
import {
  ArrowUturnRightIcon,
  ShieldExclamationIcon,
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
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { truncate } from "@utils/truncateText";
import ChatActionsMenu from "features/chat/ChatActionsMenu";
import ChatTitleSection from "features/chat/ChatTitleSection";
import { produce } from "immer";
import { useEffect, useMemo, useState } from "react";
import { Else, If, Then, When } from "react-if";
import {
  NavLink,
  Navigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";

const ChatRoomPage = () => {
  const { chatId } = useParams();
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get("m") ?? "");
  const [debouncedSearch] = useDebounceValue<string>(search, 1000);

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
              fieldType: FieldType.String,
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
          key: "chat.urlId",
          value: chatId as string,
          operator: Operator.Equal,
          fieldType: FieldType.String,
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
    [chatId, debouncedSearch],
  );

  const { data: currentUserProfile } = useGetUserProfileQuery(
    graphqlRequestClient,
    {
      profileSlugUrl: user?.profileSlugUrl,
    },
  );

  const {
    data: chatData,
    isInitialLoading,
    error,
    isError,
    refetch,
  } = useGetPrivateChatByUrlIdQuery(
    graphqlRequestClient,
    {
      chatUrlId: chatId ?? "",
    },
    {
      select: (data) => ({
        getPrivateChatById: {
          ...data.getPrivateChatByUrlId,
          users: data?.getPrivateChatByUrlId?.users?.filter(
            (u) => String(u?.id) !== String(user?.userId),
          ),
        },
      }),
      onError: (error: GraphqlApiResponse) => {
        const err = error.response.errors?.[0];
        if (err && err.extensions.classification !== "PERMISSION_DENIED") {
          showNotification({
            title: "Unknown error",
            message: err.message,
            autoClose: 5000,
            icon: <ShieldExclamationIcon width={20} />,
          });
        }
      },
    },
  );

  const {
    data: messagesData,
    isInitialLoading: isMessagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteGetMessagesPaginatedQuery(
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
      enabled: !(isInitialLoading || isError),
    },
  );

  const { mutate: addMessageToChat } =
    useAddMessageToChatMutation(graphqlRequestClient);

  const { mutate: markAllMessagesAsSeen } = useMarkAllMessagesAsSeenMutation(
    graphqlRequestClient,
    {
      onSuccess: (data) => {
        queryClient.setQueryData<InfiniteData<GetChatLinesAdvSearchQuery>>(
          useInfiniteGetChatLinesAdvSearchQuery.getKey({
            searchQuery: chatPageSearchQuery,
          }),
          (prevData) =>
            prevData
              ? produce(prevData, (draft) => {
                  if (!draft.pages) return;
                  const currentChatPage = draft.pages.filter(
                    (p) =>
                      p.getChatAdvSearch?.list?.filter(
                        (cl) => cl?.id === Number(chatId),
                      )[0],
                  )[0];
                  const currentChatLine =
                    currentChatPage.getChatAdvSearch?.list?.filter(
                      (cl) => cl?.id === Number(chatId),
                    )[0];
                  if (currentChatLine) {
                    // update the number of unread messages in Chat line
                    currentChatLine.unreadMessagesCount = 0;
                    currentChatLine.latestMessage =
                      data.markAllMessagesAsSeen?.latestMessage;
                  }
                })
              : prevData,
        );
        queryClient.setQueryData<InfiniteData<GetPrivateChatByIdQuery>>(
          useGetPrivateChatByIdQuery.getKey({ chatId: Number(chatId) }),
          (prevData) =>
            prevData
              ? produce(prevData, (draft) => {
                  if (!draft.pages) return;
                  const currentChatLine = draft.pages.filter(
                    (p) => p.getPrivateChatById?.id === Number(chatId),
                  )[0].getPrivateChatById;
                  if (currentChatLine) {
                    currentChatLine.unreadMessagesCount = 0;
                    currentChatLine.latestMessage =
                      data.markAllMessagesAsSeen?.latestMessage;
                  }
                })
              : prevData,
        );
      },
    },
  );

  const { mutate: removeChat } = useRemoveChatMutation(graphqlRequestClient, {
    onSuccess: (data) => {
      if (data) {
        return window.location.replace("/app/inbox/messages");
      }
    },
    onError: (error: GraphqlApiResponse) => {
      const message = error.response.errors?.[0].message ?? "";
      if (message) {
        showNotification({
          title: "Unknown error",
          message,
          autoClose: 5000,
          icon: <ShieldExclamationIcon width={20} />,
        });
      }
    },
  });

  const { error: isSubError } = useSubscription<
    GetMessagesForChatIdSubscription,
    GetMessagesForChatIdSubscriptionVariables
  >(
    gql`
      ${GetMessagesForChatIdDocument}
    `,
    {
      variables: {
        auth: accessToken!,
        chatId: chatData?.getPrivateChatById?.id ?? 0,
      },
      onData: (opts) => {
        const newMessage = opts.data.data?.getMessagesForChatId;
        if (newMessage) {
          // update the chat section with the new message
          queryClient.setQueryData<typeof messagesData>(
            useInfiniteGetMessagesPaginatedQuery.getKey({ searchQuery }),
            (oldData) =>
              oldData
                ? produce(oldData, (draft) => {
                    const firstPage = draft.pages.filter((p) =>
                      p.getMessagesPaginated?.list?.filter(
                        (ch) => ch?.id === Number(chatId),
                      ),
                    )[0];
                    if (firstPage.getMessagesPaginated) {
                      firstPage.getMessagesPaginated.list?.unshift(newMessage);
                      firstPage.getMessagesPaginated.totalElements += 1;
                    }
                  })
                : oldData,
          );

          // update chatline
          queryClient.setQueryData<InfiniteData<GetChatLinesAdvSearchQuery>>(
            useInfiniteGetChatLinesAdvSearchQuery.getKey({
              searchQuery: chatPageSearchQuery,
            }),
            (prevData) =>
              prevData
                ? produce(prevData, (draft) => {
                    const currentChatPage = draft.pages.filter(
                      (p) =>
                        p.getChatAdvSearch?.list?.filter(
                          (cl) => cl?.id === Number(chatId),
                        )[0],
                    )[0];
                    const currentChatLine =
                      currentChatPage.getChatAdvSearch?.list?.filter(
                        (cl) => cl?.id === Number(chatId),
                      )[0];
                    if (currentChatLine) {
                      currentChatLine.latestMessage = newMessage;
                      if (newMessage.sender.id !== Number(user?.userId)) {
                        currentChatLine.unreadMessagesCount += 1;
                      }
                    }
                  })
                : prevData,
          );

          // update current chat query
          queryClient.setQueryData<GetPrivateChatByIdQuery>(
            useGetPrivateChatByIdQuery.getKey({ chatId: Number(chatId) }),
            (prevData) =>
              prevData
                ? produce(prevData, (draft) => {
                    const currentChat = draft.getPrivateChatById;
                    if (currentChat) {
                      currentChat.latestMessage = newMessage;
                      if (newMessage.sender.id !== Number(user?.userId)) {
                        currentChat.unreadMessagesCount += 1;
                      }
                    }
                  })
                : prevData,
          );
        }
      },
      skip: isInitialLoading || isError,
    },
  );

  const users = useMemo(
    () => chatData?.getPrivateChatById?.users ?? [],
    [chatData?.getPrivateChatById.users],
  );

  const messages = useMemo(
    () =>
      messagesData?.pages
        .flatMap((p) => p.getMessagesPaginated?.list ?? [])
        .reverse() ?? [],
    [messagesData?.pages],
  );

  useEffect(() => {
    setSearch(searchParams.get("m") ?? "");
  }, [location, searchParams]);

  useEffect(() => {
    // mark all messages as seen if either there are unread items or if the current user is not the one updating the chat
    if (
      (chatData?.getPrivateChatById.unreadMessagesCount ?? 0) > 0 &&
      chatData?.getPrivateChatById.latestMessage?.sender.id !==
        Number(user?.userId)
    ) {
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
        chatId: chatData?.getPrivateChatById.id ?? 0,
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
    return <Navigate to="/app/inbox/messages" />;
  }

  if (!chatData || isSubError)
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
          <Button variant="light" title="Back to conversations">
            <NavLink to="/app/inbox/messages">Back to conversations</NavLink>
          </Button>
        </Stack>
      </Center>
    );

  const avatar =
    (users?.length ?? 0) > 1 ? (
      <Avatar.Group spacing={20}>
        {users
          ?.slice(0, 2)
          .map((u) => (
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
          borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[4]}`,
        })}
      >
        <ChatTitleSection
          // @ts-expect-error("types-error")
          chatData={chatData.getPrivateChatById}
          chatName={chatName}
          avatar={avatar}
        />
        <ChatActionsMenu
          chatId={chatData.getPrivateChatById.id!}
          removeChat={removeChat}
        />
      </Group>
      <If condition={!isMessagesLoading}>
        <Then>
          <ChatSection
            height={720}
            currentUser={user}
            messages={messages}
            childrenPre={
              <When condition={hasNextPage}>
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
              </When>
            }
          />
        </Then>
        <Else>
          <Box my="xs">
            <ChatBubblesSkeleton />
          </Box>
        </Else>
      </If>
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
