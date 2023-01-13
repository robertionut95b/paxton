import ExperienceCard from "@components/cards/ExperienceCard";
import StudyCard from "@components/cards/StudyCard";
import ExpandableText from "@components/visibility/ExpandableText";
import ShowIf from "@components/visibility/ShowIf";
import ShowIfElse from "@components/visibility/ShowIfElse";
import { GetUserProfileQuery, UserProfile } from "@gql/generated";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Group, Paper, Stack, Text, Title } from "@mantine/core";
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
    <Stack className="px-user-resume">
      <Paper shadow="sm" p="md">
        <Title mb={"md"} order={4}>
          About
        </Title>
        <Group className="px-user-resume-description" grow>
          <ShowIfElse
            if={userProfile?.description}
            else={<Text size="sm">{placeholder}</Text>}
          >
            <ExpandableText size={15}>
              {userProfile?.description}
            </ExpandableText>
          </ShowIfElse>
        </Group>
      </Paper>
      <Paper shadow="sm" p="md" className=" px-user-resume-studies">
        <Group
          className="px-user-resume-studies-heading"
          position="apart"
          align="center"
        >
          <Title order={4} mb={"lg"}>
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
        </Group>
        <Paper className="px-user-studies">
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
        </Paper>
      </Paper>
      <Paper shadow="sm" p="md" className="px-user-resume-experiences">
        <Group
          position="apart"
          align="center"
          className="px-user-resume-experiences-heading"
        >
          <Title order={4} mb="lg">
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
        </Group>
        <Paper className="px-user-experiences">
          <ShowIf if={Object.entries(experiences).length === 0}>
            <Text size={"sm"}>{placeholder}</Text>
          </ShowIf>
          {Object.entries(experiences).map((e, idx) => (
            <div key={e[0] ?? idx} className="px-user-experience mb-8">
              {/* @ts-expect-error("types error") */}
              <ExperienceCard experience={e} />
            </div>
          ))}
        </Paper>
      </Paper>
    </Stack>
  );
}
