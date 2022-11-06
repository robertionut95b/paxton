import ProfileCard from "@components/user-profile/ProfileCard";
import UserResume from "@components/user-profile/UserResume";

export default function UserProfile() {
    return (
        <div className="px-user-profile flex flex-col gap-y-8">
            <ProfileCard />
            <UserResume />
        </div>
    )
}