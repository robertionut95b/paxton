import { User } from "@interfaces/user.types";
import { Avatar, Group, Text } from "@mantine/core";

export default function ProfileCard({
  photography,
  title,
  location,
  user,
}: {
  photography?: string | null;
  title?: string;
  location?: string;
  user?: User | null;
}) {
  return (
    <Group align={"center"} spacing="xl">
      <Avatar radius={"xl"} size={100} color={"violet"} src={photography}>
        {`${user?.firstName?.[0]?.toLocaleUpperCase()}${user?.lastName?.[0]?.toLocaleUpperCase()}` ??
          "U"}
      </Avatar>
      <div className="px-user-profile-headings">
        <Text size="md" color={"dimmed"}>
          {title ?? "No title available"}
        </Text>
        <Text size="md" className="capitalize font-semibold">
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.username ?? "unknown"}
        </Text>
        <Text size="sm">{location ?? "No location available"}</Text>
      </div>
    </Group>
  );
}
