import IsAllowed from "@auth/IsAllowed";
import RoleType from "@auth/RoleType";
import { useAuth } from "@auth/useAuth";
import OrganizationHero from "@components/organization/OrganizationHero";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import { useGetOrganizationByIdQuery } from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Grid, Group, Paper, Skeleton, Stack, Title } from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { lazy, Suspense } from "react";
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

export default function OrganizationPage() {
  const { user, isAuthorized } = useAuth();
  const { organizationId } = useParams();
  const { data: organization, isLoading: isLoadingOrganization } =
    useGetOrganizationByIdQuery(
      graphqlRequestClient,
      {
        organizationId: organizationId as string,
      },
      {
        enabled: !!organizationId,
      }
    );

  const organizationItem = organization?.getOrganizationById;

  if (isLoadingOrganization) return <GenericLoadingSkeleton />;
  if (!organization?.getOrganizationById || !organizationItem)
    return <NotFoundPage />;

  const OrganizationToolbar = lazy(
    () => import("@components/organization/OrganizationToolbar")
  );

  const OrganizationLeftMenu = lazy(
    () => import("@components/organization/OrganizationMenu")
  );

  return (
    <Grid className="px-organization">
      <Grid.Col span={12} sm={9}>
        <Stack>
          <OrganizationHero organization={organizationItem} />
          <IsAllowed roles={[RoleType.ROLE_RECRUITER]}>
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
                isAuthorized([RoleType.ROLE_ADMINISTRATOR])
                  ? [RoleType.ROLE_RECRUITER, RoleType.ROLE_EVERYONE]
                  : user?.roles ?? []
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
