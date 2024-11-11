import { Routes } from "@app/routes";
import { GetOrganizationBySlugNameQuery, Organization } from "@gql/generated";
import { ClipboardDocumentIcon, UserIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Group, Paper, Text } from "@mantine/core";
import { When } from "react-if";
import { NavLink } from "react-router-dom";

export default function OrganizationToolbar({
  organization,
}: {
  organization: NonNullable<
    GetOrganizationBySlugNameQuery["getOrganizationBySlugName"] | Organization
  >;
}) {
  return (
    <Paper shadow={"xs"} p="md">
      <Group position="apart">
        <Group spacing="xs">
          <NavLink
            to={Routes.Organizations.Details.Jobs.Publish.buildPath({
              organizationSlug: organization.slugName,
            })}
          >
            <Button
              leftIcon={<ClipboardDocumentIcon width={16} />}
              variant="light"
            >
              Publish jobs
            </Button>
          </NavLink>
          <NavLink
            to={Routes.Organizations.Details.People.buildPath({
              organizationSlug: organization.slugName,
            })}
          >
            <Button leftIcon={<UserIcon width={16} />} variant="light">
              Contacts
            </Button>
          </NavLink>
        </Group>
        <When condition={!!organization}>
          <NavLink
            to={Routes.Organizations.Details.buildPath({
              organizationSlug: organization.slugName,
            })}
          >
            <Group>
              <Text className="hidden sm:block" size={"sm"}>
                {organization?.name}
              </Text>
              <Avatar
                size="sm"
                src={organization?.photography}
                title={organization?.name}
                styles={{
                  image: {
                    objectFit: "contain",
                  },
                }}
              >
                {organization?.name?.[0]}
              </Avatar>
            </Group>
          </NavLink>
        </When>
      </Group>
    </Paper>
  );
}
