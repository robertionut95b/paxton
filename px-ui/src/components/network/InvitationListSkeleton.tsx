import { Grid, Group, Skeleton, Stack } from "@mantine/core";

type InvitationListSkeletonProps = {
  rowsNo?: number;
};

const InvitationListSkeleton = ({
  rowsNo = 4,
}: InvitationListSkeletonProps) => {
  const skeletonItems = Array.from(Array(rowsNo).keys()).map((i) => (
    <Group position="apart" key={i}>
      <Group>
        <Skeleton h={80} w={80} circle />
        <Stack>
          <Skeleton h={20} w={140} />
          <Skeleton h={10} w={190} />
          <Skeleton h={10} w={240} />
        </Stack>
      </Group>
      <Group>
        <Skeleton h={30} w={90} /> <Skeleton h={30} w={90} />
      </Group>
    </Group>
  ));
  return (
    <Grid>
      {skeletonItems.map((sk) => (
        <Grid.Col key={sk.key}>{sk}</Grid.Col>
      ))}
    </Grid>
  );
};

export default InvitationListSkeleton;
