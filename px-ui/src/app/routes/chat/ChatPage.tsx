import { gql, useSubscription } from "@apollo/client";
import { Routes } from "@app/routes";
import PageFooter from "@components/ui/footer/PageFooter";
import { API_PAGINATION_SIZE } from "@config/Properties";
import { useAuth } from "@features/auth/hooks/useAuth";
import ChatEmptyState from "@features/chat/components/ChatEmptyState";
import ChatLine from "@features/chat/components/ChatLine";
import ChatLinesSkeleton from "@features/chat/components/ChatLinesSkeleton";
import ChatRoomSkeleton from "@features/chat/components/ChatRoomSkeleton";
import {
  FieldType,
  GetChatLinesAdvSearchQuery,
  GetLiveUpdatesForChatsDocument,
  GetLiveUpdatesForChatsSubscription,
  GetLiveUpdatesForChatsSubscriptionVariables,
  Operator,
  SortDirection,
  useInfiniteGetChatLinesAdvSearchQuery,
} from "@gql/generated";
import {
  ArrowUturnLeftIcon,
  EllipsisHorizontalCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { GraphqlApiResponse } from "@interfaces/api";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { queryClient } from "@lib/queryClient";
import {
  ActionIcon,
  Button,
  Center,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { InfiniteData } from "@tanstack/react-query";
import { produce } from "immer";
import { useEffect, useMemo, useState } from "react";
import { Else, If, Then, When } from "react-if";
import {
  NavLink,
  useOutlet,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useSpinDelay } from "spin-delay";
import { useDebounceValue } from "usehooks-ts";

const ChatPage = () => {
  const { user, accessToken } = useAuth();
  const { chatId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get("m") ?? "");
  const [debouncedSearch] = useDebounceValue<string>(search, 1000);
  const outlet = useOutlet();

  const searchQuery = useMemo(
    () => ({
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
    }),
    [user?.userId, debouncedSearch],
  );

  const {
    data: advChatData,
    isLoading,
    isInitialLoading,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isError,
    refetch,
  } = useInfiniteGetChatLinesAdvSearchQuery(
    graphqlRequestClient,
    {
      searchQuery,
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const offset: number = (allPages.length ?? 1) * API_PAGINATION_SIZE;
        const totalItems = lastPage.getChatAdvSearch?.totalElements ?? 0;
        const currPage = (lastPage.getChatAdvSearch?.page ?? 0) + 1;
        if (offset < totalItems)
          return {
            searchQuery: {
              ...searchQuery,
              page: currPage,
            },
          };
      },
      onError: (err: GraphqlApiResponse) => {
        const error = err.response.errors[0];
        if (error) {
          showNotification({
            title: "Error when retrieving conversations",
            message: err.response.errors?.[0].message,
            icon: <ExclamationTriangleIcon width={16} />,
            autoClose: 5000,
          });
        }
      },
    },
  );

  useSubscription<
    GetLiveUpdatesForChatsSubscription,
    GetLiveUpdatesForChatsSubscriptionVariables
  >(
    gql`
      ${GetLiveUpdatesForChatsDocument}
    `,
    {
      variables: {
        auth: accessToken!,
      },
      onData: (opts) => {
        const chatUpdate = opts.data.data?.getLiveUpdatesForChats;
        if (!chatUpdate) return;
        // find if this chat update data is corresponding to an update or new chat creation
        queryClient.setQueryData<InfiniteData<GetChatLinesAdvSearchQuery>>(
          useInfiniteGetChatLinesAdvSearchQuery.getKey({
            searchQuery,
          }),
          (prevData) =>
            prevData
              ? produce(prevData, (draft) => {
                  const currentChatPage = draft.pages.filter((p) =>
                    p?.getChatAdvSearch?.list?.filter(
                      (cl) => cl?.id === chatUpdate.id,
                    ),
                  )[0];
                  const currentChatLine =
                    currentChatPage.getChatAdvSearch?.list?.filter(
                      (cl) => cl?.id === chatUpdate.id,
                    )[0];
                  // if chat exists, push the update to query data
                  if (currentChatLine) {
                    currentChatLine.latestMessage = chatUpdate.latestMessage;
                    currentChatLine.unreadMessagesCount += 1;
                  } else {
                    if (!currentChatPage.getChatAdvSearch) return;
                    currentChatPage.getChatAdvSearch?.list?.push(chatUpdate);
                    currentChatPage.getChatAdvSearch.totalElements += 1;
                  }
                })
              : prevData,
        );
      },
      skip: isInitialLoading || isError,
    },
  );

  const chatLines = useMemo(
    () =>
      advChatData?.pages
        .flatMap((p) => p.getChatAdvSearch?.list ?? [])
        .map((d) => ({
          ...d,
          id: d?.id ?? 0,
          urlId: d?.urlId ?? "",
          unreadMessagesCount: d?.unreadMessagesCount as number,
          users: d?.users?.filter(
            (u) => String(u?.id) !== String(user?.userId),
          ),
        }))
        .sort((a, b) =>
          a.latestMessage?.deliveredAt && b.latestMessage?.deliveredAt
            ? new Date(b.latestMessage.deliveredAt).getTime() -
              new Date(a.latestMessage.deliveredAt).getTime()
            : 0,
        ) ?? [],
    [advChatData?.pages, user?.userId],
  );

  useEffect(() => {
    if (search) {
      const currentSearchParams = searchParams;
      currentSearchParams.set("m", search);
      setSearchParams(currentSearchParams);
    } else {
      searchParams.delete("m");
      setSearchParams(searchParams);
    }
  }, [search, searchParams, setSearchParams]);

  const chatLoading = useSpinDelay(isLoading, {
    delay: 700,
    minDuration: 500,
  });

  return (
    <Grid justify={"center"}>
      <Grid.Col span={10} md={9}>
        <Paper p="md" shadow="xs">
          <Grid>
            <Grid.Col span={12} sm={5}>
              <Group position="apart">
                <Title order={5} mb={0}>
                  Messages
                </Title>
                <Group spacing={"xs"}>
                  <ActionIcon>
                    <EllipsisHorizontalCircleIcon width={30} />
                  </ActionIcon>
                  <ActionIcon>
                    <NavLink to={Routes.ChatInbox.NewChat.path}>
                      <PencilSquareIcon width={28} />
                    </NavLink>
                  </ActionIcon>
                </Group>
              </Group>
              <Divider my="md" />
              <Stack>
                <TextInput
                  placeholder="Search messages"
                  value={search}
                  onChange={(e) => setSearch(e.currentTarget.value)}
                  icon={<MagnifyingGlassIcon width={16} />}
                />
              </Stack>
              <ScrollArea
                offsetScrollbars
                sx={(theme) => ({
                  [theme.fn.smallerThan("sm")]: {
                    height: "30vh",
                  },
                  height: "50vh",
                })}
                scrollbarSize={6}
              >
                <If condition={!chatLoading}>
                  <Then>
                    <If condition={chatLines.length > 0 && !isError}>
                      <Then>
                        <div className="px-chatlines-wrapper">
                          {chatLines.map(
                            (c, idx) =>
                              c && (
                                <div key={c?.id ?? 0 + idx}>
                                  <ChatLine
                                    chat={c}
                                    active={chatId === String(c.urlId)}
                                  />
                                </div>
                              ),
                          )}
                        </div>
                      </Then>
                      <Else>
                        <Stack mt="md" align="center" spacing={0}>
                          <If condition={isError}>
                            <Then>
                              <Image
                                src="/images/error-broken.svg"
                                width={124}
                              />
                              <Text size="sm" align="center">
                                Could not load conversations
                              </Text>
                              <Button
                                size="xs"
                                my="xs"
                                variant="light"
                                leftIcon={<ArrowUturnLeftIcon width={16} />}
                                onClick={() => refetch()}
                              >
                                Retry
                              </Button>
                            </Then>
                            <Else>
                              <Stack align="center" spacing={10}>
                                <Image
                                  src="/images/paper-plane.svg"
                                  width={164}
                                />
                                <Text size="md" align="center" weight="bold">
                                  No chat rooms yet
                                </Text>
                                <Text size="sm" align="center" weight="normal">
                                  Start a conversation with people around you
                                </Text>
                              </Stack>
                            </Else>
                          </If>
                        </Stack>
                      </Else>
                    </If>
                  </Then>
                  <Else>
                    <Center mt="xs">
                      <ChatLinesSkeleton />
                    </Center>
                  </Else>
                </If>
                <When condition={hasNextPage}>
                  <Button
                    fullWidth
                    mt="xs"
                    onClick={() => fetchNextPage()}
                    loading={isFetching}
                    variant="light"
                  >
                    Load more
                  </Button>
                </When>
              </ScrollArea>
            </Grid.Col>
            <Grid.Col
              span={12}
              sm={7}
              sx={(theme) => ({
                [theme.fn.smallerThan("sm")]: {
                  borderLeft: "0px",
                  borderTop: `3px solid ${
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[8]
                      : theme.colors.gray[4]
                  }`,
                },
                borderLeft: `1px solid ${
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[8]
                    : theme.colors.gray[4]
                }`,
                borderTop: "0px",
              })}
            >
              <If condition={chatLoading}>
                <Then>
                  <ChatRoomSkeleton />
                </Then>
                <Else>{outlet || <ChatEmptyState />}</Else>
              </If>
            </Grid.Col>
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col md={3}>
        <PageFooter />
      </Grid.Col>
    </Grid>
  );
};

export default ChatPage;
