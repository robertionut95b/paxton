import { Routes } from "@app/routes";
import NotFoundPage from "@app/routes/NotFoundPage";
import PageFooter from "@components/ui/footer/PageFooter";
import { APP_API_BASE_URL } from "@config/Properties";
import { useAuth } from "@features/auth/hooks/useAuth";
import Roles from "@features/auth/types/roles";
import ProfileBanner from "@features/user-profile/components/ProfileBanner";
import ProfileCard from "@features/user-profile/components/ProfileCard";
import ProfileLoadingSkeleton from "@features/user-profile/components/ProfileLoadingSkeleton";
import UserResume from "@features/user-profile/components/UserResume";
import { useGetUserProfileQuery } from "@gql/generated";
import { PencilIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Button, Grid, Group, Paper, Stack, Title } from "@mantine/core";
import { NavLink, Outlet, useParams } from "react-router-dom";

export default function UserProfilePage() {
  const { profileSlug } = useParams();
  const { user, isAuthorized } = useAuth();

  const { data, isLoading } = useGetUserProfileQuery(graphqlRequestClient, {
    profileSlugUrl: profileSlug,
  });

  if (isLoading) return <ProfileLoadingSkeleton />;

  if (!data?.getUserProfile) return <NotFoundPage />;

  const userProfile = data.getUserProfile;
  const coverPhoto =
    userProfile?.userProfileBannerImage &&
    userProfile.userProfileBannerImage !== null
      ? `${APP_API_BASE_URL}/${userProfile.userProfileBannerImage.url}`
      : "/images/bg-profile.jpg";

  const isCurrentUser = userProfile?.user.username === user?.username;

  const isCurrentUserCb = () => isCurrentUser;

  return (
    <Grid>
      <Grid.Col span={12} sm={9}>
        <Stack className="px-user-profile">
          <Paper shadow={"xs"} p="md">
            <Group className="px-banner-parent" grow>
              <ProfileBanner
                coverPhoto={coverPhoto}
                editable={
                  isCurrentUser || isAuthorized([Roles.ROLE_ADMINISTRATOR])
                }
              />
            </Group>
            <Group mt={"md"} position="apart">
              <ProfileCard
                location={
                  userProfile?.city?.country
                    ? `${userProfile?.city?.country.name}, ${userProfile?.city?.name}`
                    : undefined
                }
                photography={
                  userProfile?.userProfileAvatarImage &&
                  `${APP_API_BASE_URL}/${userProfile.userProfileAvatarImage.url}`
                }
                title={userProfile?.profileTitle}
                firstName={userProfile.user?.firstName}
                lastName={userProfile.user?.lastName}
                username={userProfile.user?.username}
                isEmailConfirmed={user?.isEmailConfirmed}
              />
              <>
                {(isCurrentUserCb() ||
                  isAuthorized([Roles.ROLE_ADMINISTRATOR])) && (
                  <NavLink
                    to={Routes.UserProfile.UpdateIntro.buildPath({
                      profileSlug: data.getUserProfile.profileSlugUrl,
                    })}
                  >
                    <Button rightIcon={<PencilIcon width={16} />} size="sm">
                      Edit
                    </Button>
                  </NavLink>
                )}
              </>
            </Group>
          </Paper>
          <UserResume
            userProfile={userProfile}
            editable={isCurrentUser || isAuthorized([Roles.ROLE_ADMINISTRATOR])}
          />
          <>
            {(isCurrentUserCb() ||
              isAuthorized([Roles.ROLE_ADMINISTRATOR])) && <Outlet />}
          </>
        </Stack>
      </Grid.Col>
      <Grid.Col span={12} sm={3}>
        <Stack>
          <Paper p="md" shadow="xs">
            <Title order={5}>Profile options</Title>
          </Paper>
          <PageFooter />
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
