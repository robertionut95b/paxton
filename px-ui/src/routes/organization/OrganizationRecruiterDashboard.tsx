import { useAuth } from "@auth/useAuth";
import ShowIf from "@components/visibility/ShowIf";
import { useGetUserProfileQuery } from "@gql/generated";
import {
  BuildingOfficeIcon,
  ClipboardDocumentIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Avatar, Button, Group, Paper, Text } from "@mantine/core";
import { NavLink } from "react-router-dom";

export default function OrganizationRecruiterDashboard() {
  const { user } = useAuth();

  const { data: userProfile, isLoading: isLoadingUserProfile } =
    useGetUserProfileQuery(graphqlRequestClient, {
      profileSlugUrl: user?.profileSlugUrl,
    });

  const lastOrganization =
    userProfile?.getUserProfile?.experiences?.[0]?.organization;

  return (
    <div className="px-recruiter-org-dashboard flex flex-col flex-wrap">
      <Paper shadow={"xs"} p="md">
        <Group position="apart">
          <Group spacing="xs">
            <NavLink to={`/app/organizations/${lastOrganization?.id}/jobs`}>
              <Button
                leftIcon={<BuildingOfficeIcon width={16} />}
                variant="light"
              >
                Company's jobs
              </Button>
            </NavLink>
            <NavLink
              to={`/app/organizations/${lastOrganization?.id}/jobs/publish-job/form`}
            >
              <Button
                leftIcon={<ClipboardDocumentIcon width={16} />}
                variant="light"
              >
                Publish jobs
              </Button>
            </NavLink>
            <NavLink to={`/app/organizations/${lastOrganization?.id}/contacts`}>
              <Button leftIcon={<UserIcon width={16} />} variant="light">
                Contacts
              </Button>
            </NavLink>
          </Group>
          <ShowIf if={lastOrganization}>
            <NavLink to={`/app/organizations/${lastOrganization?.id}/details`}>
              <Group>
                <Text className="hidden md:block" size="sm">
                  {lastOrganization?.name}
                </Text>
                <Avatar
                  size="sm"
                  src={lastOrganization?.photography}
                  title={lastOrganization?.name}
                >
                  {lastOrganization?.name?.[0]}
                </Avatar>
              </Group>
            </NavLink>
          </ShowIf>
        </Group>
      </Paper>
    </div>
  );
}
