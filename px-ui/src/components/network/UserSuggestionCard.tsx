import { APP_IMAGES_API_PATH } from "@constants/Properties";
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
import { SuggestionItemProps } from "./UsersSuggestionsSection";

type UserSuggestionCardProps = {
  user: SuggestionItemProps;
  onConnectClick: (user: SuggestionItemProps) => void;
};

const UserSuggestionCard = ({
  user,
  onConnectClick,
}: UserSuggestionCardProps) => {
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
          src={
            user.userProfile.coverPhotography
              ? `${APP_IMAGES_API_PATH}/200x400/${user.userProfile.coverPhotography}`
              : "/images/bg-profile.jpg"
          }
          height={100}
          alt="OfficeCities"
        />
      </Card.Section>

      <Center className="absolute left-0 right-0 top-10 mx-auto">
        <Indicator label="X" size={30} inline>
          <Avatar
            size={90}
            radius={100}
            variant="filled"
            src={
              user.userProfile.photography
                ? `${APP_IMAGES_API_PATH}/200x200/${user.userProfile.photography}`
                : undefined
            }
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
        onClick={() => onConnectClick(user)}
      >
        Connect
      </Button>
    </Card>
  );
};

export default UserSuggestionCard;
