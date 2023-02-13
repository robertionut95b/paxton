import { RoleType } from "@auth/permission.types";
import { useAuth } from "@auth/useAuth";
import OrganizationJobsTab from "@components/organization/OrganizationJobsTab";
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
import { Paper, Tabs } from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { formatISO } from "date-fns";
import { useParams } from "react-router-dom";

const todayIsoFmt = formatISO(new Date());

const OrganizationJobsPanel = () => {
  const { organizationId } = useParams();
  const { isAuthorized } = useAuth();
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
  return (
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
  );
};

export default OrganizationJobsPanel;
