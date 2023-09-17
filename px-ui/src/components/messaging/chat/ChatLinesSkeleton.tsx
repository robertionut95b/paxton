import { Skeleton, Stack } from "@mantine/core";

const ChatLinesSkeleton = () => {
  return (
    <Stack>
      <Skeleton mt="sm" height={"50px"} width="300px" visible radius={"sm"} />
      <Skeleton height={"50px"} width="300px" visible radius={"sm"} />
      <Skeleton height={"50px"} width="300px" visible radius={"sm"} />
      <Skeleton height={"50px"} width="300px" visible radius={"sm"} />
      <Skeleton height={"50px"} width="300px" visible radius={"sm"} />
    </Stack>
  );
};

export default ChatLinesSkeleton;
