import { useAutoAnimate } from "@formkit/auto-animate/react";
import { User, UserProfile } from "@gql/generated";
import { Grid, Group, Image, Stack, Text, Title } from "@mantine/core";
import React, { ReactNode } from "react";
import { Else, If, Then } from "react-if";
import { NavLink } from "react-router-dom";
import UserSuggestionCard from "./UserSuggestionCard";

export type SuggestionItemProps = Pick<
  User,
  "firstName" | "lastName" | "id" | "displayName"
> & {
  userProfile: Pick<
    UserProfile,
    "profileTitle" | "photography" | "coverPhotography" | "profileSlugUrl"
  >;
};

type UsersSuggestionsSectionProps = {
  title: string;
  link: string;
  length: number;
  children?: ReactNode;
};

const UsersSuggestionsSection = ({
  title,
  link,
  length,
  children,
}: UsersSuggestionsSectionProps) => {
  const [parent] = useAutoAnimate();
  return (
    <If condition={length > 0}>
      <Then>
        <Stack>
          <Group position="apart">
            <Title order={5} weight="normal">
              {title}
            </Title>
            <Title order={6}>
              <NavLink to={link}>See everything</NavLink>
            </Title>
          </Group>
          <Grid ref={parent} gutter="md">
            {children}
          </Grid>
        </Stack>
      </Then>
      <Else>
        <Stack>
          <Title order={5} weight="normal" mb="sm">
            {title}
          </Title>
          <Stack align="center">
            <Image
              src="/images/connection-network.svg"
              width={86}
              height={86}
            />
            <Title align="center" order={5}>
              No suggestions found
            </Title>
            <Text align="center" size="sm">
              Update your profile to see more people
            </Text>
          </Stack>
        </Stack>
      </Else>
    </If>
  );
};

const UsersSuggestionItem = (
  props: React.ComponentProps<typeof UserSuggestionCard>,
) => {
  return (
    <Grid.Col span={6} sm={4} md={3}>
      <UserSuggestionCard {...props} />
    </Grid.Col>
  );
};

UsersSuggestionsSection.Item = UsersSuggestionItem;

export default UsersSuggestionsSection;
