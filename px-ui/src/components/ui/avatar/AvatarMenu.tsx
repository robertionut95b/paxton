import { Routes } from "@app/routes";
import { ThemeTogglerMenuItem } from "@components/ui/theme/ThemeToggler";
import {
  ExclamationTriangleIcon,
  IdentificationIcon,
  InboxIcon,
  NewspaperIcon,
  UsersIcon,
  WrenchIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { User } from "@interfaces/user";
import { Avatar, Menu } from "@mantine/core";
import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const AvatarMenu = ({
  user,
  profileLink,
  src,
  signOutFn,
}: {
  user?: User | null;
  profileLink: string;
  src?: string | null;
  signOutFn?: () => void;
}) => {
  const link = Routes.UserProfile.buildPath({
    profileSlug: profileLink,
  });
  useEffect(() => {
    if (!signOutFn) {
      // pass
    }
  }, [signOutFn]);
  return (
    <Menu shadow="md" width={200} transitionDuration={300}>
      <Menu.Target>
        <Avatar
          className="cursor-pointer"
          radius={"xl"}
          color="violet"
          src={src}
        >
          {user?.firstName && user.lastName
            ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
            : (user?.username?.[0].toUpperCase() ?? "U")}
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>User management</Menu.Label>
        <Menu.Item
          component={Link}
          to={link}
          icon={<IdentificationIcon width={16} />}
        >
          Profile
        </Menu.Item>
        <Menu.Item
          icon={<UsersIcon width={16} />}
          component={NavLink}
          to="network"
        >
          Network
        </Menu.Item>
        <Menu.Item icon={<InboxIcon width={16} />}>Messages</Menu.Item>
        <Menu.Item icon={<NewspaperIcon width={16} />}>Notifications</Menu.Item>
        <Menu.Item icon={<WrenchIcon width={16} />}>Settings</Menu.Item>
        <ThemeTogglerMenuItem />
        <Menu.Divider />
        <Menu.Label>Account</Menu.Label>
        <Menu.Item icon={<ExclamationTriangleIcon width={16} />}>
          Security settings
        </Menu.Item>
        <Menu.Item
          color="red"
          icon={<XMarkIcon width={16} />}
          onClick={signOutFn}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default AvatarMenu;
