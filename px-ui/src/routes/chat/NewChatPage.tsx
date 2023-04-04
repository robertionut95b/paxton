import { useAuth } from "@auth/useAuth";
import ChatLine from "@components/messaging/chat/ChatLine";
import ChatSection from "@components/messaging/chat/ChatSection";
import MessageAddForm from "@components/messaging/chat/MessageAddForm";
import { SelectItem } from "@components/select-items/SelectItem";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { APP_IMAGES_API_PATH } from "@constants/Properties";
import {
  ChatType,
  FieldType,
  Operator,
  SortDirection,
  useAddMessageToChatMutation,
  useCreateChatMutation,
  useGetAllUsersQuery,
  useGetChatAdvSearchQuery,
  useInfiniteGetChatLinesAdvSearchQuery,
} from "@gql/generated";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Box,
  Button,
  Divider,
  MultiSelect,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { PAGE_SIZE } from "@routes/ChatPage";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const NewChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [usrSearch, setUsrSearch] = useState("");
  const [searchParams] = useSearchParams();
  const [searchUsers, setSearchUsers] = useState<string[]>([]);
  const chatPageSearchQuery = {
    filters: [
      {
        key: "users.id",
        value: user?.userId as string,
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
    size: PAGE_SIZE,
  };

  const { data: userData } = useGetAllUsersQuery(
    graphqlRequestClient,
    {},
    {
      enabled: usrSearch.length > 1,
      select: (data) =>
        data.getAllUsers?.filter((u) => String(u?.id) !== String(user?.userId)),
    }
  );

  const { data: chatSearchByMembersData } = useGetChatAdvSearchQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        filters: [
          ...searchUsers.map((s) => ({
            fieldType: FieldType.Long,
            key: "users.id",
            operator: Operator.Equal,
            value: s,
          })),
          {
            fieldType: FieldType.Long,
            key: "users.id",
            operator: Operator.Equal,
            value: String(user?.userId),
          },
        ],
      },
    },
    {
      enabled: searchUsers.length > 0,
      select: (data) => ({
        ...data,
        getChatAdvSearch: {
          ...data.getChatAdvSearch,
          list: data.getChatAdvSearch?.list?.map((e) => ({
            ...e,
            id: e?.id as string,
            unreadMessagesCount: e?.unreadMessagesCount as number,
            users: e?.users?.filter(
              (u) => String(u?.id) !== String(user?.userId)
            ),
          })),
        },
      }),
    }
  );

  const { mutateAsync: createChat, isSuccess: isSuccessCreateChat } =
    useCreateChatMutation(graphqlRequestClient);

  const { mutate: addMessageToChat } = useAddMessageToChatMutation(
    graphqlRequestClient,
    {
      onSuccess: (data) => {
        if (isSuccessCreateChat) {
          queryClient.invalidateQueries(
            useInfiniteGetChatLinesAdvSearchQuery.getKey({
              searchQuery: chatPageSearchQuery,
            })
          );
          navigate(`/app/inbox/messages/chat/${data?.addMessageToChat?.id}`);
        }
      },
    }
  );

  const individualChatsCount =
    chatSearchByMembersData?.getChatAdvSearch?.totalElements ?? 0;

  const submitMessage = async (values: {
    content: string;
    senderUserId: string | undefined;
  }) => {
    if (individualChatsCount > 0 && individualChatsCount <= 1) {
      addMessageToChat({
        MessageInput: {
          chatId: chatSearchByMembersData?.getChatAdvSearch?.list?.[0]
            ?.id as string,
          content: values.content,
          senderUserId: values.senderUserId as string,
        },
      });
    } else {
      if (!user?.userId) return;
      const data = await createChat({
        ChatInput: {
          users: [user.userId, ...searchUsers],
          messages: [],
          chatType: ChatType.PrivateChat,
        },
      });
      if (data) {
        addMessageToChat({
          MessageInput: {
            chatId: data.createChat?.id as string,
            content: values.content,
            senderUserId: values.senderUserId as string,
          },
        });
        navigate(`/app/inbox/messages/chat/${data?.createChat?.id}`);
        queryClient.invalidateQueries(
          useInfiniteGetChatLinesAdvSearchQuery.getKey({
            searchQuery: chatPageSearchQuery,
          })
        );
      }
    }
  };

  const createNewChat = async () => {
    if (!user?.userId) return;
    const data = await createChat({
      ChatInput: {
        users: [user.userId, ...searchUsers],
        messages: [],
        chatType: ChatType.PrivateChat,
      },
    });
    queryClient.invalidateQueries(
      useInfiniteGetChatLinesAdvSearchQuery.getKey({
        searchQuery: chatPageSearchQuery,
      })
    );
    if (data) navigate(`/app/inbox/messages/chat/${data?.createChat?.id}`);
  };

  const users = (userData ?? []).map((u) => ({
    value: u?.id ?? "",
    label: `${u?.firstName} ${u?.lastName}`,
    image:
      u?.userProfile.photography &&
      `${APP_IMAGES_API_PATH}/100x100/${u.userProfile.photography}`,
    description: u?.userProfile.profileTitle,
  }));

  const chatLines = chatSearchByMembersData?.getChatAdvSearch?.list ?? [];

  const chatMessages =
    chatSearchByMembersData?.getChatAdvSearch?.list?.[0]?.messages ?? [];

  return (
    <Stack spacing={6} justify="space-between" h={"100%"}>
      <Box>
        <Title order={5} mb={12}>
          New message
        </Title>
        <Divider mt={20} mb={12} />
        <MultiSelect
          data={users}
          placeholder="Choose one or more names"
          clearable
          searchable
          limit={10}
          itemComponent={SelectItem}
          searchValue={usrSearch}
          onSearchChange={setUsrSearch}
          rightSection={<ChevronDownIcon width={16} />}
          value={searchUsers}
          onChange={setSearchUsers}
        />
      </Box>
      <ShowIfElse
        if={individualChatsCount > 1}
        else={
          <div className="h-full grow">
            <ChatSection currentUser={user} messages={chatMessages} />
            <ShowIf if={searchUsers.length > 0}>
              <Divider />
              <Stack justify="center" align="center" spacing="xs">
                <Text size="sm" my="xs" align="center" weight="bold">
                  Or create a new one
                </Text>
                <Button onClick={createNewChat} fullWidth={false}>
                  New chat
                </Button>
              </Stack>
            </ShowIf>
          </div>
        }
      >
        <Stack className="h-full grow" spacing={0}>
          <Text size="sm" my="xs" align="center" weight="bold">
            Select a chat ...
          </Text>
          <Divider />
          {chatLines.map((c) => (
            <div key={c?.id}>
              <ChatLine chat={c} />
            </div>
          ))}
          <Divider />
          <Stack justify="center" align="center" spacing="xs">
            <Text size="sm" my="xs" align="center" weight="bold">
              Or create a new one
            </Text>
            <Button onClick={createNewChat} fullWidth={false}>
              New chat
            </Button>
          </Stack>
        </Stack>
      </ShowIfElse>
      <Box>
        <Divider my={"xs"} />
        <MessageAddForm
          currentUser={user}
          onSubmit={submitMessage}
          currentUserAvatar={null}
          disabled={individualChatsCount > 1}
        />
      </Box>
    </Stack>
  );
};

export default NewChatPage;
