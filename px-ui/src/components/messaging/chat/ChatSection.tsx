import { APP_IMAGES_API_PATH } from "@constants/Properties";
import { GetApplicationByIdQuery } from "@gql/generated";
import { ClockIcon } from "@heroicons/react/24/outline";
import { User } from "@interfaces/user.types";
import { Avatar, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { intlFormatDistance } from "date-fns";
import { useEffect, useRef } from "react";

type ChatSectionProps = {
  messages: NonNullable<
    NonNullable<
      NonNullable<GetApplicationByIdQuery["getApplicationById"]>["chat"]
    >["messages"]
  >;
  currentUser: User | null;
  height?: string | number;
};

const ChatSection = ({
  messages,
  currentUser,
  height = 320,
}: ChatSectionProps) => {
  const viewport = useRef<HTMLDivElement>(null);
  const isCurrentSender = (message: (typeof messages)[number]) =>
    String(message?.sender.id) === String(currentUser?.userId);
  const displayInitials =
    currentUser &&
    `${currentUser.firstName[0].toUpperCase()}${currentUser.lastName[0].toUpperCase()}`;

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "auto",
      });
    }
  }, [messages]);

  return (
    <ScrollArea
      h={height}
      className="px-chat-wrapper"
      scrollbarSize={6}
      viewportRef={viewport}
    >
      {messages.map((m) => (
        <Group
          key={m?.id}
          px={"sm"}
          noWrap
          style={{
            flexDirection: isCurrentSender(m) ? "row-reverse" : "row",
          }}
          my="lg"
        >
          <Avatar
            src={
              m?.sender.userProfile.photography
                ? `${APP_IMAGES_API_PATH}/100x100/${m?.sender.userProfile.photography}`
                : undefined
            }
            alt={m?.sender.username}
            radius="xl"
            variant="filled"
            size="md"
            title={m?.sender.username}
          >
            {displayInitials}
          </Avatar>
          <Stack
            p="xs"
            px="md"
            spacing={2}
            bg={`${isCurrentSender(m) ? "violet" : "#f2f2f2"}`}
            style={{
              borderRadius: "0.5rem",
            }}
          >
            <Text
              size="sm"
              component={"pre"}
              color={`${isCurrentSender(m) ? "white" : "black"}`}
              style={{
                whiteSpace: "pre-wrap",
              }}
            >
              {m?.content}
            </Text>
            {m?.deliveredAt && (
              <Group spacing={5} align="center" position="right">
                <ClockIcon
                  width={14}
                  color={isCurrentSender(m) ? "white" : "dimmed"}
                />
                <Text
                  className="self-end"
                  size="xs"
                  color={`${isCurrentSender(m) ? "white" : "dimmed"}`}
                >
                  {intlFormatDistance(new Date(m.deliveredAt), new Date(), {
                    numeric: "always",
                    style: "short",
                  })}
                </Text>
              </Group>
            )}
          </Stack>
        </Group>
      ))}
    </ScrollArea>
  );
};

export default ChatSection;
