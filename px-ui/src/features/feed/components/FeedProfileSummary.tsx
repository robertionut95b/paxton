import { APP_API_BASE_URL } from "@config/Properties";
import { GetUserProfileQuery } from "@gql/generated";
import { User } from "@interfaces/user";
import {
  Avatar,
  BackgroundImage,
  Center,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

type FeedProfileSummaryProps = {
  user: Partial<User> | null;
  up?: GetUserProfileQuery["getUserProfile"] | null;
};

const FeedProfileSummary = ({ user, up }: FeedProfileSummaryProps) => {
  return (
    <Paper p="md" shadow="xs">
      <Stack align="center" spacing={2}>
        <BackgroundImage
          src={
            up?.userProfileBannerImage
              ? `${APP_API_BASE_URL}/${up.userProfileBannerImage.url}`
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
              alt="user-profile-image"
              src={
                up?.userProfileAvatarImage
                  ? `${APP_API_BASE_URL}/${up.userProfileAvatarImage.url}`
                  : undefined
              }
            >
              {user?.firstName && user?.lastName
                ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
                : user?.username?.[0].toUpperCase()}
            </Avatar>
          </Center>
        </BackgroundImage>
        <Title order={6} mb={0} align="center">
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.username}
        </Title>
        <Text size="xs" align="center">
          {up?.profileTitle}
        </Text>
      </Stack>
    </Paper>
  );
};

export default FeedProfileSummary;
