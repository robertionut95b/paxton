import { Center, Grid, Paper, Skeleton, Space, Stack } from "@mantine/core";

type DefaultLayoutSkeletonProps = {
  cols?: number;
};

const DefaultLayoutSkeleton = ({ cols = 3 }: DefaultLayoutSkeletonProps) => {
  if (cols === 1) {
    return (
      <Paper p="md" shadow="xs">
        <Skeleton w={"100%"} h={320} />
        <Space h={"sm"} />
        <Skeleton w={"100%"} h={80} />
      </Paper>
    );
  }

  if (cols === 2) {
    return (
      <Grid>
        <Grid.Col span={12} sm={9}>
          <Paper p="md" shadow="xs">
            <Skeleton w={"100%"} h={320} />
            <Space h={"sm"} />
            <Skeleton w={"100%"} h={80} />
          </Paper>
        </Grid.Col>
        <Grid.Col span={12} sm={3}>
          <Paper p="md" shadow="xs">
            <Skeleton w={"100%"} h={120} />
            <Space h={"sm"} />
            <Skeleton w={"100%"} h={30} />
          </Paper>
        </Grid.Col>
      </Grid>
    );
  }

  return (
    <Grid columns={24}>
      <Grid.Col span={24} sm={8} md={5}>
        <Paper p="md" shadow="xs">
          <Skeleton w={"100%"} h={120} />
          <Space h={"sm"} />
          <Skeleton w={"100%"} h={50} />
        </Paper>
      </Grid.Col>
      <Grid.Col span={24} sm={16} md={12}>
        <Paper p="md" shadow="xs">
          <Skeleton w={"100%"} h={100} />
          <Space h={"sm"} />
          <Skeleton w={"100%"} h={60} />
        </Paper>
      </Grid.Col>
      <Grid.Col md={7}>
        <Stack>
          <Paper p="md" shadow="xs">
            <Skeleton w={"100%"} h={90} />
            <Space h={"sm"} />
            <Skeleton w={"100%"} h={30} />
          </Paper>
          <Center>
            <Skeleton w={"80%"} h={30} />
          </Center>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default DefaultLayoutSkeleton;
