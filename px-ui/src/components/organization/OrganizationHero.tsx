import { GetOrganizationBySlugNameQuery, Organization } from "@gql/generated";
import {
  ArrowTopRightOnSquareIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import {
  Avatar,
  Button,
  Divider,
  Group,
  Image,
  NavLink as MantineNavLink,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { When } from "react-if";
import { NavLink, useLocation } from "react-router-dom";

type OrganizationHeroProps = {
  organization:
    | Organization
    | NonNullable<GetOrganizationBySlugNameQuery["getOrganizationBySlugName"]>;
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const OrganizationHero = ({ organization }: OrganizationHeroProps) => {
  const {
    slugName,
    name,
    photography,
    activitySector,
    slogan,
    headQuarters,
    webSite,
  } = organization ?? {};
  const { pathname } = useLocation();
  const backgroundPic = "/images/bg-profile.jpg";
  const profilePic = photography ?? backgroundPic;
  const links: { link: string; label: string }[] = [
    {
      link: `/app/organizations/${slugName}`,
      label: "Home",
    },
    {
      link: "about",
      label: "About",
    },
    {
      link: "notices",
      label: "Notices",
    },
    {
      link: "jobs",
      label: "Jobs",
    },
    {
      link: "people",
      label: "People",
    },
    {
      link: "more",
      label: "More",
    },
  ];
  return (
    <Paper className="relative" shadow="xs">
      <div className="px-organization-cover">
        <Image
          src={backgroundPic}
          mb={60}
          styles={{
            image: {
              borderTopLeftRadius: "0.375rem",
              borderTopRightRadius: "0.375rem",
              minHeight: "134px",
              maxHeight: "134px",
            },
          }}
        />
      </div>
      <Avatar
        styles={{
          root: {
            position: "absolute",
            top: "4.5rem",
            left: "1.75rem",
            border: "2px solid white",
          },
          image: {
            backgroundColor: "white",
            objectFit: "contain",
          },
        }}
        src={profilePic}
        size={110}
        radius={0}
      />
      <Stack pt="md" px="md" pb={2} spacing={0}>
        <Title order={3} mb={0}>
          {name}
        </Title>
        <When condition={slogan}>
          <Text>{slogan}</Text>
        </When>
        <Text size="sm" color="dimmed" mb="sm">
          {activitySector.name} -{" "}
          {`${headQuarters.country.name}, ${headQuarters.name}`} -{" "}
          {getRandomInt(1, 100000) + " followers"}
        </Text>
        <Group mb={"sm"}>
          <Avatar.Group spacing="md">
            <Avatar radius="xl" />
            <Avatar radius="xl" />
            <Avatar radius="xl" />
          </Avatar.Group>
          <Text size="sm">
            {getRandomInt(1, 25)} more from your company are working here -{" "}
            {getRandomInt(1, 100000)} employees
          </Text>
        </Group>
        <Group>
          <Button leftIcon={<PlusIcon width={20} />}>Follow</Button>
          <When condition={!!webSite}>
            <Button
              variant="outline"
              leftIcon={<ArrowTopRightOnSquareIcon width={20} />}
              component={"a"}
              href={!webSite ? "#" : (webSite as string)}
              target="_blank"
            >
              Visit website
            </Button>
          </When>
          <Button
            variant="outline"
            rightIcon={<EllipsisHorizontalIcon width={20} />}
          >
            More
          </Button>
        </Group>
        <Divider mt={"md"} mx={"-17px"} />
        <Group mx="-17px" mt="xs" px="md" pb={0} spacing={0}>
          {links.map((l) => (
            <MantineNavLink
              key={l.label}
              label={l.label}
              component={NavLink}
              to={l.link}
              noWrap
              variant="subtle"
              active={pathname.endsWith(l.link)}
              styles={{
                root: {
                  maxWidth: "fit-content",
                },
              }}
            />
          ))}
        </Group>
      </Stack>
    </Paper>
  );
};

export default OrganizationHero;
