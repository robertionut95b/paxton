import { gql, useMutation, useSubscription } from "@apollo/client";
import { useAuth } from "@auth/useAuth";
import ChatBubblesSkeleton from "@components/messaging/chat/ChatBubblesSkeleton";
import ChatRoomSkeleton from "@components/messaging/chat/ChatRoomSkeleton";
import ChatSection from "@components/messaging/chat/ChatSection";
import MessageAddForm from "@components/messaging/chat/MessageAddForm";
import { API_PAGINATION_SIZE, APP_API_BASE_URL } from "@constants/Properties";
import {
  AddMessageWithFileToChatDocument,
  AddMessageWithFileToChatMutation,
  AddMessageWithFileToChatMutationVariables,
  FieldType,
  GetChatLinesAdvSearchQuery,
  GetMessagesForChatIdDocument,
  GetMessagesForChatIdSubscription,
  GetMessagesForChatIdSubscriptionVariables,
  GetPrivateChatByUrlIdQuery,
  Operator,
  SortDirection,
  useAddMessageToChatMutation,
  useGetPrivateChatByUrlIdQuery,
  useGetUserProfileQuery,
  useInfiniteGetChatLinesAdvSearchQuery,
  useInfiniteGetMessagesPaginatedQuery,
  useMarkAllMessagesAsSeenMutation,
  useRemoveChatMutation,
} from "@gql/generated";
import {
  ArrowUturnLeftIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { GraphqlApiResponse } from "@interfaces/api.resp.types";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { graphqlUploadClient } from "@lib/graphqlUploadClient";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  Space,
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
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useSpinDelay } from "spin-delay";
import { useDebounceValue } from "usehooks-ts";

const ChatRoomPage = () => {
  const { chatId } = useParams();
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get("m") ?? "");
  const [debouncedSearch] = useDebounceValue<string>(search, 1000);
  const navigate = useNavigate();

  const chatPageSearchQuery = {
    filters: [
      {
        key: "users.id",
        value: String(user?.userId),
        operator: Operator.Equal,
        fieldType: FieldType.Long,
      },
      ...(debouncedSearch
        ? [
            {
              key: "messages.content",
              value: debouncedSearch ?? "",
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
    isError: isChatError,
    refetch: refetchChat,
  } = useGetPrivateChatByUrlIdQuery(
    graphqlRequestClient,
    {
      chatUrlId: chatId ?? "",
    },
    {
      select: (data) => ({
        getPrivateChatByUrlId: {
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
    isFetchingNextPage,
    refetch: refetchMessages,
    isError: isMessagesError,
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
      enabled: !(isInitialLoading || isChatError),
      refetchOnMount: true,
      onSuccess: (data) => {
        if (!data) return;
        // mark all messages as seen if either there are unread items or if the current user is not the one updating the chat
        if (
          (chatData?.getPrivateChatByUrlId.unreadMessagesCount ?? 0) > 0 &&
          chatData?.getPrivateChatByUrlId.latestMessage?.sender.id !==
            Number(user?.userId)
        ) {
          markAllMessagesAsSeen({
            chatId: Number(chatData?.getPrivateChatByUrlId.id ?? 0),
            userId: Number(user?.userId),
          });
        }
      },
    },
  );

  const { mutate: addMessageToChat, isLoading: isAddMessageToChatLoading } =
    useAddMessageToChatMutation(graphqlRequestClient);

  const [
    addMessageWithFileToChat,
    { loading: isAddMessageToChatWithFileLoading },
  ] = useMutation<
    AddMessageWithFileToChatMutation,
    AddMessageWithFileToChatMutationVariables
  >(
    gql`
      ${AddMessageWithFileToChatDocument}
    `,
    {
      client: graphqlUploadClient,
      onError: (err) => {
        showNotification({
          title: "Could not submit message",
          message: err.message,
          autoClose: 5000,
          icon: <ShieldExclamationIcon width={20} />,
        });
      },
    },
  );

  const addMessageLoding = useSpinDelay(
    isAddMessageToChatLoading || isAddMessageToChatWithFileLoading,
    { delay: 500, minDuration: 300 },
  );

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
                        (cl) => cl?.urlId === chatId,
                      )[0],
                  )[0];
                  const currentChatLine =
                    currentChatPage.getChatAdvSearch?.list?.filter(
                      (cl) => cl?.urlId === chatId,
                    )[0];
                  if (!currentChatLine) return;
                  // update the number of unread messages in Chat line
                  currentChatLine.unreadMessagesCount = 0;
                  currentChatLine.latestMessage =
                    data.markAllMessagesAsSeen?.latestMessage;
                })
              : prevData,
        );
        queryClient.setQueryData<InfiniteData<GetPrivateChatByUrlIdQuery>>(
          useGetPrivateChatByUrlIdQuery.getKey({ chatUrlId: chatId ?? "" }),
          (prevData) =>
            prevData
              ? produce(prevData, (draft) => {
                  if (!draft.pages) return;
                  const currentChatLine = draft.pages.filter(
                    (p) => p.getPrivateChatByUrlId?.urlId === chatId,
                  )[0].getPrivateChatByUrlId;
                  if (!currentChatLine) return;
                  currentChatLine.unreadMessagesCount = 0;
                  currentChatLine.latestMessage =
                    data.markAllMessagesAsSeen?.latestMessage;
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

  useSubscription<
    GetMessagesForChatIdSubscription,
    GetMessagesForChatIdSubscriptionVariables
  >(
    gql`
      ${GetMessagesForChatIdDocument}
    `,
    {
      variables: {
        auth: accessToken!,
        chatId: chatData?.getPrivateChatByUrlId?.id ?? 0,
      },
      onData: (opts) => {
        const newMessage = opts.data.data?.getMessagesForChatId;
        if (!newMessage) return;
        // update the chat section with the new message
        queryClient.setQueryData<typeof messagesData>(
          useInfiniteGetMessagesPaginatedQuery.getKey({ searchQuery }),
          (oldData) =>
            oldData
              ? produce(oldData, (draft) => {
                  const firstPage = draft.pages.filter((p) =>
                    p.getMessagesPaginated?.list?.filter(
                      (ch) => ch?.chat?.urlId === chatId,
                    ),
                  )[0];
                  if (firstPage.getMessagesPaginated) {
                    firstPage.getMessagesPaginated.list?.unshift(newMessage);
                    firstPage.getMessagesPaginated.totalElements += 1;
                  }
                })
              : oldData,
        );
        // update current chat query
        queryClient.setQueryData<GetPrivateChatByUrlIdQuery>(
          useGetPrivateChatByUrlIdQuery.getKey({ chatUrlId: chatId! }),
          (prevData) =>
            prevData
              ? produce(prevData, (draft) => {
                  const currentChat = draft.getPrivateChatByUrlId;
                  if (!currentChat) return;
                  currentChat.latestMessage = newMessage;
                  if (newMessage.sender.id !== Number(user?.userId)) {
                    currentChat.unreadMessagesCount += 1;
                  }
                })
              : prevData,
        );
        // update the current's chat line
        queryClient.setQueryData<InfiniteData<GetChatLinesAdvSearchQuery>>(
          useInfiniteGetChatLinesAdvSearchQuery.getKey({
            searchQuery: chatPageSearchQuery,
          }),
          (prevData) =>
            prevData
              ? produce(prevData, (draft) => {
                  const currentChatPage = draft.pages.filter((p) =>
                    p.getChatAdvSearch?.list?.filter(
                      (cl) => cl?.id === newMessage.id,
                    ),
                  )[0];
                  const currentChatLine =
                    currentChatPage.getChatAdvSearch?.list?.filter(
                      (cl) => cl?.id === newMessage?.chat?.id,
                    )[0];
                  // if chat exists, push the update to query data
                  if (currentChatLine) {
                    currentChatLine.latestMessage = newMessage;
                    if (newMessage.sender.id !== user?.userId)
                      currentChatLine.unreadMessagesCount += 1;
                  }
                })
              : prevData,
        );
        // mark all messages as seen if either there are unread items or if the current is the one updating the chat
        if ((chatData?.getPrivateChatByUrlId.unreadMessagesCount ?? 0) > 0) {
          markAllMessagesAsSeen({
            chatId: Number(chatData?.getPrivateChatByUrlId.id ?? 0),
            userId: Number(user?.userId),
          });
        }
      },
      skip: isInitialLoading || isChatError,
      shouldResubscribe: true,
      onError: (err) => {
        if (err.graphQLErrors?.[0].message.includes("null")) {
          // hacky way to solve null error
          // TODO: find a way to solve backend null error on URL path
          return navigate(0);
        }
        showNotification({
          title: "Chat service error",
          message: "Error when connecting to chat service",
          autoClose: 5000,
          icon: <ShieldExclamationIcon width={20} />,
        });
      },
    },
  );

  const users = chatData?.getPrivateChatByUrlId?.users ?? [];

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

  const submitMessage = (values: {
    content: string;
    senderUserId: number | undefined;
    fileUpload: unknown;
  }) => {
    if (!values.fileUpload) {
      addMessageToChat({
        MessageInput: {
          chatId: chatData?.getPrivateChatByUrlId.id ?? 0,
          content: values.content,
          senderUserId: Number(values.senderUserId),
        },
      });
    } else
      addMessageWithFileToChat({
        variables: {
          messageInput: {
            chatId: chatData?.getPrivateChatByUrlId.id ?? 0,
            senderUserId: Number(values.senderUserId),
          },
          // @ts-expect-error("types-error")
          fileUpload: values.fileUpload,
        },
      });
  };

  if (isInitialLoading) return <ChatRoomSkeleton />;

  if (
    isChatError &&
    error?.response.errors?.[0].message
      ?.toLocaleLowerCase()
      .includes("access denied")
  ) {
    return <Navigate to="/app/inbox/messages" />;
  }

  if (!chatData || isChatError || isMessagesError)
    return (
      <Center h={"100%"}>
        <Stack align="center">
          <Title order={4} mb={0} align="center">
            Something bad happened!
          </Title>
          <Text align="center" size="sm">
            Could not load this conversation, please try again later.
          </Text>
          <ActionIcon
            color="violet"
            onClick={() => {
              if (isChatError) refetchChat();
              if (isMessagesError) refetchMessages();
            }}
          >
            <ArrowUturnLeftIcon width={24} title="Retry" />
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
                u?.userProfile.userProfileAvatarImage &&
                `${APP_API_BASE_URL}/${u.userProfile.userProfileAvatarImage.url}`
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
          users?.[0]?.userProfile.userProfileAvatarImage &&
          `${APP_API_BASE_URL}/${users?.[0].userProfile.userProfileAvatarImage.url}`
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
          chatData={chatData.getPrivateChatByUrlId}
          chatName={chatName}
          avatar={avatar}
        />
        <ChatActionsMenu
          chatId={chatData.getPrivateChatByUrlId.id!}
          removeChat={removeChat}
        />
      </Group>
      <If condition={!isMessagesLoading}>
        <Then>
          <ChatSection
            currentUser={user}
            messages={messages}
            childrenPre={
              <When condition={hasNextPage}>
                <Button
                  compact
                  mt="xs"
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                  variant="light"
                  fullWidth
                >
                  Load more
                </Button>
              </When>
            }
            childrenPost={<Space h={5} />}
          />
        </Then>
        <Else>
          <Box my="xs">
            <ChatBubblesSkeleton />
          </Box>
        </Else>
      </If>
      <If condition={addMessageLoding}>
        <Then>
          <Flex mt="md" p="sm" justify="end" align="center" gap="xs">
            <Loader size="sm" variant="dots" />
          </Flex>
        </Then>
      </If>
      <Box className="flex-1">
        <Divider my={"xs"} />
        <MessageAddForm
          currentUser={user}
          onSubmit={submitMessage}
          currentUserAvatar={`${APP_API_BASE_URL}/${currentUserProfile?.getUserProfile?.userProfileAvatarImage?.url}`}
          disabled={isAddMessageToChatLoading}
        />
      </Box>
      <Outlet />
    </Stack>
  );
};

export default ChatRoomPage;
