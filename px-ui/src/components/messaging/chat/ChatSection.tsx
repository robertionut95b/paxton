import { APP_IMAGES_API_PATH } from "@constants/Properties";
import {
  GetApplicationByIdQuery,
  GetMessagesPaginatedQuery,
} from "@gql/generated";
import { User } from "@interfaces/user.types";
import { Avatar, Divider, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { format } from "date-fns";
import compose from "lodash/fp/compose";
import groupBy from "lodash/fp/groupBy";
import { useEffect, useMemo, useRef } from "react";

type ChatSectionProps = {
  messages:
    | NonNullable<
        NonNullable<
          NonNullable<GetApplicationByIdQuery["getApplicationById"]>["chat"]
        >["messages"]
      >
    | NonNullable<
        NonNullable<
          NonNullable<GetMessagesPaginatedQuery["getMessagesPaginated"]>["list"]
        >
      >;
  currentUser: User | null;
  height?: string | number;
  autoScroll?: boolean;
};

const ChatSection = ({
  messages,
  currentUser,
  height = 320,
  autoScroll = true,
}: ChatSectionProps) => {
  const viewport = useRef<HTMLDivElement>(null);
  const isCurrentSender = (message: (typeof messages)[number]) =>
    String(message?.sender.id) === String(currentUser?.userId);

  const displayInitials = (
    fallback: string,
    firstName?: string,
    lastName?: string
  ) =>
    firstName && lastName
      ? `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`
      : fallback?.[0].toUpperCase();

  useEffect(() => {
    if (viewport.current && autoScroll) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "auto",
      });
    }
  }, [messages, autoScroll]);

  const chronoMsgs = useMemo(
    () =>
      compose(
        groupBy((m) =>
          format(
            // @ts-expect-error(lodash-types)
            new Date(m?.deliveredAt),
            new Date().getFullYear() !==
              // @ts-expect-error(lodash-types)
              new Date(m?.deliveredAt).getFullYear()
              ? "dd MMMM yyyy"
              : "dd MMMM"
          )
        )
      )(messages),
    [messages]
  );

  return (
    <ScrollArea
      h={height}
      className="px-chat-wrapper"
      scrollbarSize={6}
      viewportRef={viewport}
    >
      {Object.entries(chronoMsgs).map(([key, value]) => (
        <Stack key={key} spacing={"sm"} mt="xs">
          <Divider
            label={key}
            labelPosition="center"
            className="font-semibold uppercase"
          />
          {(value as typeof messages).map((m) => (
            <Group
              key={m?.id}
              px={"sm"}
              noWrap
              style={{
                flexDirection: isCurrentSender(m) ? "row-reverse" : "row",
              }}
              spacing={4}
            >
              <Avatar
                src={
                  m?.sender.userProfile.photography
                    ? `${APP_IMAGES_API_PATH}/100x100/${m?.sender.userProfile.photography}`
                    : undefined
                }
                radius="xl"
                variant="filled"
                size="md"
                title={m?.sender.displayName}
                className="flex self-end"
              >
                {displayInitials(
                  m?.sender.username ?? "",
                  m?.sender.firstName,
                  m?.sender.lastName
                )}
              </Avatar>
              <Stack spacing={2}>
                <Group
                  spacing={5}
                  position={isCurrentSender(m) ? "right" : "left"}
                >
                  <Text size="xs">{m?.sender.firstName}</Text>
                  {m?.deliveredAt && (
                    <Text className="self-end" size="xs" color="dimmed">
                      {format(new Date(m.deliveredAt), "kk:mm")}
                    </Text>
                  )}
                </Group>
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
                </Stack>
              </Stack>
            </Group>
          ))}
        </Stack>
      ))}
    </ScrollArea>
  );
};

export default ChatSection;
