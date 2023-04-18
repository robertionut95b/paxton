import ShowIfElse from "@components/visibility/ShowIfElse";
import { User, UserProfile } from "@gql/generated";
import {
  ChatBubbleLeftEllipsisIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { ActionIcon, Avatar, Badge, Group, Stack, Text } from "@mantine/core";
import format from "date-fns/format";
import { NavLink } from "react-router-dom";

type UserProfileType = Pick<UserProfile, "photography" | "profileTitle">;

type UserLineCardProps = {
  user: Omit<
    User,
    "email" | "isEmailConfirmed" | "username" | "userProfile" | "createdAt"
  > & {
    userProfile: UserProfileType;
  };
  joinedAt: Date;
};

const UserLineCard = ({ user, joinedAt }: UserLineCardProps) => {
  return (
    <Stack>
      <Group position="apart" noWrap>
        <Group noWrap>
          <ShowIfElse
            if={user?.userProfile?.photography}
            else={
              <Avatar
                size="lg"
                radius="xl"
                variant="filled"
              >{`${user.firstName?.[0].toUpperCase()}${user.lastName?.[0].toUpperCase()}`}</Avatar>
            }
          >
            <Avatar size="lg" radius="xl" src={user.userProfile.photography}>
              {user.displayName}
            </Avatar>
          </ShowIfElse>
          <Stack spacing={0}>
            <NavLink to={`${user.id}`}>
              <Text size="sm" weight="bold" color="gray.8">
                {user.displayName}
              </Text>
              <Text size="sm" color="dimmed">
                {user?.userProfile?.profileTitle}
              </Text>
            </NavLink>
          </Stack>
        </Group>
        <Stack spacing={5}>
          <Badge>Joined {format(new Date(joinedAt), "MMM yyyy")}</Badge>
          <Group position="center" spacing="xs">
            <ActionIcon>
              <ChatBubbleLeftEllipsisIcon
                width={24}
                title={`Message ${user.displayName}`}
              />
            </ActionIcon>
            <ActionIcon component={NavLink} to={`${user.id}/jobs`}>
              <DocumentTextIcon
                width={24}
                title={`Jobs posted by ${user.displayName}`}
              />
            </ActionIcon>
            <ActionIcon>
              <EllipsisHorizontalIcon
                width={24}
                title={`More actions for ${user.displayName}`}
              />
            </ActionIcon>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

export default UserLineCard;
