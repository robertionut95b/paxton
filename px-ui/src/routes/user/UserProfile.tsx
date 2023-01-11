import { RequirePermission } from "@auth/RequirePermission";
import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import ProfileBanner from "@components/user-profile/ProfileBanner";
import ProfileCard from "@components/user-profile/ProfileCard";
import ProfileLoadingSkeleton from "@components/user-profile/ProfileLoadingSkeleton";
import UserResume from "@components/user-profile/UserResume";
import { APP_API_BASE_URL } from "@constants/Properties";
import { useGetUserProfileQuery } from "@gql/generated";
import { PencilIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Button, Group, Paper, Stack } from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { NavLink, Outlet, useParams } from "react-router-dom";

export default function UserProfile() {
  const { profileSlug } = useParams();
  const { user, isInRole } = useAuth();

  const { data, isLoading } = useGetUserProfileQuery(graphqlRequestClient, {
    profileSlugUrl: profileSlug,
  });

  if (isLoading) return <ProfileLoadingSkeleton />;

  if (!data?.getUserProfile) return <NotFoundPage />;

  const userProfile = data.getUserProfile;
  const coverPhoto =
    userProfile?.coverPhotography && userProfile.coverPhotography !== null
      ? `${APP_API_BASE_URL}/${userProfile.coverPhotography}`
      : "/images/bg-profile.jpg";

  const isCurrentUser = userProfile?.user.username === user?.username;

  const isCurrentUserCb = () => isCurrentUser;

  return (
    <Stack className="px-user-profile">
      <Paper shadow={"xs"} p="md">
        <Group className="px-banner-parent" grow>
          <ProfileBanner
            coverPhoto={coverPhoto}
            editable={isCurrentUser || isInRole(RoleType.ROLE_ADMINISTRATOR)}
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
              userProfile?.photography &&
              `${APP_API_BASE_URL}/${userProfile.photography}`
            }
            title={userProfile?.profileTitle}
            firstName={userProfile.user?.firstName}
            lastName={userProfile.user?.lastName}
            username={userProfile.user?.username}
            isEmailConfirmed={user?.isEmailConfirmed}
          />
          <RequirePermission returnValue="null" permission={isCurrentUserCb}>
            <NavLink
              to={`/app/up/${data?.getUserProfile?.profileSlugUrl}/update/intro`}
            >
              <Button rightIcon={<PencilIcon width={16} />} size="sm">
                Edit
              </Button>
            </NavLink>
          </RequirePermission>
        </Group>
      </Paper>
      <UserResume
        userProfile={userProfile}
        editable={isCurrentUser || isInRole(RoleType.ROLE_ADMINISTRATOR)}
      />
      <RequirePermission returnValue="null" permission={isCurrentUserCb}>
        <Outlet />
      </RequirePermission>
    </Stack>
  );
}
