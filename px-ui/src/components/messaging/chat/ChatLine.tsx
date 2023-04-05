import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { APP_IMAGES_API_PATH } from "@constants/Properties";
import { GetChatLinesAdvSearchQuery } from "@gql/generated";
import { Avatar, Badge, Flex, Grid, Stack, Text } from "@mantine/core";
import { truncate } from "@utils/truncateText";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";

type ChatLineProps = {
  chat: NonNullable<
    NonNullable<
      NonNullable<GetChatLinesAdvSearchQuery>["getChatAdvSearch"]
    >["list"]
  >[number];
  active?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChatLine = ({ chat: c, active = false }: ChatLineProps) => {
  const avatar =
    (c?.users?.length ?? 0) > 1 ? (
      <Avatar.Group spacing={20}>
        {c?.users?.slice(0, 2).map((u) => (
          <Avatar
            key={u?.id}
            src={
              u?.userProfile.photography &&
              `${APP_IMAGES_API_PATH}/100x100/${u.userProfile.photography}`
            }
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
          c?.users?.[0]?.userProfile.photography &&
          `${APP_IMAGES_API_PATH}/100x100/${c?.users?.[0].userProfile.photography}`
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
          18
        )
      : `${c?.users?.[0]?.firstName} ${c?.users?.[0]?.lastName}`;
  const unreadMessages = c?.unreadMessagesCount ?? 0;

  return (
    <NavLink to={`/app/inbox/messages/chat/${c?.id}`}>
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
              <ShowIfElse
                if={c?.latestMessage}
                else={
                  <Text size="xs" className="line-clamp-2">
                    No messages yet
                  </Text>
                }
              >
                <Text size="xs" className="line-clamp-2">
                  {`${c?.latestMessage?.sender.firstName}: ${c?.latestMessage?.content}`}
                </Text>
              </ShowIfElse>
            </Stack>
            {c?.latestMessage?.deliveredAt && (
              <Stack spacing={4} w={60} className="flex-none" align="center">
                <Text size="xs" align="end">
                  {format(
                    new Date(c.latestMessage.deliveredAt),
                    new Date(c.latestMessage.deliveredAt).getFullYear() !==
                      new Date().getFullYear()
                      ? "dd MMM yy"
                      : "dd MMM"
                  )}
                </Text>
                <ShowIf if={unreadMessages > 0}>
                  <Badge w={"fit-content"} variant="filled" size="sm">
                    {unreadMessages}
                  </Badge>
                </ShowIf>
              </Stack>
            )}
          </Flex>
        </Grid.Col>
      </Grid>
    </NavLink>
  );
};

export default ChatLine;
