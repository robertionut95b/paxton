import { useAuth } from "@auth/useAuth";
import PageFooter from "@components/layout/PageFooter";
import ChatLine from "@components/messaging/chat/ChatLine";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { useGetPrivateChatsByUserIdQuery } from "@gql/generated";
import {
  EllipsisHorizontalCircleIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  ActionIcon,
  Center,
  Divider,
  Grid,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useParams, useSearchParams } from "react-router-dom";
import { useDebounce } from "usehooks-ts";

const ChatPage = () => {
  const { user } = useAuth();
  const { chatId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get("m") ?? "");
  const debouncedSearch = useDebounce<string>(search, 1000);
  const { data: chatData, isLoading } = useGetPrivateChatsByUserIdQuery(
    graphqlRequestClient,
    {
      userId: user?.userId as string,
      msgSearch: debouncedSearch.length > 2 ? debouncedSearch : undefined,
    },
    {
      select: (data) => ({
        ...data,
        getPrivateChatsByUserId: data.getPrivateChatsByUserId?.map((c) => ({
          ...c,
          id: c?.id as string,
          unreadMessagesCount: c?.unreadMessagesCount ?? 0,
          users: c?.users?.filter(
            (u) => String(u?.id) !== String(user?.userId)
          ),
        })),
      }),
    }
  );

  const chatLines = chatData?.getPrivateChatsByUserId ?? [];

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
              <ScrollArea h={"75vh"} offsetScrollbars>
                <ShowIfElse
                  if={!isLoading}
                  else={
                    <Center mt="xs">
                      <Loader mt="sm" size="sm" />
                    </Center>
                  }
                >
                  <ShowIfElse
                    if={chatLines.length > 0}
                    else={
                      <Text mt="sm" size="xs" align="center">
                        No chat rooms yet
                      </Text>
                    }
                  >
                    {chatLines.map((c) => (
                      <div key={c?.id}>
                        <ChatLine chat={c} active={chatId === c.id} />
                      </div>
                    ))}
                  </ShowIfElse>
                </ShowIfElse>
              </ScrollArea>
            </Grid.Col>
            <Grid.Col span={12} sm={7} className="md:border-l">
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
