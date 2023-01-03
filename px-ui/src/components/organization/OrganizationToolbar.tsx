import ShowIf from "@components/visibility/ShowIf";
import { Organization } from "@gql/generated";
import { ClipboardDocumentIcon, UserIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Group, Paper, Text } from "@mantine/core";
import { NavLink } from "react-router-dom";

export default function OrganizationToolbar({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <Paper shadow={"xs"} p="md">
      <Group position="apart">
        <Group spacing="xs">
          <NavLink
            to={`/app/organizations/${organization?.id}/jobs/publish-job/form`}
          >
            <Button
              leftIcon={<ClipboardDocumentIcon width={16} />}
              variant="light"
            >
              Publish jobs
            </Button>
          </NavLink>
          <NavLink to={`/app/organizations/${organization?.id}/contacts`}>
            <Button leftIcon={<UserIcon width={16} />} variant="light">
              Contacts
            </Button>
          </NavLink>
        </Group>
        <ShowIf if={organization}>
          <NavLink to={`/app/organizations/${organization?.id}/details`}>
            <Group>
              <Text className="hidden md:block" size={"sm"}>
                {organization?.name}
              </Text>
              <Avatar
                size="sm"
                src={organization?.photography}
                title={organization?.name}
              >
                {organization?.name?.[0]}
              </Avatar>
            </Group>
          </NavLink>
        </ShowIf>
      </Group>
    </Paper>
  );
}
