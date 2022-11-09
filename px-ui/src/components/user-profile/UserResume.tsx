import ExperienceCard from "@components/cards/ExperienceCard";
import StudyCard from "@components/cards/StudyCard";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { GetUserProfileQuery, UserProfile } from "@gql/generated";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Divider, Text, Title } from "@mantine/core";
import { NavLink } from "react-router-dom";

export default function UserResume({
  userProfile,
}: {
  userProfile?: GetUserProfileQuery["getUserProfile"] | UserProfile | null;
}) {
  const studies = [1, 2];
  const experiences = [1];
  return (
    <div className="px-user-resume flex flex-col gap-y-5">
      <Title order={3}>About</Title>
      <div className="px-user-resume-description">
        <Text size={15}>
          <ShowIfElse
            if={userProfile?.description}
            else={
              <>{"No description was provided, you can update your profile."}</>
            }
          >
            {userProfile?.description}
          </ShowIfElse>
        </Text>
      </div>
      <Divider color={"#ded9fd"} variant="solid" />
      <div className="px-user-resume-studies-heading flex justify-between">
        <Title order={3}>Studies</Title>
        <ActionIcon variant="subtle" size="lg" color={"violet"} radius="xl">
          <PlusCircleIcon />
        </ActionIcon>
      </div>
      <div className="px-user-studies">
        {studies.map((s, idx) => (
          <div key={idx} className="px-user-study mb-8">
            {studies.length - 1 === idx ? (
              <StudyCard />
            ) : (
              <StudyCard withDivider />
            )}
          </div>
        ))}
      </div>
      <Divider color={"#ded9fd"} />
      <div className="px-user-resume-experiences-heading flex justify-between">
        <Title order={3}>Experience</Title>
        <NavLink to={`/app/up/${userProfile?.profileSlugUrl}/experiences/new`}>
          <ActionIcon variant="subtle" size="lg" color={"violet"} radius="xl">
            <PlusCircleIcon />
          </ActionIcon>
        </NavLink>
      </div>
      <div className="px-user-experiences">
        {experiences.map((e, idx) => (
          <div key={idx} className="px-user-experience mb-8">
            <ExperienceCard />
          </div>
        ))}
      </div>
    </div>
  );
}
