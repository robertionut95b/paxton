import { User, UserProfile } from "@gql/generated";
import { Grid, Group, Stack, Title } from "@mantine/core";
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

type SuggestionsListProps = {
  title: string;
  link: string;
  data: SuggestionItemProps[];
};

const SuggestionsList = ({ title, link, data }: SuggestionsListProps) => {
  return (
    <Stack>
      <Group position="apart">
        <Title order={5} weight="normal">
          {title}
        </Title>
        <Title order={6}>
          <NavLink to={link}>See all options</NavLink>
        </Title>
      </Group>
      <Grid gutter="md">
        {data.map((u) => (
          <Grid.Col span={3} key={u.id}>
            <UserSuggestionCard user={u} />
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};

export default SuggestionsList;
