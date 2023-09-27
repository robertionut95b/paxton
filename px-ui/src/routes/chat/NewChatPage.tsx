import { useAuth } from "@auth/useAuth";
import ChatLine from "@components/messaging/chat/ChatLine";
import ChatSection from "@components/messaging/chat/ChatSection";
import MessageAddForm from "@components/messaging/chat/MessageAddForm";
import { SelectItem } from "@components/select-items/SelectItem";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import {
  API_PAGINATION_SIZE,
  APP_IMAGES_API_PATH,
} from "@constants/Properties";
import {
  ChatType,
  FieldType,
  Operator,
  SortDirection,
  useAddMessageToChatMutation,
  useCreateChatMutation,
  useGetAllUsersPagedQuery,
  useGetChatsWithUsersIdsQuery,
  useGetPrivateChatByIdQuery,
  useInfiniteGetChatLinesAdvSearchQuery,
  useInfiniteGetMessagesPaginatedQuery,
} from "@gql/generated";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Box,
  Button,
  Divider,
  SelectItem as ISelectItem,
  MultiSelect,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { PAGE_SIZE } from "@routes/ChatPage";
import { useQueryClient } from "@tanstack/react-query";
import { uniqBy } from "lodash/fp";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "usehooks-ts";

const NewChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const pChatUser = searchParams.get("chatUser") ?? null;
  const [usrSearch, setUsrSearch] = useState("");
  const usrSearchDebounced = useDebounce<string>(usrSearch, 1000);
  const [searchUsers, setSearchUsers] = useState<string[]>([]);
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
    size: PAGE_SIZE,
  };
  const [usersSelectItems, setUsersSelectItem] = useState<ISelectItem[]>([]);

  const { data: userData } = useGetAllUsersPagedQuery(
    graphqlRequestClient,
    {
      searchQuery: {
        page: 0,
        size: API_PAGINATION_SIZE,
        filters: [
          ...(pChatUser
            ? [
                {
                  fieldType: FieldType.Long,
                  key: "id",
                  operator: Operator.Equal,
                  value: pChatUser,
                },
              ]
            : usrSearchDebounced.length > 1
            ? [
                {
                  fieldType: FieldType.String,
                  key: "firstName",
                  operator: Operator.Like,
                  value: usrSearchDebounced,
                },
              ]
            : []),
        ],
      },
    },
    {
      enabled: usrSearchDebounced.length > 1 || !!pChatUser,
      select: (data) =>
        data.getAllUsersPaged?.list?.filter(
          (u) => String(u?.id) !== String(user?.userId)
        ),
    }
  );

  const { data: chatSearchByMembersData } = useGetChatsWithUsersIdsQuery(
    graphqlRequestClient,
    {
      userIds: [...searchUsers.map((u) => Number(u)), user?.userId ?? 0],
    },
    {
      enabled: searchUsers.length > 0,
      select: (data) =>
        data.getChatsWithUsersIds?.map((c) => ({
          ...c,
          users: c?.users?.filter(
            (u) => String(u?.id) !== String(user?.userId)
          ),
        })),
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

  const individualChatsCount = chatSearchByMembersData?.length ?? 0;

  const submitMessage = async (values: {
    content: string;
    senderUserId: number | undefined;
  }) => {
    if (individualChatsCount > 0 && individualChatsCount <= 1) {
      addMessageToChat({
        MessageInput: {
          chatId: chatSearchByMembersData?.[0]?.id ?? 0,
          content: values.content,
          senderUserId: Number(values.senderUserId) ?? 0,
        },
      });
      await queryClient.invalidateQueries(
        useGetPrivateChatByIdQuery.getKey({
          chatId: chatSearchByMembersData?.[0]?.id ?? 0,
        })
      );
      await queryClient.invalidateQueries(
        useInfiniteGetMessagesPaginatedQuery.getKey({
          searchQuery: {
            filters: [
              {
                key: "chat.id",
                value: String(chatSearchByMembersData?.[0]?.id) ?? "",
                operator: Operator.Equal,
                fieldType: FieldType.Long,
              },
            ],
            sorts: [
              {
                direction: SortDirection.Desc,
                key: "id",
              },
            ],
            page: 0,
            size: API_PAGINATION_SIZE,
          },
        })
      );
      return navigate(
        `/app/inbox/messages/chat/${chatSearchByMembersData?.[0]?.id}`
      );
    } else {
      if (!user?.userId) return;
      const data = await createChat({
        ChatInput: {
          users: [user.userId, ...searchUsers.map((u) => Number(u))],
          messages: [],
          chatType: ChatType.PrivateChat,
        },
      });
      if (data) {
        addMessageToChat({
          MessageInput: {
            chatId: data.createChat?.id ?? 0,
            content: values.content,
            senderUserId: values.senderUserId ?? 0,
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
        users: [user.userId, ...searchUsers.map((u) => Number(u))],
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

  const chatLines = chatSearchByMembersData ?? [];

  const chatMessages = chatSearchByMembersData?.[0]?.messages ?? [];

  useEffect(() => {
    const usersData = userData ?? [];
    if (usersData.length > 0) {
      const users = usersData.map((u) => ({
        value: String(u?.id) ?? "",
        label: `${u?.firstName} ${u?.lastName}`,
        image:
          u?.userProfile.photography &&
          `${APP_IMAGES_API_PATH}/100x100/${u.userProfile.photography}`,
        description: u?.userProfile.profileTitle,
      }));
      setUsersSelectItem((prevUsers) =>
        uniqBy("value", [...prevUsers, ...users])
      );
    }
  }, [userData]);

  useEffect(() => {
    if (userData && pChatUser) {
      setSearchUsers([pChatUser]);
    }
  }, [userData, pChatUser]);

  useEffect(() => {
    if (usrSearch && usrSearch.length > 0) {
      searchParams.delete("chatUser");
      setSearchParams(searchParams);
    }
  }, [usrSearch, searchParams, setSearchParams]);

  return (
    <Stack spacing={6} justify="space-between" h={"100%"}>
      <Box>
        <Title order={5} mb={12}>
          New message
        </Title>
        <Divider mt={20} mb={12} />
        <MultiSelect
          data={usersSelectItems}
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
              <Divider mt="md" />
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
          {chatLines?.map((c) => (
            // @ts-expect-error("type-check")
            <div key={c?.id}>{c.id && <ChatLine chat={c} />}</div>
          ))}
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
