import Breadcrumbs from "@components/layout/Breadcrumbs";
import OrganizationJobsTab from "@components/organization/OrganizationJobsTab";
import GenericLoadingSkeleton from "@components/spinners/GenericLoadingSkeleton";
import {
  FieldType,
  Operator,
  useGetOrganizationBySlugNameQuery,
} from "@gql/generated";
import graphqlRequestClient from "@lib/graphqlRequestClient";
import { Paper, Stack, Title } from "@mantine/core";
import NotFoundPage from "@routes/NotFoundPage";
import { useNavigate, useParams } from "react-router-dom";

export default function RecruitmentPage() {
  const { organizationSlug } = useParams();
  const navigate = useNavigate();

  const { data: organizationData, isInitialLoading: isLoadingOrganization } =
    useGetOrganizationBySlugNameQuery(
      graphqlRequestClient,
      {
        slugName: organizationSlug as string,
      },
      {
        enabled: !!organizationSlug,
      }
    );

  const organization = organizationData?.getOrganizationBySlugName;

  if (isLoadingOrganization) return <GenericLoadingSkeleton />;
  if (!organization) return <NotFoundPage />;

  return (
    <Stack>
      <Paper shadow={"xs"} p="xs">
        <Breadcrumbs
          excludePaths={["/app/organizations/:organizationSlug/recruitment/"]}
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
              value: organization.id.toString() ?? "",
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
