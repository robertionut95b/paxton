import { Routes } from "@app/routes";
import { APP_API_BASE_URL } from "@config/Properties";
import { GetChatsWithUsersIdsQuery } from "@gql/generated";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { Avatar, Badge, Flex, Grid, Group, Stack, Text } from "@mantine/core";
import { truncate } from "@utils/truncateText";
import { format } from "date-fns";
import { Else, If, Then, When } from "react-if";
import { NavLink } from "react-router-dom";

type ChatLineProps = {
  chat: NonNullable<
    NonNullable<NonNullable<GetChatsWithUsersIdsQuery>["getChatsWithUsersIds"]>
  >[number];
  active?: boolean;
};

const ChatLine = ({ chat: c, active = false }: ChatLineProps) => {
  const avatar =
    (c?.users?.length ?? 0) > 1 ? (
      <Avatar.Group spacing={20}>
        {c?.users
          ?.slice(0, 2)
          .map((u) => (
            <Avatar
              key={u?.id}
              src={`${APP_API_BASE_URL}/${u?.userProfile?.userProfileAvatarImage?.url}`}
              size={35}
              title={u?.username}
              radius="xl"
              color="violet.3"
            />
          ))}
      </Avatar.Group>
    ) : (
      <Avatar
        key={c?.users?.[0]?.id}
        src={
          c?.users?.[0]?.userProfile.userProfileAvatarImage &&
          `${APP_API_BASE_URL}/${c?.users?.[0].userProfile.userProfileAvatarImage.url}`
        }
        size={40}
        title={c?.users?.[0]?.username}
        radius="xl"
        color="violet.3"
      />
    );

  const chatName =
    (c?.users?.length ?? 0) > 1
      ? truncate(
          c?.users?.map((u) => `${u?.firstName}`).join(", ") as string,
          18,
        )
      : `${c?.users?.[0]?.firstName} ${c?.users?.[0]?.lastName}`;
  const unreadMessages = c?.unreadMessagesCount ?? 0;

  return (
    <NavLink
      to={Routes.ChatInbox.Chat.Details.buildPath({
        chatId: c?.urlId as string,
      })}
    >
      <Grid
        my="sm"
        p="xs"
        grow
        gutter={2}
        align="center"
        justify="center"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "light"
              ? active
                ? theme.colors.gray[1]
                : "transparent"
              : active
                ? theme.colors.gray[8]
                : "transparent",
          cursor: "pointer",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "light"
                ? theme.colors.gray[2]
                : theme.colors.gray[8],
          },
        })}
      >
        <Grid.Col span={1} md={2}>
          {avatar}
        </Grid.Col>
        <Grid.Col span={9}>
          <Flex>
            <Stack spacing={0} justify="start" className="grow">
              <Text
                className="max-w-full truncate md:max-w-[80px] lg:max-w-[120px] xl:max-w-[150px]"
                size={"sm"}
                weight={unreadMessages > 0 ? "bold" : "normal"}
              >
                {c?.title ?? chatName}
              </Text>
              <If condition={!!c?.latestMessage}>
                <Then>
                  <If condition={c?.latestMessage?.content}>
                    <Then>
                      <Text size="xs" className="line-clamp-2">
                        {`${c?.latestMessage?.sender.firstName}: ${c?.latestMessage?.content}`}
                      </Text>
                    </Then>
                    <Else>
                      <Group spacing={5}>
                        <Text size="xs" className="line-clamp-2">
                          {`${c?.latestMessage?.sender.firstName}:`}
                        </Text>
                        <DocumentIcon width={12} />{" "}
                        <Text size="xs" className="line-clamp-2">
                          Attachment
                        </Text>
                      </Group>
                    </Else>
                  </If>
                </Then>
                <Else>
                  <Text size="xs" className="line-clamp-2">
                    No messages yet
                  </Text>
                </Else>
              </If>
            </Stack>
            {c?.latestMessage?.deliveredAt && (
              <Stack spacing={4} w={60} className="flex-none" align="center">
                <Text size="xs" align="end">
                  {format(
                    new Date(c.latestMessage.deliveredAt),
                    new Date(c.latestMessage.deliveredAt).getFullYear() !==
                      new Date().getFullYear()
                      ? "dd MMM yy"
                      : "dd MMM",
                  )}
                </Text>
                <When condition={unreadMessages > 0}>
                  <Badge w={"fit-content"} variant="filled" size="sm">
                    {unreadMessages}
                  </Badge>
                </When>
              </Stack>
            )}
          </Flex>
        </Grid.Col>
      </Grid>
    </NavLink>
  );
};

export default ChatLine;
