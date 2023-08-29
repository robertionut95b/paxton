import { UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Button,
  Card,
  Center,
  Group,
  Image,
  Indicator,
  Text,
} from "@mantine/core";
import { displayInitials } from "@utils/initials";
import { NavLink } from "react-router-dom";
import { SuggestionItemProps } from "./SuggestionsList";

type UserSuggestionCardProps = {
  user: SuggestionItemProps;
};

const UserSuggestionCard = ({ user }: UserSuggestionCardProps) => {
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      h={"100%"}
      className="relative"
    >
      <Card.Section
        component={NavLink}
        to={`/app/up/${user.userProfile.profileSlugUrl}`}
      >
        <Image
          src={user.userProfile.coverPhotography ?? "/images/bg-profile.jpg"}
          height={100}
          alt="Norway"
        />
      </Card.Section>

      <Center className="absolute left-12 top-10">
        <Indicator label="X" size={30} inline>
          <Avatar
            size={90}
            radius={100}
            variant="filled"
            src={user.userProfile.photography ?? undefined}
          >
            {displayInitials("U", user.firstName, user.lastName)}
          </Avatar>
        </Indicator>
      </Center>

      <Group position="center" mt={40}>
        <Text className="line-clamp-1" align="center" weight={500}>
          {user.displayName}
        </Text>
      </Group>

      <Text className="line-clamp-1" size="xs" color="dimmed" align="center">
        {user.userProfile.profileTitle}
      </Text>

      <Button
        variant="light"
        color="violet"
        fullWidth
        mt="md"
        radius="md"
        leftIcon={<UserPlusIcon width={16} />}
      >
        Connect
      </Button>
    </Card>
  );
};

export default UserSuggestionCard;
