import NotFoundPage from "@app/routes/NotFoundPage";
import IsAllowed from "@features/auth/components/IsAllowed";
import { useAuth } from "@features/auth/hooks/useAuth";
import Roles from "@features/auth/types/roles";
import OrganizationHero from "@features/organizations/components/OrganizationHero";
import { useGetOrganizationBySlugNameQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Grid, Group, Paper, Skeleton, Stack, Title } from "@mantine/core";
import { Suspense, lazy } from "react";
import { Outlet, useParams } from "react-router-dom";

const OrganizationToolbarSkeleton = () => (
  <Paper shadow={"xs"} p="md">
    <Group position="apart" align={"center"}>
      <Skeleton height={8} radius="xl" width={"40%"} />
      <Group position="apart" align={"center"} w={"15%"}>
        <Skeleton height={8} radius="xl" width={"65%"} />
        <Skeleton height={28} circle />
      </Group>
    </Group>
  </Paper>
);

export default function OrganizationDetailsPage() {
  const { user, isAuthorized } = useAuth();
  const { organizationSlug } = useParams();

  const { data: organizationData } = useGetOrganizationBySlugNameQuery(
    graphqlRequestClient,
    {
      slugName: organizationSlug as string,
    },
    {
      enabled: !!organizationSlug,
      suspense: true,
    },
  );

  const organizationItem = organizationData?.getOrganizationBySlugName;

  if (!organizationItem) return <NotFoundPage />;

  const OrganizationToolbar = lazy(
    () => import("@features/organizations/components/OrganizationToolbar"),
  );

  const OrganizationLeftMenu = lazy(
    () => import("@features/organizations/components/OrganizationMenu"),
  );

  return (
    <Grid className="px-organization">
      <Grid.Col span={12} sm={9}>
        <Stack>
          <OrganizationHero organization={organizationItem} />
          <IsAllowed roles={[Roles.ROLE_RECRUITER]} renderAuthFailed={null}>
            <Suspense fallback={<OrganizationToolbarSkeleton />}>
              <OrganizationToolbar organization={organizationItem} />
            </Suspense>
          </IsAllowed>
          <Outlet />
        </Stack>
      </Grid.Col>
      <Grid.Col span={12} sm={3}>
        <Stack>
          <Suspense fallback={<OrganizationToolbarSkeleton />}>
            <OrganizationLeftMenu
              rolesToShow={
                isAuthorized([Roles.ROLE_ADMINISTRATOR])
                  ? [Roles.ROLE_RECRUITER, Roles.ROLE_EVERYONE]
                  : (user?.roles ?? [])
              }
            />
          </Suspense>
          <Paper shadow="xs" p="md">
            <Title order={5}>Affiliated pages</Title>
          </Paper>
          <Paper shadow="xs" p="md">
            <Title order={5}>Pages visited by others</Title>
          </Paper>
          <Paper shadow="xs" p="md">
            <Title order={5}>Pages followed by others</Title>
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
