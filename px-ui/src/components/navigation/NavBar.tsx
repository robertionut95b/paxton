import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Burger,
  Container,
  createStyles,
  Group,
  Header,
  Paper,
  TextInput,
  Title,
  Transition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

interface NavBarProps {
  links: { link: string; label: string }[];
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
    zIndex: 0,
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

  // search: {
  //   [theme.fn.smallerThan("xs")]: {
  //     display: "none",
  //   },
  // },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
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

const NavBar = ({ links }: NavBarProps) => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();
  const { user } = useAuth();
  const navigate = useNavigate();

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
      {link.label}
    </Link>
  ));

  return (
    <Header height={HEADER_HEIGHT} mb={30}>
      <Container className={classes.header}>
        <div className="px-logo flex justify-center items-center gap-x-2">
          <Link
            className="flex justify-center items-center gap-x-2"
            to="/app/feed"
          >
            <BriefcaseIcon width={32} color={"#7950f2"} />
            <Title className="tracking-wider" mt={4} order={4}>
              Paxton
            </Title>
          </Link>
          <TextInput
            // className={classes.search}
            size="sm"
            ml="sm"
            placeholder="Search anything"
            icon={<MagnifyingGlassIcon width={16} />}
          />
        </div>
        <Group className={classes.links} spacing={5}>
          {items}
          <Avatar
            component={Link}
            to="/app/profile"
            radius={"xl"}
            color="violet"
          >
            {user?.username[0].toUpperCase()}
          </Avatar>
        </Group>
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />
        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
};

export default NavBar;
