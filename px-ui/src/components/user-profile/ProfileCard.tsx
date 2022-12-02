import ShowIfElse from "@components/visibility/ShowIfElse";
import { Avatar, Group, Text } from "@mantine/core";
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
}: {
  username: string;
  photography?: string | null;
  title?: string;
  location?: string;
  firstName?: string | null;
  lastName?: string | null;
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
        <Text size="md" className="capitalize font-semibold">
          <ShowIfElse if={firstName && lastName} else={username}>
            {`${firstName} ${lastName}`}
          </ShowIfElse>
        </Text>
        <Text size="sm">{location ?? "No location available"}</Text>
      </div>
    </Group>
  );
}
