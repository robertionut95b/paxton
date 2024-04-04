import AttachmentItem from "@components/upload/AttachmentItem";
import {
  APP_API_BASE_URL,
  APP_SUPPORTED_IMAGE_EXTENSIONS,
} from "@constants/Properties";
import { GetMessagesPaginatedQuery, Message } from "@gql/generated";
import { Avatar, Group, Image, Stack, Text } from "@mantine/core";
import { format } from "date-fns";
import { useMemo } from "react";
import { Case, Default, Else, If, Switch, Then } from "react-if";

type MessageLineProps = {
  avatar?: string | null;
  name: string;
  content?: string | null;
  avatarInitials: string;
  sentAt?: Date;
  position: "left" | "right";
  fileContents?:
    | NonNullable<
        NonNullable<
          NonNullable<GetMessagesPaginatedQuery["getMessagesPaginated"]>["list"]
        >[number]
      >["fileContents"]
    | Message["fileContents"];
};

const MessageLine = ({
  avatar = undefined,
  avatarInitials = "U",
  content,
  name = "user",
  position,
  sentAt,
  fileContents = [],
}: MessageLineProps) => {
  const uqImgsByName =
    useMemo(
      () =>
        Object.groupBy(
          fileContents!,
          (i) => i?.name?.split("-")?.[0]?.split(".")?.[0] as PropertyKey,
        ),
      [fileContents],
    ) ?? [];
  return (
    <Group
      px={"sm"}
      noWrap
      style={{
        flexDirection: position === "right" ? "row-reverse" : "row",
      }}
      spacing={4}
    >
      <Avatar
        src={avatar}
        radius="xl"
        variant="filled"
        size="md"
        title={name}
        className="flex self-end"
      >
        {avatarInitials}
      </Avatar>
      <Stack spacing={2}>
        <Group spacing={5} position={position}>
          <Text size="xs">{name}</Text>
          {sentAt && (
            <Text className="self-end" size="xs" color="dimmed">
              {format(new Date(sentAt), "kk:mm")}
            </Text>
          )}
        </Group>
        <Stack
          p="xs"
          px="md"
          spacing={2}
          style={{
            borderRadius: "0.5rem",
          }}
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "light"
                ? position === "right"
                  ? theme.colors.violet[6]
                  : theme.colors.gray[1]
                : position === "right"
                  ? theme.colors.violet[8]
                  : theme.colors.gray[8],
          })}
        >
          <Switch>
            <Case condition={!!content && (fileContents?.length ?? []) === 0}>
              <Text
                size="sm"
                component={"pre"}
                color={`${position === "right" ? "white" : "black"}`}
                style={{
                  whiteSpace: "pre-wrap",
                }}
                sx={(theme) => ({
                  color:
                    theme.colorScheme === "light"
                      ? position === "right"
                        ? theme.colors.gray[1]
                        : theme.colors.gray[9]
                      : position === "right"
                        ? theme.colors.gray[3]
                        : theme.colors.gray[4],
                })}
              >
                {content}
              </Text>
            </Case>
            <Case condition={!content && !!fileContents}>
              <Group spacing={"xs"}>
                {Object.entries(uqImgsByName).map(([, value]) =>
                  value?.map(
                    (fc) =>
                      !fc?.name.includes("-") && (
                        <If
                          key={fc?.id}
                          condition={APP_SUPPORTED_IMAGE_EXTENSIONS.some(
                            (fmt) => fc?.name.toLowerCase().endsWith(fmt),
                          )}
                        >
                          <Then>
                            <a
                              key={fc?.id}
                              href={`${APP_API_BASE_URL}/${fc?.url}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Image
                                width={60}
                                height={60}
                                src={`${APP_API_BASE_URL}/${value.findLast((v) => v?.name.includes("-"))?.url}`}
                              />
                            </a>
                          </Then>
                          <Else>
                            <AttachmentItem
                              key={fc?.id}
                              fileName={fc!.name}
                              src={"/images/pdf-icon.svg"}
                              apiUrl={fc!.url}
                            />
                          </Else>
                        </If>
                      ),
                  ),
                )}
              </Group>
            </Case>
            <Default>
              <Text
                size="sm"
                component={"pre"}
                color={`${position === "right" ? "white" : "black"}`}
                style={{
                  whiteSpace: "pre-wrap",
                }}
                sx={(theme) => ({
                  color:
                    theme.colorScheme === "light"
                      ? position === "right"
                        ? theme.colors.gray[1]
                        : theme.colors.gray[9]
                      : position === "right"
                        ? theme.colors.gray[3]
                        : theme.colors.gray[4],
                })}
              >
                ⚠ Unable to show message
              </Text>
            </Default>
          </Switch>
        </Stack>
      </Stack>
    </Group>
  );
};

export default MessageLine;
