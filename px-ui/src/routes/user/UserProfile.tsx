import { useAuth } from "@auth/useAuth";
import ProfileBanner from "@components/user-profile/ProfileBanner";
import ProfileCard from "@components/user-profile/ProfileCard";
import ProfileLoadingSkeleton from "@components/user-profile/ProfileLoadingSkeleton";
import UserResume from "@components/user-profile/UserResume";
import { useGetUserProfileQuery } from "@gql/generated";
import { PencilIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Button } from "@mantine/core";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

export default function UserProfile() {
  const { user } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetUserProfileQuery(
    graphqlRequestClient,
    {
      profileSlugUrl: params.profileSlug,
    },
    {
      onSuccess: (data) => {
        if (data.getUserProfile === null) navigate("/app");
      },
    }
  );
  const userProfile = data?.getUserProfile;

  const coverPhoto =
    userProfile?.coverPhotography !== undefined &&
    userProfile.coverPhotography !== null &&
    userProfile.coverPhotography.length !== 0
      ? userProfile.coverPhotography
      : "/bg-profile.jpg";

  if (isLoading) return <ProfileLoadingSkeleton />;

  return (
    <div className="px-user-profile flex flex-col gap-y-8">
      <ProfileBanner coverPhoto={coverPhoto} />
      <div className="flex justify-between items-center">
        <ProfileCard
          location={
            userProfile?.city?.country
              ? `${userProfile?.city?.country.name}, ${userProfile?.city?.name}`
              : undefined
          }
          photography={userProfile?.photography}
          title={userProfile?.profileTitle}
          user={user}
        />
        <NavLink
          to={`/app/up/${data?.getUserProfile?.profileSlugUrl}/update/intro`}
        >
          <Button rightIcon={<PencilIcon width={16} />}>Edit</Button>
        </NavLink>
      </div>
      <UserResume />
      <Outlet />
    </div>
  );
}
