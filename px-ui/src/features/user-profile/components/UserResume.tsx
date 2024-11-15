import { Routes } from "@app/routes";
import ExpandableText from "@components/ui/text/ExpandableText";
import ExperienceCard from "@features/user-profile/components/ExperienceCard";
import StudyCard from "@features/user-profile/components/StudyCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GetUserProfileQuery, UserProfile } from "@gql/generated";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Group, Paper, Stack, Text, Title } from "@mantine/core";
import groupBy from "lodash/groupBy";
import { Else, If, Then, When } from "react-if";
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
    groupBy(userProfile?.experiences ?? [], "organization.id") ?? [];

  const placeholder = "No information was provided";
  const [parent] = useAutoAnimate();

  return (
    <Stack className="px-user-resume">
      <Paper shadow="sm" p="md">
        <Title mb={"md"} order={4}>
          About
        </Title>
        <Group className="px-user-resume-description" grow>
          <If condition={userProfile?.description}>
            <Then>
              <ExpandableText size={15}>
                {userProfile?.description}
              </ExpandableText>
            </Then>
            <Else>
              <Text size="sm">{placeholder}</Text>
            </Else>
          </If>
        </Group>
      </Paper>
      <Paper shadow="sm" p="md" className="px-user-resume-studies">
        <Group
          className="px-user-resume-studies-heading"
          position="apart"
          align="center"
        >
          <Title order={4} mb={"lg"}>
            Studies
          </Title>
          <When condition={editable}>
            <NavLink
              to={Routes.UserProfile.StudiesNew.buildPath({
                profileSlug: userProfile!.profileSlugUrl,
              })}
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
          </When>
        </Group>
        <Paper className="px-user-studies" ref={parent}>
          <When condition={studies.length === 0}>
            <Text size={"sm"}>{placeholder}</Text>
          </When>
          {studies.map(
            (s, idx) =>
              s && (
                <div key={idx} className="px-user-study mb-8">
                  <StudyCard
                    withDivider={studies.length - 1 !== idx}
                    // @ts-expect-error("types-to-fix")
                    study={s}
                  />
                </div>
              ),
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
          <When condition={editable}>
            <NavLink
              to={Routes.UserProfile.ExperiencesNew.buildPath({
                profileSlug: userProfile!.profileSlugUrl,
              })}
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
          </When>
        </Group>
        <Paper className="px-user-experiences">
          <When condition={Object.entries(experiences).length === 0}>
            <Text size={"sm"}>{placeholder}</Text>
          </When>
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
