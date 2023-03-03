import { useAuth } from "@auth/useAuth";
import UserJobApplicationItem from "@components/jobs/UserJobApplicationItem";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { useGetMyApplicationsQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";

type SegOptions = "applied" | "saved" | "archived";

const UserJobsPage = () => {
  const { user } = useAuth();
  const [segValue, setSegValue] = useState<SegOptions>("applied");
  const { data: applicationsData } = useGetMyApplicationsQuery(
    graphqlRequestClient,
    {
      userId: user?.userId ?? "",
    },
    {
      enabled: !!user && segValue === "applied",
    }
  );

  return (
    <Grid>
      <Grid.Col span={3}>
        <Paper p="md" shadow="xs">
          <Title order={6} mb="sm">
            My items
          </Title>
          <Button fullWidth variant="light" size="xs">
            Jobs
          </Button>
        </Paper>
      </Grid.Col>
      <Grid.Col span={6}>
        <Paper p="md" shadow="xs">
          <Title order={4} weight="normal">
            Your jobs
          </Title>
          <Group my="sm">
            <SegmentedControl
              fullWidth
              size="xs"
              color="violet"
              value={segValue}
              // @ts-expect-error("type-error")
              onChange={setSegValue}
              data={[
                { label: "Saved", value: "saved", disabled: true },
                { label: "Applied", value: "applied" },
                { label: "Archived", value: "archived" },
              ]}
            />
          </Group>
          <Divider color="#f5f2f2" my="sm" mx={"-16px"} />
          <Stack>
            <ShowIfElse
              if={
                applicationsData &&
                (applicationsData.getMyApplications?.length ?? 0) > 0
              }
              else={<Text>No applications found</Text>}
            >
              {applicationsData?.getMyApplications &&
                applicationsData.getMyApplications.map(
                  (a, idx) =>
                    a && (
                      <div key={a.id}>
                        <UserJobApplicationItem application={a} />
                        {idx !==
                          (applicationsData?.getMyApplications?.length ?? 0) -
                            1 && <Divider color="#edebeb" mt="sm" />}
                      </div>
                    )
                )}
            </ShowIfElse>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default UserJobsPage;
