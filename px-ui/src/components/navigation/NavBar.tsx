import { useAuth } from "@auth/useAuth";
import { LogoWithSearch } from "@components/Logo";
import { User } from "@interfaces/user.types";
import {
  Burger,
  Container,
  Group,
  Header,
  MediaQuery,
  Paper,
  Stack,
  Transition,
  createStyles,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ReactNode, useCallback, useState } from "react";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import AvatarMenu from "./AvatarMenu";

export interface LinkItem {
  link: string;
  label: string;
  icon?: ReactNode;
}

interface NavBarProps {
  links: LinkItem[];
  user?: User | null;
  profileLink?: string;
  avatarSrc?: string | null;
}

const HEADER_HEIGHT = 56;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 1,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
    paddingTop: theme.spacing.xs - 5,
    paddingBottom: theme.spacing.xs - 5,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.xs - 1,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.sm,
      fontSize: theme.fontSizes.sm,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

const NavBar = ({ links, user, profileLink, avatarSrc }: NavBarProps) => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const location = useLocation();
  const [active, setActive] = useState(location.pathname || links[0].link);
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const { signout } = useAuth();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const signOutCb = useCallback(() => signout(() => redirect("/app")), []);

  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        close();
        navigate(link.link);
      }}
    >
      <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
        <Group align={"center"} spacing={6}>
          {link.icon && link.icon}
          {link.label}
        </Group>
      </MediaQuery>
      <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
        <Stack align={"center"} spacing={6}>
          {link.icon && link.icon}
          {link.label}
        </Stack>
      </MediaQuery>
    </Link>
  ));

  return (
    <Header height={HEADER_HEIGHT} mb={30}>
      <Container className={classes.header} size="lg">
        <LogoWithSearch />
        <Group spacing={"xs"}>
          <Group className={classes.links} spacing={5}>
            {items}
          </Group>
          <AvatarMenu
            user={user}
            profileLink={profileLink}
            src={avatarSrc}
            signOutFn={signOutCb}
          />
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
          <Transition
            transition="pop-top-right"
            duration={300}
            mounted={opened}
          >
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items}
              </Paper>
            )}
          </Transition>
        </Group>
      </Container>
    </Header>
  );
};

export default NavBar;
