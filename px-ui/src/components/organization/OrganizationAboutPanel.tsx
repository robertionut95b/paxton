import MapChart from "@components/map/MapChart";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import ExpandableText from "@components/visibility/ExpandableText";
import { useGetOrganizationBySlugNameQuery } from "@gql/generated";
import { BuildingOfficeIcon, MapIcon } from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Anchor,
  Badge,
  Button,
  Divider,
  Group,
  List,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { prettyEnumValue, prettyEnumValueCompanySize } from "@utils/enumUtils";
import { format } from "date-fns";
import { useMemo } from "react";
import { When } from "react-if";
import { NavLink, useParams } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";

type OrganizationAboutPanelProps = {
  compact?: boolean;
};

const OrganizationAboutPanel = ({
  compact = false,
}: OrganizationAboutPanelProps) => {
  const { organizationSlug } = useParams();
  const { isDarkMode } = useDarkMode();
  const { data: organization, isLoading: isLoadingOrganization } =
    useGetOrganizationBySlugNameQuery(
      graphqlRequestClient,
      {
        slugName: organizationSlug as string,
      },
      {
        enabled: !!organizationSlug,
      },
    );
  const organizationItem = organization?.getOrganizationBySlugName;

  const mapMarkers = useMemo(
    () =>
      (organizationItem?.locations ?? []).map((l) => ({
        name: l?.name ?? "",
        lng: l?.longitude?.toString() ?? "",
        lat: l?.latitude?.toString() ?? "",
      })),
    [organizationItem?.locations],
  );

  if (isLoadingOrganization) return <GenericLoadingSkeleton />;
  if (!organization?.getOrganizationBySlugName || !organizationItem)
    return <NotFoundPage />;

  const {
    description,
    webSite,
    activitySector,
    companySize,
    headQuarters,
    foundedAt,
    specializations,
    locations = [],
  } = organizationItem;

  if (compact)
    return (
      <Paper p="md" shadow="xs">
        <Stack>
          <Title order={5}>About</Title>
          <ExpandableText size="sm">{description}</ExpandableText>
          <Divider />
          <Button fullWidth variant="subtle" component={NavLink} to="about">
            See all details
          </Button>
        </Stack>
      </Paper>
    );

  return (
    <Stack>
      <Paper p="md" shadow="xs">
        <Stack>
          <Title order={5}>About</Title>
          <ExpandableText size="sm" expanded={!compact}>
            {description}
          </ExpandableText>
          <Stack>
            <Stack spacing={2}>
              <When condition={!!webSite}>
                <Text size="sm" weight="bold">
                  Website
                </Text>
                <Anchor
                  size="sm"
                  href={!webSite ? "#" : (webSite as string)}
                  target="_blank"
                >
                  {webSite}
                </Anchor>
              </When>
            </Stack>
            <Stack spacing={2}>
              <When condition={!!activitySector.name}>
                <Text size="sm" weight="bold">
                  Activity sector
                </Text>
                <Text size="sm">{activitySector.name}</Text>
              </When>
            </Stack>
            <Stack spacing={2}>
              <When condition={companySize}>
                <Text size="sm" weight="bold">
                  Company size
                </Text>
                <Text size="sm">
                  {prettyEnumValueCompanySize(companySize)} employees
                </Text>
              </When>
            </Stack>
            <Stack spacing={2}>
              <When condition={headQuarters.country.name}>
                <Text size="sm" weight="bold">
                  Headquarters
                </Text>
                <Text size="sm">
                  {`${headQuarters.name}, ${headQuarters.country.name}`}
                </Text>
              </When>
            </Stack>
            <Stack spacing={2}>
              <When condition={!!foundedAt}>
                <Text size="sm" weight="bold">
                  Founded
                </Text>
                <Text size="sm">
                  {format(new Date(foundedAt), "dd MMM, yyyy")}
                </Text>
              </When>
            </Stack>
            <Stack spacing={"xs"}>
              <When condition={!!specializations}>
                <Text size="sm" weight="bold">
                  Specializations
                </Text>
                <Group spacing={5}>
                  {(specializations ?? []).map(
                    (s) => s && <Badge key={s}>{prettyEnumValue(s)}</Badge>,
                  )}
                </Group>
              </When>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
      <When condition={locations && locations.length > 0}>
        <Paper p="md" shadow="xs">
          <Title order={5} mb="sm">
            Locations ({locations?.length})
          </Title>
          <List size="sm" center spacing={"xs"}>
            {locations?.map(
              (l) =>
                l && (
                  <List.Item
                    key={l.id}
                    icon={
                      l.id === headQuarters.id ? (
                        <BuildingOfficeIcon width={14} />
                      ) : (
                        <MapIcon width={14} />
                      )
                    }
                  >
                    {`${l?.country.name}, ${l?.name}`}{" "}
                    {l.id === headQuarters.id && (
                      <Badge size="xs">Headquarters</Badge>
                    )}
                  </List.Item>
                ),
            )}
          </List>
          <MapChart darkMode={isDarkMode} markers={mapMarkers} />
        </Paper>
      </When>
    </Stack>
  );
};

export default OrganizationAboutPanel;
