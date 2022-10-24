import {
  Burger,
  Container,
  Group,
  Header,
  Paper,
  Transition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

interface NavBarProps {
  links: { link: string; label: string }[];
}

const NavBar = ({ links }: NavBarProps) => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      // className={cx(classes.link, {
      //   [classes.linkActive]: active === link.link,
      // })}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        close();
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <Header height={60} mb={120}>
      <Container>
        <Group spacing={5}>{items}</Group>

        <Burger opened={opened} onClick={toggle} size="sm" />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
};

export default NavBar;
