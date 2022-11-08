import { useAuth } from "@auth/useAuth";
import ProfileBanner from "@components/user-profile/ProfileBanner";
import ProfileCard from "@components/user-profile/ProfileCard";
import UserResume from "@components/user-profile/UserResume";
import { useGetCurrentUserProfileQuery } from "@gql/generated";
import { PencilIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Button, Skeleton } from "@mantine/core";
import { NavLink, Outlet } from "react-router-dom";

export default function UserProfile() {
  const { user } = useAuth();
  const { data, isLoading } =
    useGetCurrentUserProfileQuery(graphqlRequestClient);
  const userProfile = data?.getCurrentUserProfile;

  const coverPhoto =
    userProfile?.coverPhotography !== undefined &&
    userProfile.coverPhotography !== null &&
    userProfile.coverPhotography.length !== 0
      ? userProfile.coverPhotography
      : "/bg-profile.jpg";

  if (isLoading) {
    return (
      <>
        <Skeleton height={240} mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </>
    );
  }

  return (
    <div className="px-user-profile flex flex-col gap-y-8">
      <ProfileBanner coverPhoto={coverPhoto} />
      <div className="flex justify-between items-center">
        <ProfileCard
          location={`${userProfile?.city?.country.name}, ${userProfile?.city?.name}`}
          photography={userProfile?.photography}
          title={userProfile?.profileTitle}
          user={user}
        />
        <NavLink to={"/app/profile/update/basic"}>
          <Button rightIcon={<PencilIcon width={16} />}>Edit</Button>
        </NavLink>
      </div>
      <UserResume />
      <Outlet />
    </div>
  );
}
