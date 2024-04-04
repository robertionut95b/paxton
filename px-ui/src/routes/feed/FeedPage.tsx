import { useAuth } from "@auth/useAuth";
import PageFooter from "@components/layout/PageFooter";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import { APP_API_BASE_URL } from "@constants/Properties";
import { useGetUserProfileQuery } from "@gql/generated";
import {
  CalendarDaysIcon,
  ClipboardDocumentIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Avatar,
  BackgroundImage,
  Button,
  Center,
  Divider,
  Grid,
  Group,
  MediaQuery,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export default function FeedPage() {
  const { user } = useAuth();
  const { data: upd, isLoading } = useGetUserProfileQuery(
    graphqlRequestClient,
    {
      profileSlugUrl: user?.profileSlugUrl,
    },
    {
      enabled: !!user?.profileSlugUrl,
    },
  );

  if (isLoading) return <GenericLoadingSkeleton />;

  return (
    <Grid columns={24}>
      <Grid.Col span={24} sm={8} md={5}>
        <Paper p="md" shadow="xs">
          <Stack align="center" spacing={2}>
            <BackgroundImage
              src={
                upd?.getUserProfile?.userProfileBannerImage
                  ? `${APP_API_BASE_URL}/${upd.getUserProfile.userProfileBannerImage.url}`
                  : "/images/bg-profile.jpg"
              }
              radius="sm"
              mb="md"
            >
              <Center>
                <Avatar
                  radius={100}
                  size={92}
                  styles={{
                    root: {
                      border: "0.15rem solid white",
                      marginTop: "25px",
                      marginBottom: "25px",
                    },
                  }}
                  src={
                    upd?.getUserProfile?.userProfileAvatarImage
                      ? `${APP_API_BASE_URL}/${upd.getUserProfile.userProfileAvatarImage.url}`
                      : undefined
                  }
                >
                  {user?.firstName && user?.lastName
                    ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
                    : user?.username[0].toUpperCase()}
                </Avatar>
              </Center>
            </BackgroundImage>
            <Title order={6} mb={0} align="center">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.username}
            </Title>
            <Text size="xs" align="center">
              {upd?.getUserProfile?.profileTitle}
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>
      <Grid.Col span={24} sm={16} md={12}>
        <Stack>
          <Paper p="md" shadow="xs">
            <Stack>
              <Group noWrap>
                {upd?.getUserProfile && (
                  <Avatar
                    radius="xl"
                    size="md"
                    src={
                      upd.getUserProfile.userProfileAvatarImage &&
                      `${APP_API_BASE_URL}/100x100/${upd.getUserProfile.userProfileAvatarImage.url}`
                    }
                  >
                    {user?.firstName && user?.lastName
                      ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
                      : user?.username[0].toUpperCase()}
                  </Avatar>
                )}
                <Button
                  variant="outline"
                  fullWidth
                  styles={{
                    inner: {
                      justifyContent: "start",
                    },
                  }}
                  leftIcon={<ClipboardDocumentIcon width={16} />}
                  radius={"xl"}
                >
                  Start a post
                </Button>
              </Group>
              <Group
                position="center"
                w="100%"
                noWrap={false}
                spacing={"xs"}
                grow
              >
                <Button
                  variant="light"
                  leftIcon={<PhotoIcon width={18} />}
                  color="blue"
                >
                  Photo
                </Button>
                <Button
                  variant="light"
                  leftIcon={<VideoCameraIcon width={18} />}
                  color="red"
                >
                  Video
                </Button>
                <Button
                  variant="light"
                  leftIcon={<CalendarDaysIcon width={18} />}
                  color="orange"
                >
                  Event
                </Button>
                <Button
                  variant="light"
                  leftIcon={<DocumentTextIcon width={18} />}
                  color="grape"
                >
                  Article
                </Button>
              </Group>
            </Stack>
          </Paper>
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
