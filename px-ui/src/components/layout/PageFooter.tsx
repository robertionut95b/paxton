import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { Anchor, List, createStyles } from "@mantine/core";
import { NavLink } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  footerLink: {
    color:
      theme.colorScheme === "dark" ? theme.colors.violet[4] : theme.colors.gray,
  },
}));

const PageFooter = () => {
  const { classes } = useStyles();
  return (
    <List size={"xs"} spacing={5}>
      <List.Item>
        <Anchor
          component={NavLink}
          to="/app/about-us"
          className={classes.footerLink}
        >
          About us
        </Anchor>
      </List.Item>
      <List.Item>
        <Anchor
          component={NavLink}
          to="/app/support"
          className={classes.footerLink}
        >
          Ask for support
        </Anchor>
      </List.Item>
      <List.Item>
        <Anchor
          component={NavLink}
          to="/app/terms-and-services/confidentiality"
          className={classes.footerLink}
        >
          Confidentiality
        </Anchor>
      </List.Item>
      <List.Item icon={<BuildingOffice2Icon className="-mr-1.5" width={14} />}>
        Paxton Inc © {new Date().getFullYear()}
      </List.Item>
    </List>
  );
};

export default PageFooter;
