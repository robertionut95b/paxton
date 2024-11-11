import { Routes } from "@app/routes";
import {
  BuildingOffice2Icon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { Anchor, Group, Stack, Text } from "@mantine/core";
import { NavLink } from "react-router-dom";

const PageFooter = () => {
  return (
    <Stack spacing={"xs"}>
      <Group spacing={"sm"} position="center">
        <Text
          size="xs"
          component={NavLink}
          to={Routes.AboutUs.path}
          variant="link"
        >
          About us
        </Text>
        <Text
          size="xs"
          component={NavLink}
          to={Routes.Support.path}
          variant="link"
        >
          Ask for support
        </Text>
        <Text
          size="xs"
          component={NavLink}
          to={Routes.TermsAndServices.path}
          variant="link"
        >
          Terms and Services
        </Text>
        <Text
          size="xs"
          component={NavLink}
          to={Routes.CurrentPage.path}
          variant="link"
        >
          Business support
        </Text>
        <Text
          size="xs"
          component={NavLink}
          to={Routes.CurrentPage.path}
          variant="link"
        >
          Confidentiality
        </Text>
        <Text
          size="xs"
          component={NavLink}
          to={Routes.Publicity.path}
          variant="link"
        >
          Publicity
        </Text>
        <Text size="xs" component={NavLink} to="#" variant="link">
          More
        </Text>
      </Group>
      <Text size="xs">
        <Group position="center" spacing={"sm"}>
          <BuildingOffice2Icon className="-mr-1.5" width={14} />
          Paxton Inc © {new Date().getFullYear()}
        </Group>
      </Text>
      <Text size="xs">
        <Group position="center" spacing={5}>
          <PaintBrushIcon
            className="-mr-1.5"
            width={14}
            style={{ marginRight: "0.1rem" }}
          />
          Images by <Anchor href="https://www.freepik.com/">Freepik</Anchor>
        </Group>
      </Text>
    </Stack>
  );
};

export default PageFooter;
