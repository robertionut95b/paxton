import { RequireRoles } from "@auth/RequireRoles";
import RoleType from "@auth/RoleType";
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
import { Group, Paper, Skeleton, Tabs } from "@mantine/core";
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

  if (!organization?.getOrganizationById) return <NotFoundPage />;
  if (isLoadingOrganization) return <GenericLoadingSkeleton />;

  const OrganizationToolbar = lazy(
    () => import("@components/organization/OrganizationToolbar")
  );

  return (
    <div className="px-organization flex flex-col gap-4">
      {organizationItem && (
        <RequireRoles roles={RoleType.ROLE_RECRUITER} returnValue="null">
          <Suspense fallback={<OrganizationToolbarSkeleton />}>
            <OrganizationToolbar organization={organizationItem} />
          </Suspense>
        </RequireRoles>
      )}
      <Paper shadow={"xs"} p="md">
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
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>
      <Outlet />
    </div>
  );
}
