import { useAuth } from "@auth/useAuth";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Group, Text } from "@mantine/core";

export default function ProfileCard() {
    const { user } = useAuth();
    return (
        <div className="flex justify-between">
            <Group align={"center"}>
                <Avatar radius={"md"} size={100} color={"violet"}>{user?.username[0].toLocaleUpperCase() ?? "U"}</Avatar>
                <div>
                    <Text className="" color={"dimmed"}>
                        Software Developer
                    </Text>
                    <Text className="uppercase font-semibold">
                        {user?.username}
                    </Text>
                    <Text>
                        Bucharest, Romania
                    </Text>
                </div>
            </Group>
            <div className="self-center">
                <Button rightIcon={
                    <PencilIcon width={16} />
                }>Edit</Button>
            </div>
        </div>
    )
}