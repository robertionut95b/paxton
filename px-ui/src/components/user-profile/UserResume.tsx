import ExperienceCard from "@components/cards/ExperienceCard";
import StudyCard from "@components/cards/StudyCard";
import ExpandableText from "@components/visibility/ExpandableText";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { GetUserProfileQuery, UserProfile } from "@gql/generated";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Container, Text, Title } from "@mantine/core";
import groupBy from "lodash.groupby";
import { NavLink } from "react-router-dom";

export default function UserResume({
  userProfile,
  editable = false,
}: {
  userProfile?: GetUserProfileQuery["getUserProfile"] | UserProfile | null;
  editable?: boolean;
}) {
  const studies = userProfile?.studies ?? [];
  const experiences =
    groupBy(userProfile?.experiences, "organization.id") ?? [];

  const placeholder =
    "No information was provided. Start by adding some to your profile.";

  return (
    <div className="px-user-resume flex flex-col gap-y-4">
      <Container className="px-container-wrapper">
        <Title mb={"md"} order={4}>
          About
        </Title>
        <div className="px-user-resume-description">
          <ShowIfElse
            if={userProfile?.description}
            else={<Text size="sm">{placeholder}</Text>}
          >
            <ExpandableText size={15}>
              {userProfile?.description}
            </ExpandableText>
          </ShowIfElse>
        </div>
      </Container>
      <Container className="px-container-wrapper px-user-resume-studies">
        <div className="px-user-resume-studies-heading flex justify-between">
          <Title order={4} mb={"md"}>
            Studies
          </Title>
          <ShowIf if={editable}>
            <NavLink to={`/app/up/${userProfile?.profileSlugUrl}/studies/new`}>
              <ActionIcon
                variant="subtle"
                size="lg"
                color={"violet"}
                radius="xl"
              >
                <PlusCircleIcon />
              </ActionIcon>
            </NavLink>
          </ShowIf>
        </div>
        <div className="px-user-studies">
          <ShowIf if={studies.length === 0}>
            <Text size={"sm"}>{placeholder}</Text>
          </ShowIf>
          {studies.map(
            (s, idx) =>
              s && (
                <div key={idx} className="px-user-study mb-8">
                  <StudyCard
                    withDivider={studies.length - 1 !== idx}
                    study={s}
                  />
                </div>
              )
          )}
        </div>
      </Container>
      <Container className="px-container-wrapper px-user-resume-experiences">
        <div className="px-user-resume-experiences-heading flex justify-between">
          <Title order={4} mb="md">
            Experience
          </Title>
          <ShowIf if={editable}>
            <NavLink
              to={`/app/up/${userProfile?.profileSlugUrl}/experiences/new`}
            >
              <ActionIcon
                variant="subtle"
                size="lg"
                color={"violet"}
                radius="xl"
              >
                <PlusCircleIcon />
              </ActionIcon>
            </NavLink>
          </ShowIf>
        </div>
        <div className="px-user-experiences">
          <ShowIf if={Object.entries(experiences).length === 0}>
            <Text size={"sm"}>{placeholder}</Text>
          </ShowIf>
          {Object.entries(experiences).map((e, idx) => (
            <div key={e[0] ?? idx} className="px-user-experience mb-8">
              {/* @ts-expect-error("types error") */}
              <ExperienceCard experience={e} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
