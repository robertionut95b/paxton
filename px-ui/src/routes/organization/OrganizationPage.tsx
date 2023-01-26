import IsAllowed from "@auth/IsAllowed";
import RoleType from "@auth/RoleType";
import { useAuth } from "@auth/useAuth";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import {
  FieldType,
  Operator,
  useGetOrganizationByIdQuery,
} from "@gql/generated";
import {
  BoltIcon,
  CalendarDaysIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Grid, Group, Paper, Skeleton, Stack, Tabs } from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { formatISO } from "date-fns";
import { lazy, Suspense } from "react";
import { Outlet, useParams } from "react-router-dom";
import OrganizationJobsTab from "./OrganizationJobsTab";

const todayIsoFmt = formatISO(new Date());

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
  if (!organization?.getOrganizationById) return <NotFoundPage />;

  const OrganizationToolbar = lazy(
    () => import("@components/organization/OrganizationToolbar")
  );

  const OrganizationLeftMenu = lazy(
    () => import("@components/organization/OrganizationLeftMenu")
  );

  return (
    <Stack className="px-organization">
      {organizationItem && (
        <IsAllowed roles={[RoleType.ROLE_RECRUITER]}>
          <Suspense fallback={<OrganizationToolbarSkeleton />}>
            <OrganizationToolbar organization={organizationItem} />
          </Suspense>
        </IsAllowed>
      )}
      <Grid>
        <Grid.Col sm={3} span={12}>
          <Suspense fallback={<OrganizationToolbarSkeleton />}>
            <OrganizationLeftMenu rolesToShow={user?.roles ?? []} />
          </Suspense>
        </Grid.Col>
        <Grid.Col sm={9} span={12}>
          <Paper shadow={"sm"} p="md">
            <Tabs color="violet" defaultValue="active">
              <Tabs.List grow>
                <Tabs.Tab value="active" icon={<BoltIcon width={16} />}>
                  Active jobs
                </Tabs.Tab>
                <Tabs.Tab value="future" icon={<CalendarDaysIcon width={16} />}>
                  Future jobs
                </Tabs.Tab>
                <Tabs.Tab value="expired" icon={<XMarkIcon width={16} />}>
                  Expired jobs
                </Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="active" p={"xs"}>
                <OrganizationJobsTab
                  filters={[
                    {
                      key: "organization",
                      fieldType: FieldType.Long,
                      value: organizationItem?.id.toString() ?? "0",
                      operator: Operator.Equal,
                    },
                    {
                      key: "availableTo",
                      fieldType: FieldType.Date,
                      value: todayIsoFmt,
                      operator: Operator.GreaterThanEqual,
                    },
                    {
                      key: "availableFrom",
                      fieldType: FieldType.Date,
                      value: todayIsoFmt,
                      operator: Operator.LessThanEqual,
                    },
                  ]}
                  editableItems={isAuthorized([
                    RoleType.ROLE_RECRUITER,
                    RoleType.ROLE_ADMINISTRATOR,
                  ])}
                />
              </Tabs.Panel>
              <Tabs.Panel value="future" p={"xs"}>
                <OrganizationJobsTab
                  filters={[
                    {
                      key: "organization",
                      fieldType: FieldType.Long,
                      value: organizationItem?.id.toString() ?? "0",
                      operator: Operator.Equal,
                    },
                    {
                      key: "availableFrom",
                      fieldType: FieldType.Date,
                      value: todayIsoFmt,
                      operator: Operator.GreaterThan,
                    },
                  ]}
                  editableItems={isAuthorized([
                    RoleType.ROLE_RECRUITER,
                    RoleType.ROLE_ADMINISTRATOR,
                  ])}
                />
              </Tabs.Panel>
              <Tabs.Panel value="expired" p={"xs"}>
                <OrganizationJobsTab
                  filters={[
                    {
                      key: "organization",
                      fieldType: FieldType.Long,
                      value: organizationItem?.id.toString() ?? "0",
                      operator: Operator.Equal,
                    },
                    {
                      key: "availableTo",
                      fieldType: FieldType.Date,
                      value: todayIsoFmt,
                      operator: Operator.LessThan,
                    },
                  ]}
                  editableItems={isAuthorized([
                    RoleType.ROLE_RECRUITER,
                    RoleType.ROLE_ADMINISTRATOR,
                  ])}
                />
              </Tabs.Panel>
            </Tabs>
          </Paper>
        </Grid.Col>
      </Grid>
      <Outlet />
    </Stack>
  );
}
