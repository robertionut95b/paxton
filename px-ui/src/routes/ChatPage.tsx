import { useAuth } from "@auth/useAuth";
import PageFooter from "@components/layout/PageFooter";
import ChatLine from "@components/messaging/chat/ChatLine";
import ChatLinesSkeleton from "@components/messaging/chat/ChatLinesSkeleton";
import {
  FieldType,
  Operator,
  SortDirection,
  useInfiniteGetChatLinesAdvSearchQuery,
} from "@gql/generated";
import {
  EllipsisHorizontalCircleIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
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
import { useEffect, useMemo, useState } from "react";
import { Else, If, Then, When } from "react-if";
import { NavLink, Outlet, useParams, useSearchParams } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";

export const PAGE_SIZE = 10;

const ChatPage = () => {
  const { user } = useAuth();
  const { chatId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get("m") ?? "");
  const [debouncedSearch] = useDebounceValue<string>(search, 1000);

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
      size: PAGE_SIZE,
    }),
    [user?.userId, debouncedSearch],
  );

  const {
    data: advChatData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteGetChatLinesAdvSearchQuery(
    graphqlRequestClient,
    {
      searchQuery,
    },
    {
      // refetchInterval: 5000,
      getNextPageParam: (lastPage, allPages) => {
        const offset: number = (allPages.length ?? 1) * PAGE_SIZE;
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
    },
  );

  const chatLines = useMemo(
    () =>
      advChatData?.pages
        .flatMap((p) => p.getChatAdvSearch?.list ?? [])
        .map((d) => ({
          ...d,
          id: d?.id ?? 0,
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
                    <NavLink to="chat/new">
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
                    height: "40vh",
                  },
                  height: "75vh",
                })}
                scrollbarSize={6}
              >
                <If condition={!isLoading}>
                  <Then>
                    <If condition={chatLines.length > 0}>
                      <Then>
                        <div className="px-chatlines-wrapper">
                          {chatLines.map(
                            (c, idx) =>
                              c && (
                                <div key={c?.id ?? 0 + idx}>
                                  <ChatLine
                                    chat={c}
                                    active={chatId === String(c.id)}
                                  />
                                </div>
                              ),
                          )}
                        </div>
                      </Then>
                      <Else>
                        <Stack mt="md" align="center" spacing={0}>
                          <Image src="/images/chat-icon.svg" width={76} />
                          <Text size="sm" align="center">
                            No chat rooms yet
                          </Text>
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
              <Outlet />
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
