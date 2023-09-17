import { Divider, Group, Skeleton, Stack } from "@mantine/core";

const ChatRoomSkeleton = () => {
  return (
    <Stack>
      <Group align="center">
        <Skeleton height={"40px"} circle />
        <Skeleton height={"25px"} width="80%" />
      </Group>
      <Divider my={0} />
      <Stack>
        <Group>
          <Skeleton height={"40px"} circle />
          <Skeleton height={"25px"} width="50%" />
        </Group>
        <Group>
          <Skeleton height={"40px"} circle />
          <Skeleton height={"25px"} width="30%" />
        </Group>
        <Group position="right">
          <Skeleton height={"25px"} width="50%" />
          <Skeleton height={"40px"} circle />
        </Group>
        <Group position="right">
          <Skeleton height={"50px"} width="60%" />
          <Skeleton height={"40px"} circle />
        </Group>
      </Stack>
    </Stack>
  );
};

export default ChatRoomSkeleton;
