import { isAdmin, RequirePermission } from "@auth/RequirePermission";
import { useAuth } from "@auth/useAuth";
import ProfileBanner from "@components/user-profile/ProfileBanner";
import ProfileCard from "@components/user-profile/ProfileCard";
import ProfileLoadingSkeleton from "@components/user-profile/ProfileLoadingSkeleton";
import UserResume from "@components/user-profile/UserResume";
import { APP_API_BASE_URL } from "@constants/Properties";
import { useGetUserProfileQuery } from "@gql/generated";
import { PencilIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Button, Container } from "@mantine/core";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

export default function UserProfile() {
  const { profileSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading } = useGetUserProfileQuery(
    graphqlRequestClient,
    {
      profileSlugUrl: profileSlug,
    },
    {
      onSuccess: (data) => {
        if (data.getUserProfile === null) navigate("/app");
      },
    }
  );
  const userProfile = data?.getUserProfile;
  const coverPhoto =
    userProfile?.coverPhotography && userProfile.coverPhotography !== null
      ? `${APP_API_BASE_URL}/${userProfile.coverPhotography}`
      : "/images/bg-profile.jpg";

  if (isLoading) return <ProfileLoadingSkeleton />;

  const isCurrentUser = userProfile?.user.username === user?.username;

  return (
    <div className="px-user-profile flex flex-col gap-y-2">
      <Container className="px-container-wrapper">
        <div className="px-banner-parent w-full">
          <ProfileBanner
            coverPhoto={coverPhoto}
            editable={isCurrentUser || isAdmin(user?.permissions || [])}
          />
        </div>
        <div className="px-profile-card-parent flex justify-between items-center mt-6">
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
            firstName={userProfile?.user?.firstName}
            lastName={userProfile?.user?.lastName}
            username={userProfile?.user.username as string}
            isEmailConfirmed={user?.isEmailConfirmed}
          />
          <RequirePermission
            returnValue="null"
            permission={() => isCurrentUser}
          >
            <NavLink
              to={`/app/up/${data?.getUserProfile?.profileSlugUrl}/update/intro`}
            >
              <Button rightIcon={<PencilIcon width={16} />} size="sm">
                Edit
              </Button>
            </NavLink>
          </RequirePermission>
        </div>
      </Container>
      <UserResume
        userProfile={userProfile}
        editable={isCurrentUser || isAdmin(user?.permissions || [])}
      />
      <RequirePermission returnValue="null" permission={() => isCurrentUser}>
        <Outlet />
      </RequirePermission>
    </div>
  );
}
