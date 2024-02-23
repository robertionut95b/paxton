import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Avatar, Badge, Group, Text } from "@mantine/core";
import { Else, If, Then, When } from "react-if";
import { NavLink } from "react-router-dom";

const renderInitials = (firstName?: string | null, lastName?: string | null) =>
  firstName && lastName
    ? `${firstName?.[0]?.toLocaleUpperCase()}${lastName?.[0]?.toLocaleUpperCase()}`
    : "U";

export default function ProfileCard({
  photography,
  title,
  location,
  firstName,
  lastName,
  username,
  isEmailConfirmed = false,
}: {
  username: string;
  photography?: string | null;
  title?: string;
  location?: string;
  firstName?: string | null;
  lastName?: string | null;
  isEmailConfirmed?: boolean;
}) {
  return (
    <Group align={"center"} spacing="xl">
      <NavLink to="update/avatar">
        <Avatar radius={"xl"} size={100} color={"violet"} src={photography}>
          {renderInitials(firstName, lastName)}
        </Avatar>
      </NavLink>
      <div className="px-user-profile-headings">
        <Text size="md" color={"dimmed"}>
          {title ?? "No title available"}
        </Text>
        <Text size="md" className="font-semibold capitalize">
          <If condition={firstName && lastName}>
            <Then>{`${firstName} ${lastName}`}</Then>
            <Else>{username}</Else>
          </If>
        </Text>
        <Text size="sm">{location ?? "No location available"}</Text>
        <When condition={isEmailConfirmed}>
          <Badge
            mt={"xs"}
            color="teal"
            size="sm"
            leftSection={<CheckBadgeIcon width={16} />}
          >
            Verified email
          </Badge>
        </When>
      </div>
    </Group>
  );
}
