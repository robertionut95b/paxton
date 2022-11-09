import { useAuth } from "@auth/useAuth";
import ExperienceCard from "@components/cards/ExperienceCard";
import StudyCard from "@components/cards/StudyCard";
import { useGetUserProfileQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Divider, Text, Title } from "@mantine/core";

export default function UserResume() {
  const { user } = useAuth();
  const { data } = useGetUserProfileQuery(graphqlRequestClient, {
    profileSlugUrl: user?.profileSlugUrl,
  });
  const userProfile = data?.getUserProfile;

  const studies = [1, 2];
  const experiences = [1];
  return (
    <div className="px-user-resume flex flex-col gap-y-5">
      <Title order={3}>About</Title>
      <div className="px-user-description">
        <Text size="sm">
          {userProfile?.description ??
            "No description was provided, you can update your profile."}
        </Text>
      </div>
      <Divider color={"#ded9fd"} variant="solid" />
      <Title order={3}>Studies</Title>
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
      <Title order={3}>Experience</Title>
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
