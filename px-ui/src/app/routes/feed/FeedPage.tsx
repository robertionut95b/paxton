import PageFooter from "@components/ui/footer/PageFooter";
import { useAuth } from "@features/auth/hooks/useAuth";
import { authStore } from "@features/auth/stores/authStore";
import { useGetUserProfile } from "@features/feed/api/getUserProfile";
import FeedPostingToolbar from "@features/feed/components/FeedPostingToolbar";
import FeedProfileSummary from "@features/feed/components/FeedProfileSummary";
import { useGetUserProfileQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { queryClient } from "@lib/queryClient";
import {
  Divider,
  Grid,
  MediaQuery,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

const loader = () => {
  const user = authStore.getState().user;
  return queryClient.fetchQuery(
    useGetUserProfileQuery.getKey({ profileSlugUrl: user?.profileSlugUrl }),
    {
      queryFn: () => useGetUserProfileQuery.fetcher(graphqlRequestClient),
    },
  );
};

FeedPage.loader = loader;

export default function FeedPage() {
  const { user } = useAuth();
  const { data: upd } = useGetUserProfile(user!.profileSlugUrl);

  return (
    <Grid columns={24}>
      <Grid.Col span={24} sm={8} md={5}>
        <FeedProfileSummary user={user} up={upd?.getUserProfile} />
      </Grid.Col>
      <Grid.Col span={24} sm={16} md={12}>
        <Stack>
          <FeedPostingToolbar user={user} up={upd?.getUserProfile} />
          <Divider my="xs" />
          <Paper p="md" shadow="xs">
            <Text size="sm">No posts have been found</Text>
          </Paper>
        </Stack>
      </Grid.Col>
      <MediaQuery
        smallerThan={"md"}
        styles={{
          display: "none",
        }}
      >
        <Grid.Col md={7}>
          <Stack>
            <Paper p="md" shadow="xs">
              <Title order={5}>Recommendations</Title>
            </Paper>
            <PageFooter />
          </Stack>
        </Grid.Col>
      </MediaQuery>
    </Grid>
  );
}
