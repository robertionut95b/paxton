import { Avatar, Group, Stack, Text } from "@mantine/core";
import { format } from "date-fns";

type MessageLineProps = {
  avatar?: string;
  name: string;
  content: string;
  avatarInitials: string;
  sentAt?: Date;
  position: "left" | "right";
};

const MessageLine = ({
  avatar = undefined,
  avatarInitials = "U",
  content,
  name = "user",
  position,
  sentAt,
}: MessageLineProps) => {
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
          bg={`${position === "right" ? "violet" : "#f2f2f2"}`}
          style={{
            borderRadius: "0.5rem",
          }}
        >
          <Text
            size="sm"
            component={"pre"}
            color={`${position === "right" ? "white" : "black"}`}
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {content}
          </Text>
        </Stack>
      </Stack>
    </Group>
  );
};

export default MessageLine;
