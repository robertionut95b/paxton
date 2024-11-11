import { Routes } from "@app/routes";
import MapChart from "@components/ui/map/MapChart";
import { useGetOrganizationBySlugNameQuery } from "@gql/generated";
import {
  BuildingOfficeIcon,
  CalendarDaysIcon,
  CogIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  MapIcon,
  PencilIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import {
  Avatar,
  Badge,
  Blockquote,
  Box,
  Button,
  Center,
  Divider,
  Group,
  List,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { prettyEnumValue, prettyEnumValueCompanySize } from "@utils/enumUtils";
import { useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";

const OrganizationSettingsMainPage = () => {
  const { organizationSlug } = useParams();
  const { isDarkMode } = useDarkMode();

  const { data: organizationData, isLoading: isOrganizationLoading } =
    useGetOrganizationBySlugNameQuery(graphqlRequestClient, {
      slugName: organizationSlug as string,
    });

  const mapMarkers = useMemo(
    () =>
      (organizationData?.getOrganizationBySlugName?.locations ?? []).map(
        (l) => ({
          name: l?.name ?? "",
          lng: l?.longitude?.toString() ?? "",
          lat: l?.latitude?.toString() ?? "",
        }),
      ),
    [organizationData?.getOrganizationBySlugName?.locations],
  );

  if (isOrganizationLoading)
    return (
      <Paper p="md" shadow="xs">
        <Center>
          <Loader size="sm" />
        </Center>
      </Paper>
    );

  const organization =
    organizationData?.getOrganizationBySlugName as NonNullable<
      NonNullable<typeof organizationData>["getOrganizationBySlugName"]
    >;

  return (
    <Stack spacing={"sm"}>
      <Group position="apart" align="baseline">
        <Title order={4}>{organization.name} settings</Title>
        <Button
          variant="filled"
          leftIcon={<PencilIcon width={16} />}
          component={NavLink}
          to={Routes.Organizations.Details.Update.buildPath({
            organizationSlug: organizationSlug as string,
          })}
        >
          Edit
        </Button>
      </Group>
      <Paper p="md" shadow="xs">
        <Stack>
          <Box>
            <Title order={5}>Organization information</Title>
            <Text size="sm" color="dimmed">
              General information about the organization
            </Text>
            <Divider mt="sm" />
          </Box>
          <Group noWrap>
            {organization.photography && (
              <Avatar size="lg" radius="lg" src={organization.photography} />
            )}
            <Blockquote color="violet">{organization.slogan}</Blockquote>
          </Group>
          <TextInput
            label="Name"
            readOnly
            defaultValue={organization.name}
            icon={<BuildingOfficeIcon width={16} />}
          />
          <TextInput
            label="Activity sector"
            readOnly
            defaultValue={organization.activitySector.name}
            icon={<CogIcon width={16} />}
          />
          <Textarea
            autosize
            label="Description"
            readOnly
            defaultValue={organization.description}
            icon={<DocumentTextIcon width={16} />}
          />
          <TextInput
            label="Company size"
            readOnly
            defaultValue={
              prettyEnumValueCompanySize(organization.companySize, "_") +
              " employees"
            }
            icon={<UsersIcon width={16} />}
          />
          {organization.webSite && (
            <TextInput
              label="Website"
              readOnly
              defaultValue={organization.webSite.toString()}
              icon={<GlobeAltIcon width={16} />}
            />
          )}
          {organization.foundedAt && (
            <DatePicker
              label="Founded"
              readOnly
              icon={<CalendarDaysIcon width={16} />}
              defaultValue={new Date(organization.foundedAt)}
            />
          )}
        </Stack>
      </Paper>
      {organization.specializations && (
        <Paper p="md" shadow="xs">
          <Stack>
            <Box>
              <Title order={5}>Specializations</Title>
              <Text size="sm" color="dimmed">
                Areas of expertise for this organization
              </Text>
              <Divider mt="sm" />
            </Box>
            <Group spacing={10}>
              {organization.specializations.map(
                (s) => s && <Badge key={s}>{prettyEnumValue(s)}</Badge>,
              )}
            </Group>
          </Stack>
        </Paper>
      )}
      {(organization.locations?.length ?? 0) > 0 && (
        <Paper p="md" shadow="xs">
          <Stack>
            <Box>
              <Title order={5}>Locations</Title>
              <Text size="sm" color="dimmed">
                Activity points of this organization
              </Text>
              <Divider mt="sm" />
            </Box>
            <Box>
              <List size="sm" center spacing={"xs"}>
                {organization?.locations?.map(
                  (l) =>
                    l && (
                      <List.Item
                        key={l.id}
                        icon={
                          l.id === organization.headQuarters.id ? (
                            <BuildingOfficeIcon width={14} />
                          ) : (
                            <MapIcon width={14} />
                          )
                        }
                      >
                        {`${l?.country.name}, ${l?.name}`}{" "}
                        {l.id === organization.headQuarters.id && (
                          <Badge size="xs">Headquarters</Badge>
                        )}
                      </List.Item>
                    ),
                )}
              </List>
              <MapChart darkMode={isDarkMode} markers={mapMarkers} />
            </Box>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

export default OrganizationSettingsMainPage;
