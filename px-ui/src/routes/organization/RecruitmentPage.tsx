import Breadcrumbs from "@components/layout/Breadcrumbs";
import { FieldType, Operator } from "@gql/generated";
import { Paper, Stack, Title } from "@mantine/core";
import OrganizationJobsTab from "@routes/organization/OrganizationJobsTab";
import { useNavigate, useParams } from "react-router-dom";

export default function RecruitmentPage() {
  const { organizationId } = useParams();
  const navigate = useNavigate();

  return (
    <Stack>
      <Paper shadow={"xs"} p="xs">
        <Breadcrumbs
          excludePaths={["/app/organizations/:organizationId/recruitment/"]}
        />
      </Paper>
      <Paper shadow={"xs"} p="md" className="px-organization-jobs">
        <Title mb={8} order={4}>
          Jobs in company
        </Title>
        <OrganizationJobsTab
          filters={[
            {
              key: "organization",
              fieldType: FieldType.Long,
              value: organizationId?.toString() ?? "0",
              operator: Operator.Equal,
            },
          ]}
          itemClickCb={(jl) => {
            navigate(`${jl.id}`);
            return undefined;
          }}
        />
      </Paper>
    </Stack>
  );
}
