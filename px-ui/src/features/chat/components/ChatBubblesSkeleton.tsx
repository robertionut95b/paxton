import { Group, Skeleton, Stack } from "@mantine/core";

type ChatBubblesSkeletonProps = {
  cardsNo?: number;
};

const ChatBubblesSkeleton = ({ cardsNo = 3 }: ChatBubblesSkeletonProps) => {
  const cards = Array.from(Array(cardsNo).keys());
  return (
    <Stack>
      {cards.map((c) => (
        <div key={c}>
          <Group my="xs">
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
        </div>
      ))}
    </Stack>
  );
};

export default ChatBubblesSkeleton;
