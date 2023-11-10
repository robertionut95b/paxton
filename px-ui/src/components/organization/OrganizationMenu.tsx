import RoleType from "@auth/RoleType";
import {
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Anchor, List, Paper } from "@mantine/core";
import { NavLink, To } from "react-router-dom";

type MenuLinkProps = {
  icon: React.ReactNode;
  to: To;
  text: string;
  allowedRole: RoleType;
};

const links: MenuLinkProps[] = [
  {
    icon: <ClipboardDocumentCheckIcon width={18} />,
    text: "Recruitment",
    to: "recruitment/jobs",
    allowedRole: RoleType.ROLE_RECRUITER,
  },
  {
    icon: <UsersIcon width={18} />,
    text: "Contacts",
    to: "contacts",
    allowedRole: RoleType.ROLE_EVERYONE,
  },
  {
    icon: <BuildingOfficeIcon width={18} />,
    text: "Organization settings",
    to: "settings",
    allowedRole: RoleType.ROLE_RECRUITER,
  },
  {
    icon: <BuildingOffice2Icon width={18} />,
    text: "About organization",
    to: "about",
    allowedRole: RoleType.ROLE_EVERYONE,
  },
];

type OrganizationLeftMenuProps = {
  rolesToShow: RoleType[];
};

const OrganizationMenu = ({
  rolesToShow = [RoleType.ROLE_EVERYONE],
}: OrganizationLeftMenuProps) => {
  return (
    <Paper shadow={"xs"} p="md">
      <List spacing={"sm"} size="sm">
        {links.map((l) =>
          rolesToShow.includes(l.allowedRole) ? (
            <List.Item key={l.to.toString()} icon={l.icon}>
              <Anchor component={NavLink} to={l.to} variant="text">
                {l.text}
              </Anchor>
            </List.Item>
          ) : null,
        )}
      </List>
    </Paper>
  );
};

export default OrganizationMenu;
