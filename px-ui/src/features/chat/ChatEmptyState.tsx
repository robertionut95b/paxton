import { Button, Center, Image, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";

const ChatEmptyState = () => {
  return (
    <Center style={{ minHeight: "50vh" }}>
      <Stack align="center" spacing={"sm"}>
        <Image src="/images/chat-people.svg" maw={512} />
        <Text size="md" weight="bold">
          There is no conversation here
        </Text>
        <Link to="chat/new">
          <Button>Start to chat</Button>
        </Link>
      </Stack>
    </Center>
  );
};

export default ChatEmptyState;
